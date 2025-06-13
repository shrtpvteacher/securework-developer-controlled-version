// src/components/CreateJobModal.tsx

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useWallet } from '../context/WalletContext';
import { uploadMetadataToIPFS } from '../logic/ipfsUploader';
import { storeEmail } from '../logic/storeEmail';
import { deployJobContract } from '../logic/deployJobContract';
import { getEthPrice } from '../logic/getEthPrice';

interface CreateJobModalProps {
  onClose: () => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ onClose }) => {
  const { addJob } = useJobs();
  const { account } = useWallet();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [ethUsd, setEthUsd] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    freelancerAddress: '',
    creatorEmail: '',
    freelancerEmail: '',
    requirements: [''],
    deliverables: ['']
  });

  useEffect(() => {
    getEthPrice().then(setEthUsd);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'requirements' | 'deliverables', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'requirements' | 'deliverables') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'requirements' | 'deliverables', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleCreateJob = async () => {
    setIsLoading(true);
    try {
      const metadata = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        freelancerAddress: formData.freelancerAddress,
        creatorAddress: account,
        creatorEmail: formData.creatorEmail,
        freelancerEmail: formData.freelancerEmail,
        requirements: formData.requirements,
        deliverables: formData.deliverables
      };

      const metadataURI = await uploadMetadataToIPFS(metadata);
      const contractAddress = await deployJobContract(metadataURI, formData.price);

      await storeEmail({
        jobAddress: contractAddress,
        email: formData.creatorEmail,
        title: formData.title,
        creatorAddress: account || ''
      });

      const newJob = {
        id: contractAddress,
        title: formData.title,
        description: formData.description,
        price: formData.price,
        clientAddress: account!,
        freelancerAddress: formData.freelancerAddress,
        status: 'created' as const,
        createdAt: new Date(),
        metadataURI,
        contractAddress
      };

      addJob(newJob);
      onClose();
    } catch (err) {
      console.error('Error creating job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.title && formData.description && formData.price;
      case 2:
        return formData.freelancerAddress && formData.requirements.some(r => r.trim());
      case 3:
        return formData.deliverables.some(d => d.trim());
      case 4:
        return formData.creatorEmail.includes('@');
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Job</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && <div className={`h-0.5 w-8 mx-2 ${
                  step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                }`} />}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Step {step} of 4: {['Basic Information', 'Requirements', 'Deliverables', 'Emails & Create'][step - 1]}
          </div>
        </div>

        <div className="p-6">
          {/* Add your UI fields for each step here */}
          {/* Example: Step 1 shows title, description, price */}
          {/* Example: Step 4 shows email fields and a submit button */}
        </div>

        <div className="flex justify-between p-6 border-t border-gray-200">
          <button onClick={() => setStep(step - 1)} disabled={step === 1} className="text-gray-500">
            Back
          </button>
          {step < 4 ? (
            <button onClick={() => isStepValid() && setStep(step + 1)} className="text-blue-600 font-medium">
              Next
            </button>
          ) : (
            <button onClick={handleCreateJob} disabled={!isStepValid() || isLoading} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              {isLoading ? 'Creating...' : 'Create Job'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;