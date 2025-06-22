
import React, { useState } from 'react';
import { uploadMetadataToIPFS } from '../logic/ipfsUploader';
import { storeEmail } from '../logic/storeEmail';

import { fundEscrow } from '../logic/fundEscrow';
import { useWallet } from '../context/WalletContext';

const CreateJobModal = ({ onClose }) => {
  const { account } = useWallet();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobPay: '',
    clientEmail: '',
    requirements: [''],
    deliverables: ['']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleArrayChange = (
  index: number,
  field: 'requirements' | 'deliverables',
  value: string
) => {
  const updatedArray = [...formData[field]];
  updatedArray[index] = value;
  setFormData((prev) => ({ ...prev, [field]: updatedArray }));
};

const addArrayField = (field: 'requirements' | 'deliverables') => {
  setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const metadata = {
      title: formData.title,
      description: formData.description,
      jobPay: formData.jobPay,
      clientrAddress: account,
      requirements: formData.requirements,
      deliverables: formData.deliverables,
      createdAt: new Date().toISOString(),
    };

    try {
      const metadataURI = `ipfs://${await uploadMetadataToIPFS(metadata)}`;
        const jobAddress = await deployJobEscrow(metadataURI, formData.jobPay);
      await storeEmail({ email: formData.clientEmail, address: account });
      alert('Job created and funded successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to create job.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">Create New Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" placeholder="Job Title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded" />
          <textarea name="description" placeholder="Job Description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded" />
          <input name="price" placeholder="Price in ETH" value={formData.jobPay} onChange={handleInputChange} className="w-full p-2 border rounded" />
          <input name="creatorEmail" placeholder="Your Email" value={formData.clientEmail} onChange={handleInputChange} className="w-full p-2 border rounded" />

          <div>
            <label className="block font-medium">Requirements:</label>
            {formData.requirements.map((req, i) => (
              <input key={i} value={req} onChange={(e) => handleArrayChange(i, 'requirements', e.target.value)} className="w-full p-2 border rounded my-1" />
            ))}
            <button type="button" onClick={() => addArrayField('requirements')} className="text-blue-500 text-sm">+ Add Requirement</button>
          </div>

          <div>
            <label className="block font-medium">Deliverables:</label>
            {formData.deliverables.map((del, i) => (
              <input key={i} value={del} onChange={(e) => handleArrayChange(i, 'deliverables', e.target.value)} className="w-full p-2 border rounded my-1" />
            ))}
            <button type="button" onClick={() => addArrayField('deliverables')} className="text-blue-500 text-sm">+ Add Deliverable</button>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Create Job</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
