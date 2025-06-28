

// File: src/pages/CreateJobPage.tsx
/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchContractCreationFee } from '../logic/fetchContractCreationFee';
import MetadataSetUpStep from '../components/MetadataSetUpStep';

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();

  const [factoryFee, setFactoryFee] = useState<string>('…');
  const [clientEmail, setClientEmail] = useState<string>('');

  
  useEffect(() => {
    fetchContractCreationFee().then(setFactoryFee);
  }, []);

  
  const handleContinue = ({
    metadataURI,
    metadata,
  }: {
    metadataURI: string;
    metadata: any;
  }) => {
    navigate('/create-job/preview', {
      state: {
        metadataURI,
        metadata,
        clientEmail, // used later by storeEmail
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-xl space-y-8">
      
      <div className="bg-gray-100 p-4 rounded-md">
        <label className="block font-semibold mb-1">Notification Email</label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full border border-gray-300 p-2 rounded-md"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <p className="text-sm text-gray-600 mt-1 italic">
          Your email remains private and is <strong>not</strong> stored on-chain or on IPFS.
        </p>
      </div>

      
      <p className="text-center text-gray-700">
        Factory creation fee:&nbsp;
        <span className="font-semibold">{factoryFee} ETH</span>
      </p>

     
      <MetadataSetUpStep
        clientAddress={account || ''}
        contractCreationFee={factoryFee}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default CreateJobPage; */





// src/pages/CreateJobPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchContractCreationFee } from '../logic/fetchContractCreationFee';
import MetadataSetUpStep from '../components/MetadataSetUpStep';

const CreateJobPage: React.FC = () => {
  // const navigate = useNavigate();
  const { address: account } = useAccount();

  const [creationFee, setCreationFee] = useState<string>('…');
  const [clientEmail, setClientEmail] = useState<string>('');

  // New state for uploaded metadata URI and metadata object
  const [metadataURI, setMetadataURI] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any | null>(null);

  /* fetch fee once on mount */
  useEffect(() => {
    fetchContractCreationFee().then(setCreationFee);
  }, []);

  /* called once metadata has been uploaded */
  const handleContinue = ({
    metadataURI,
    metadata,
  }: {
    metadataURI: string;
    metadata: any;
  }) => {
    setMetadataURI(metadataURI);
    setMetadata(metadata);
  };

  /* placeholder for deploy contract logic */
  const handleDeployJobContract = () => {
    if (!metadataURI || !metadata) return;

    // TODO: Add your deployment logic here
    alert('Deploy contract clicked! Implement deploy logic.');
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-xl space-y-8">

      {/* Email input card */}
      <div className="bg-gray-100 p-4 rounded-md">
        <label className="text-center block font-semibold mb-1">Enter Email Address For Deliverables Notifications</label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full border border-gray-300 p-2 rounded-md"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <p className="text-sm text-gray-600 mt-1 italic">
          Your email is used to receive deliverables and is <strong>not</strong> stored on-chain or on IPFS.
        </p>
      </div>

      {/* Factory fee display */}

      <p className="text-center bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text-lg font-bold text-transparent">
        Contract Creation Fee:&nbsp;
        <span className="font-semibold">{creationFee} ETH</span>
      </p>

      {/* Conditional rendering: show upload step OR deploy button */}
      {!metadataURI ? (
        <MetadataSetUpStep
          clientAddress={account || ''}
          contractCreationFee={creationFee}
          onContinue={handleContinue}
        />
      ) : (
        <div>
          <p className="mb-4 text-green-700">
            ✅ Metadata uploaded:{' '}
            <a href={metadataURI} target="_blank" rel="noreferrer" className="underline">
              {metadataURI}
            </a>
          </p>

          <button
            onClick={handleDeployJobContract}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow hover:opacity-90"
          >
            Deploy Job Contract to Blockchain
          </button>

          <button
            onClick={() => {
              setMetadataURI(null);
              setMetadata(null);
            }}
            className="ml-4 underline text-sm text-gray-600 hover:text-gray-900"
          >
            Edit Metadata
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateJobPage;
