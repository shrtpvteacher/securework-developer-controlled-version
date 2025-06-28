// MetadataSetUpStep.tsx

import React, { useState } from 'react';
import { uploadMetadataToIPFS } from '../logic/ipfsUploader';
import { Loader2 } from 'lucide-react';
import { create } from 'domain';

type Props = {
  clientAddress: string;
  contractCreationFee: string;
  onContinue: (args: { metadataURI: string; metadata: any }) => void;
};

const MetadataSetUpStep: React.FC<Props> = ({ clientAddress, contractCreationFee, onContinue }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobPay: '',
    requirements: [''],
    deliverables: ['']
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedURI, setUploadedURI] = useState<string | null>(null);
  const [uploadedMetadata, setUploadedMetadata] = useState<any | null>(null);

  const handleArrayChange = (index: number, field: 'requirements' | 'deliverables', value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field: 'requirements' | 'deliverables') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleUpload = async () => {
    setIsUploading(true);
    const metadata = {
      ...formData,
      clientAddress,
      contractCreationFee,
      createdAt: new Date().toISOString()
    };

    try {
      const uri = await uploadMetadataToIPFS(metadata);
      setUploadedURI(uri);
      setUploadedMetadata(metadata);
    } catch (err) {
      console.error('IPFS upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Job Title"
        className="w-full border p-2 rounded"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />
      <textarea
        placeholder="Job Description"
        className="w-full border p-2 rounded"
        rows={4}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Pay Amount (in ETH)"
        className="w-full border p-2 rounded"
        value={formData.jobPay}
        onChange={(e) => setFormData({ ...formData, jobPay: e.target.value })}
      />
      

      <div>
        <h2 className="text-lg font-semibold mb-2">Requirements</h2>
        {formData.requirements.map((req, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Requirement ${idx + 1}`}
            className="w-full border p-2 mb-2 rounded"
            value={req}
            onChange={(e) => handleArrayChange(idx, 'requirements', e.target.value)}
          />
        ))}
        <button
          type="button"
          className="text-blue-600 underline text-sm"
          onClick={() => addArrayField('requirements')}
        >
          + Add Requirement
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Deliverables</h2>
        {formData.deliverables.map((del, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Deliverable ${idx + 1}`}
            className="w-full border p-2 mb-2 rounded"
            value={del}
            onChange={(e) => handleArrayChange(idx, 'deliverables', e.target.value)}
          />
        ))}
        <button
          type="button"
          className="text-blue-600 underline text-sm"
          onClick={() => addArrayField('deliverables')}
        >
          + Add Deliverable
        </button>
      </div>

      <div className="flex justify-center items-center">
  <button
    onClick={handleUpload}
    disabled={isUploading}
    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow hover:opacity-90"
  >
    {isUploading ? (
      <span className="flex items-center space-x-2">
        <Loader2 className="animate-spin h-5 w-5" />
        <span>Uploading...</span>
      </span>
    ) : (
      'Upload Metadata to IPFS'
    )}
  </button>
</div>

        {uploadedURI && (
          <p className="text-green-700 text-sm">
            ✅ Successfully uploaded to IPFS:{' '}
            <a href={uploadedURI} target="_blank" rel="noopener noreferrer" className="underline text-blue-700">
              View URI
            </a>
          </p>
        )}
      
      {uploadedURI && uploadedMetadata && (
         <div className="flex justify-center">
        <button
          onClick={() => onContinue({ metadataURI: uploadedURI as string, metadata: uploadedMetadata })}
          className="mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow hover:opacity-90"
        >
          Preview Metadata →
        </button>
         </div>
      )}
    </div>
  );
};

export default MetadataSetUpStep;
