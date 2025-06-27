// src/pages/VerifyDeliveryPage.tsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyDeliveryPage: React.FC = () => {
  const { contractAddress, jobId, jobTitle, jobAddress } = useParams<{
    contractAddress: string;
    jobId: string;
    jobTitle: string;
    jobAddress: string;
  }>();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // SHA-256 hashing utility to create dropboxFileId
  async function sha256(input: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith(".zip")) {
        setError("Only ZIP files are accepted.");
        setFile(null);
        return;
      }
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a ZIP file to upload.");
      return;
    }
    if (!contractAddress || !jobAddress || !jobTitle) {
      setError("Missing job or contract information.");
      return;
    }

    setSubmitting(true);
    setStatus("Uploading ZIP and sharing with client...");
    setError(null);

    try {
      // Upload to Dropbox via Netlify function
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobAddress", jobAddress);
      formData.append("jobTitle", jobTitle);

      const uploadRes = await fetch("/.netlify/functions/sendToDropbox", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const errData = await uploadRes.json();
        throw new Error(errData.error || "Dropbox upload failed.");
      }

      const { sharedLinkUrl, clientEmail, file: filename } = await uploadRes.json();

      if (!clientEmail) {
        throw new Error("Client email not found in upload response.");
      }

      setStatus("Generating file ID...");
      const dropboxFileId = await sha256(sharedLinkUrl + filename + Date.now());

      setStatus("Verifying on-chain and releasing funds...");

      // Call aiVerify Netlify function to release funds
      const verifyRes = await fetch("/.netlify/functions/aiVerify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractAddress,
          jobId,
          dropboxFileId,
          dropboxLink: sharedLinkUrl,
          clientEmail,
        }),
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        throw new Error(errData.error || "On-chain verification failed.");
      }

      setSuccess(true);
      setStatus("Success! Funds released and client notified.");
    } catch (err: any) {
      setError(err.message || "Submission failed.");
      setStatus("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Submit Your Final Deliverables</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      {success ? (
        <>
          <div className="bg-emerald-100 text-emerald-800 p-4 rounded shadow mb-6">
            <strong>Submission successful!</strong>
            <div className="mt-2">
              The client has been notified and your Dropbox delivery has been recorded.
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Back to Dashboard
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="zipUpload"
            className="block text-left mb-2 font-semibold"
          >
            Upload ZIP file containing all deliverables:
          </label>
          <input
            type="file"
            id="zipUpload"
            accept=".zip"
            onChange={handleFileChange}
            disabled={submitting}
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="submit"
            disabled={!file || submitting}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            {submitting ? "Submitting..." : "Submit and Release Funds"}
          </button>

          {status && <p className="mt-4 text-gray-700">{status}</p>}
        </form>
      )}
    </div>
  );
};

export default VerifyDeliveryPage;
