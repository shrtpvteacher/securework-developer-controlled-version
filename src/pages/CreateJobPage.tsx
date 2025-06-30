

// File: src/pages/CreateJobPage.tsx
/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchContractCreationFee } from '../logic/fetchContractCreationFee';
import MetadataSetUpStep from '../components/MetadataSetUpStep';

// Simple fetchEthPrice implementation using CoinGecko API
async function fetchEthPrice(): Promise<number> {
  const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
  const data = await res.json();
  return data.ethereum.usd;
}

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

/*
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchContractCreationFee } from '../logic/fetchContractCreationFee';
import MetadataSetUpStep from '../components/MetadataSetUpStep';
import MetadataPreviewPage from './MetadataPreviewPage';

const CreateJobPage: React.FC = () => {
  const { address: account } = useAccount();

  const [creationFee, setCreationFee] = useState<string>('…');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [metadataURI, setMetadataURI] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  // Fetch contract creation fee once on mount
  useEffect(() => {
    fetchContractCreationFee().then(setCreationFee).catch(console.error);
  }, []);

  // Fetch ETH price once on mount
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      }
    }
    fetchEthPrice();
  }, []);

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

  
  const handleDeployJobContract = () => {
    if (!metadataURI || !metadata) return;

    // TODO: Add your deployment logic here
    alert('Deploy contract clicked! Implement deploy logic.');
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-2xl space-y-8">

   
      <div className="bg-gray-100 p-4 shadow-2xl rounded-md">
        <label className="text-center  text-lg block font-semibold mb-1">Enter Email Address For Deliverables Notifications</label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full border border-gray-200 p-1 rounded-md"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <p className="text-sm text-gray-600 mt-1 italic">
          Your email is used to receive deliverables and is <strong>not</strong> stored on-chain or on IPFS.
        </p>
      </div>

    

      <p className="text-center text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
  Contract Creation Fee: <span className="font-black">{creationFee} ETH</span>
          {ethPrice && (
          <span className="ml-2 text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparen">
            (~${(parseFloat(creationFee) * ethPrice).toFixed(2)} USD)
          </span>
        )}

</p>

      
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

export default CreateJobPage; */




// src/pages/CreateJobPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { fetchContractCreationFee } from '../logic/fetchContractCreationFee';
import MetadataSetUpStep from '../components/MetadataSetUpStep';

const CreateJobPage: React.FC = () => {
  const { address: account } = useAccount();
  const navigate = useNavigate();

  const [creationFee, setCreationFee] = useState<string>('…');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  // Fetch contract creation fee once on mount
  useEffect(() => {
    fetchContractCreationFee().then(setCreationFee).catch(console.error);
  }, []);

  // Fetch ETH price once on mount
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
      }
    }
    fetchEthPrice();
  }, []);

  // Called after metadata upload, routes to preview page
  const handleContinue = ({
    metadataURI,
    metadata,
  }: {
    metadataURI: string;
    metadata: any;
  }) => {
    navigate('/metadata-preview', {
      state: {
        metadata,
        metadataURI,
        clientEmail,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white shadow-2xl space-y-8">

      {/* Email input card */}
      <div className="bg-gray-100 p-4 shadow-2xl rounded-md">
        <label className="text-center text-lg block font-semibold mb-1">
          Enter Email Address For Deliverables Notifications
        </label>
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full border border-gray-200 p-1 rounded-md"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />
        <p className="text-sm text-gray-600 mt-1 italic">
          Your email is used to receive deliverables and is <strong>not</strong> stored on-chain or on IPFS.
        </p>
      </div>

      {/* Factory fee display */}
      <p className="text-center text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
        Contract Creation Fee: <span className="font-black">{creationFee} ETH</span>
        {ethPrice && (
          <span className="ml-2 text-2xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            (~${(parseFloat(creationFee) * ethPrice).toFixed(2)} USD)
          </span>
        )}
      </p>

      {/* Metadata setup and upload */}
      <MetadataSetUpStep
        clientAddress={account || ''}
        contractCreationFee={creationFee}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default CreateJobPage;
