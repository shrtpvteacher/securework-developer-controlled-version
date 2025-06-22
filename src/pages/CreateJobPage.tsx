import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadMetadataToIPFS } from '../logic/ipfsUploader';
import { storeEmail } from '../logic/storeEmail';
import { deployJobContract } from '../logic/deployJobContract.js';
import { fetchContractCreationFee } from '../logic/fetchContractCreationFee.js';
import { useAccount } from 'wagmi';

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobPay: '',
    requirements: [''],
    deliverables: [''],
    clientEmail: '',
    deadline: ''
  });

  const [creationFee, setCreationFee] = useState<string>('...');

  useEffect(() => {
    const loadFee = async () => {
      const fee = await fetchContractCreationFee();
      setCreationFee(fee);
    };
    loadFee();
  }, []);

  const handleArrayChange = (index: number, field: 'requirements' | 'deliverables', value: string) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const addArrayField = (field: 'requirements' | 'deliverables') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleSubmit = async () => {
    try {
      const metadata = {
        title: formData.title,
        description: formData.description,
        jobPay: formData.jobPay,
        requirements: formData.requirements,
        deliverables: formData.deliverables,
        deadline: formData.deadline,
        clientEmail: formData.clientEmail,
        clientAddress: account || '',
        createdAt: new Date().toISOString()
      };

      const metadataURI = await uploadMetadataToIPFS(metadata);
      const newJobAddress = await deployJobContract(metadataURI, formData.jobPay);

      await storeEmail({
        jobAddress: newJobAddress,
        email: formData.clientEmail,
        title: formData.title,
        creatorAddress: account || ''
      });

      navigate('/client-dashboard');
    } catch (err) {
      console.error('Job creation failed:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-3xl font-bold mb-4 text-center">Create a New Job Contract</h1>
      <p className="text-center text-gray-700 mb-6">
        Cost to create this contract: <span className="font-semibold">{creationFee} ETH</span>
      </p>

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

        <input
          type="email"
          placeholder="Client Email Address"
          className="w-full border p-2 rounded"
          value={formData.clientEmail}
          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
        />

        <input
          type="date"
          className="w-full border p-2 rounded"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        />

        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
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
            className="text-blue-600 underline text-sm"
            onClick={() => addArrayField('requirements')}
          >
            + Add another requirement
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Deliverables</h2>
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
            className="text-blue-600 underline text-sm"
            onClick={() => addArrayField('deliverables')}
          >
            + Add another deliverable
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 mt-6"
        >
          Submit Job Contract
        </button>
      </div>
    </div>
  );
};

export default CreateJobPage;