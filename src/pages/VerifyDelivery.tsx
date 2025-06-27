import React, { useState } from 'react';

interface VerifyDeliveryProps {
  jobAddress: string;
  jobTitle: string;
  contractAddress: string;
  jobId?: string;
}

const VerifyDelivery: React.FC<VerifyDeliveryProps> = ({ jobAddress, jobTitle, contractAddress, jobId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch client email from your storeEmails function
  async function fetchClientEmail(): Promise<string> {
    const res = await fetch(`/.netlify/functions/storeEmails?jobAddress=${jobAddress}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to fetch client email');
    }
    const data = await res.json();
    return data.creatorEmail;
  }

  // Upload file and share with client, get shared Dropbox link
  async function uploadAndShareZip(): Promise<{ sharedLinkUrl: string; dropboxFileId: string }> {
    if (!file) throw new Error('No file selected');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('jobAddress', jobAddress);
    formData.append('jobTitle', jobTitle);

    const res = await fetch('/.netlify/functions/sendToDropbox', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to upload and share file');
    }

    const { sharedLinkUrl, file: filename } = await res.json();

    // Generate dropboxFileId: For example, use filename + jobAddress + current timestamp
    const dropboxFileId = `${filename}-${jobAddress}-${Date.now()}`;

    return { sharedLinkUrl, dropboxFileId };
  }

  // Call aiVerify to release funds after email notification is guaranteed
  async function verifyOnChain(params: {
    contractAddress: string;
    dropboxFileId: string;
    dropboxLink: string;
    clientEmail: string;
    jobId?: string;
  }) {
    const res = await fetch('/.netlify/functions/aiVerify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to verify on-chain');
    }

    return res.json();
  }

  // Main submission handler
  const handleSubmit = async () => {
    if (!file) {
      setStatus('Please select a ZIP file to upload.');
      return;
    }

    setIsSubmitting(true);
    setStatus('Fetching client email...');

    try {
      const clientEmail = await fetchClientEmail();

      setStatus('Uploading ZIP and sharing with client...');
      const { sharedLinkUrl, dropboxFileId } = await uploadAndShareZip();

      setStatus('Verifying on-chain and releasing funds...');
      await verifyOnChain({
        contractAddress,
        dropboxFileId,
        dropboxLink: sharedLinkUrl,
        clientEmail,
        jobId,
      });

      setStatus('Success! Funds released and client notified.');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Submit Your Deliverable</h2>
      <input
        type="file"
        accept=".zip"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        disabled={isSubmitting}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={!file || isSubmitting}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit and Release Funds'}
      </button>
      {status && <p className="mt-4 text-gray-700">{status}</p>}
    </div>
  );
};

export default VerifyDelivery;
