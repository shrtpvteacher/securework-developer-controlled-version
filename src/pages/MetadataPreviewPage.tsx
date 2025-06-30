// src/pages/MetadataPreviewPage.tsx
/*import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { deployJobContract } from '../logic/deployJobContract';
import { storeEmail } from '../logic/storeEmail';
import { ArrowLeft, ArrowDownCircle, Loader2 } from 'lucide-react';

const gradientBtn =
  'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded shadow inline-flex items-center gap-2 disabled:opacity-50';

const MetadataPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { state } = useLocation() as {
    state: { metadata?: any; metadataURI?: string; clientEmail?: string };
  };

  const uri = state?.metadataURI;
  const clientEmail = state?.clientEmail;

  // State to hold metadata, either from router or fetched from IPFS URI
  const [meta, setMeta] = useState<any>(state?.metadata || null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deployed, setDeployed] = useState<null | { jobAddress: string; jobId: string }>(null);

  useEffect(() => {
    if (!meta && uri) {
      setLoading(true);
      fetch(uri)
        .then((res) => res.json())
        .then((data) => setMeta(data))
        .catch(() => setMeta(null))
        .finally(() => setLoading(false));
    }
  }, [meta, uri]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">Loading metadata...</p>
      </div>
    );
  }

  if (!meta || !uri) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">No metadata found. Please start again.</p>
      </div>
    );
  }

  // Deploy contract handler
  const handleDeploy = async () => {
    setBusy(true);
    try {
      const { jobAddress, jobId } = await deployJobContract(uri, meta.jobPay);
      await storeEmail({
        jobAddress,
        email: clientEmail || '',
        title: meta.title,
        creatorAddress: account || '',
      });
      setDeployed({ jobAddress, jobId });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">📄 Metadata Preview</h2>

      <p className="text-sm text-gray-500 text-center italic">
        Your email is stored privately for notifications and is <strong>not</strong> included in the metadata.
      </p>

      
      <div className="border border-gray-300 p-4 rounded bg-gray-50 text-sm space-y-2 break-words">
        <div><strong>Title:</strong> {meta.title}</div>
        <div><strong>Description:</strong> {meta.description}</div>
        <div><strong>Pay:</strong> {meta.jobPay} ETH</div>
        <div><strong>Creation Fee:</strong> {meta.contractCreationFee} ETH</div>
        <div><strong>Deadline:</strong> {meta.deadline}</div>
        <div><strong>Client Address:</strong> {meta.clientAddress}</div>
        <div>
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside ml-4">
            {meta.requirements?.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Deliverables:</strong>
          <ul className="list-disc list-inside ml-4">
            {meta.deliverables?.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>IPFS URI:</strong> <br />
          <span className="break-all">{uri}</span>
        </div>
      </div>

      
      {deployed && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-md space-y-1">
          <p>✅ Job contract deployed successfully!</p>
          <p>
            <strong>Contract Address:</strong>{' '}
            <a href={`https://etherscan.io/address/${deployed.jobAddress}`} target="_blank" rel="noopener noreferrer" className="underline">
              {deployed.jobAddress}
            </a>
          </p>
          <p>
            <strong>Job ID:</strong> {deployed.jobId}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 underline hover:text-black">
          <ArrowLeft className="mr-2" /> Edit Metadata
        </button>

        {!deployed ? (
          <button onClick={handleDeploy} disabled={busy} className={gradientBtn}>
            {busy && <Loader2 className="h-5 w-5 animate-spin" />} <ArrowDownCircle className="mr-2" /> Deploy Contract
          </button>
        ) : (
          <button onClick={() => navigate('/client-dashboard')} className={gradientBtn}>
            Go to Dashboard →
          </button>
        )}
      </div>
    </div>
  );
};

export default MetadataPreviewPage;  */



// src/pages/MetadataPreviewPage.tsx
/*import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { deployJobContract } from '../logic/deployJobContract';
import { storeEmail } from '../logic/storeEmail';
import { ArrowLeft, Loader2 } from 'lucide-react';

const gradientBtn =
  'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded shadow inline-flex items-center gap-2 disabled:opacity-50';

const MetadataPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { state } = useLocation() as {
    state: { metadata?: any; metadataURI?: string; clientEmail?: string };
  };

  const uri = state?.metadataURI;
  const clientEmail = state?.clientEmail;

  // State to hold metadata, either from router or fetched from IPFS URI
  const [meta, setMeta] = useState<any>(state?.metadata || null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deployed, setDeployed] = useState<null | { jobAddress: string; jobId: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  // Fetch ETH price for USD conversion (optional polish)
  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        setEthPrice(null);
      }
    }
    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (!meta && uri) {
      setLoading(true);
      fetch(uri)
        .then((res) => res.json())
        .then((data) => setMeta(data))
        .catch(() => setMeta(null))
        .finally(() => setLoading(false));
    }
  }, [meta, uri]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">Loading metadata...</p>
      </div>
    );
  }

  if (!meta || !uri) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">No metadata found. Please start again.</p>
      </div>
    );
  }

  // Deploy contract handler
  const handleDeploy = async () => {
    setBusy(true);
    setError(null);
    try {
      const { jobAddress, jobId } = await deployJobContract(uri, meta.jobPay);
      await storeEmail({
        jobAddress,
        email: clientEmail || '',
        title: meta.title,
        creatorAddress: account || '',
      });
      setDeployed({ jobAddress, jobId });
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
      alert("Deploy failed: " + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">Job Contract Terms</h2>
      
    <p className="text-sm text-gray-500 text-center italic mb-2">
      <span>
        <strong>Your email (for deliverables):</strong>
        <span className="ml-2 text-gray-900">{clientEmail}</span>
      </span>
    </p>
    <p className="text-xs text-center text-gray-500">
      <span>
        You will receive job files via a Dropbox link to this address. Email is <strong>not</strong> included in the on-chain metadata.
      </span>
    </p>
    

      <p className="text-sm text-gray-500 text-center italic">
        Your email is stored privately for notifications and is <strong>not</strong> included in the metadata.
      </p>

      
      <div className="border border-gray-300 p-4 rounded bg-gray-50 text-sm space-y-2 break-words">
        <div><strong>Title:</strong> {meta.title}</div>
        <div><strong>Description:</strong> {meta.description}</div>
        <div>
          <strong>Pay:</strong> {meta.jobPay} ETH
          {ethPrice && meta.jobPay && (
            <span className="ml-2 text-gray-600 text-sm italic">
              (~${(parseFloat(meta.jobPay) * ethPrice).toFixed(2)} USD)
            </span>
          )}
        </div>
        <div><strong>Creation Fee:</strong> {meta.contractCreationFee} ETH</div>
        <div><strong>Client Address:</strong> {meta.clientAddress}</div>
        <div>
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside ml-4">
            {meta.requirements?.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Deliverables:</strong>
          <ul className="list-disc list-inside ml-4">
            {meta.deliverables?.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>IPFS URI:</strong> <br />
          <span className="break-all">{uri}</span>
        </div>
      </div>

  
      {error && (
        <div className="text-center text-red-600 mt-2">{error}</div>
      )}

     
      {!deployed && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleDeploy}
            disabled={busy}
            className={gradientBtn}
          >
            {busy && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
            Deploy New Job 
          </button>
        </div>
      )}

     
      {deployed && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-md space-y-1 text-center">
          <p>✅ Job contract deployed successfully!</p>
          <p>
            <strong>Contract Address:</strong>{' '}
            <a href={`https://etherscan.io/address/${deployed.jobAddress}`} target="_blank" rel="noopener noreferrer" className="underline">
              {deployed.jobAddress}
            </a>
          </p>
          <p>
            <strong>Job ID:</strong> {deployed.jobId}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-700 underline hover:text-black">
          <ArrowLeft className="mr-2" /> Edit Metadata
        </button>
        {deployed && (
          <button onClick={() => navigate('/client-dashboard')} className={gradientBtn}>
            Go to Dashboard →
          </button>
        )}
      </div>
    </div>
  );
};

export default MetadataPreviewPage;  */


// src/pages/MetadataPreviewPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { deployJobContract } from '../logic/deployJobContract';
import { storeEmail } from '../logic/storeEmail';
import { ArrowLeft, Loader2 } from 'lucide-react';

const gradientBtn =
  'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded shadow inline-flex items-center gap-2 disabled:opacity-50';

const MetadataPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { address: account } = useAccount();
  const { state } = useLocation() as {
    state: { metadata?: any; metadataURI?: string; clientEmail?: string };
  };

  const uri = state?.metadataURI;
  const clientEmail = state?.clientEmail;

  const [meta, setMeta] = useState<any>(state?.metadata || null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deployed, setDeployed] = useState<null | { jobAddress: string; jobId: string }>(null);
  const [error, setError] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchEthPrice() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );
        const data = await res.json();
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        setEthPrice(null);
      }
    }
    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (!meta && uri) {
      setLoading(true);
      fetch(uri)
        .then((res) => res.json())
        .then((data) => setMeta(data))
        .catch(() => setMeta(null))
        .finally(() => setLoading(false));
    }
  }, [meta, uri]);

  // Calculate totals
  const jobPayNum = parseFloat(meta?.jobPay || "0");
  const contractCreationFeeNum = parseFloat(meta?.contractCreationFee || "0");
  const totalETH = jobPayNum + contractCreationFeeNum;
  const totalUSD = ethPrice ? (totalETH * ethPrice).toFixed(2) : null;

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">Loading metadata...</p>
      </div>
    );
  }

  if (!meta || !uri) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">No metadata found. Please start again.</p>
      </div>
    );
  }

  const handleDeploy = async () => {
    setBusy(true);
    setError(null);
    try {
      const { jobAddress, jobId } = await deployJobContract(uri, meta.jobPay);
      await storeEmail({
        jobAddress,
        email: clientEmail || '',
        title: meta.title,
        creatorAddress: account || '',
      });
      setDeployed({ jobAddress, jobId });
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
      alert("Deploy failed: " + (err?.message || err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold text-center">Preview Job Deployment</h2>

      {/* Show client email for confirmation */}
      <p className="text-sm text-gray-500 text-center italic mb-2">
        <span>
          <strong>Your email (for deliverables):</strong>
          <span className="ml-2 text-gray-900">{clientEmail}</span>
        </span>
      </p>
      <p className="text-xs text-center text-gray-500">
        <span>
          You will receive job files via a Dropbox link to this address. Email is <strong>not</strong> included in the on-chain metadata.
        </span>
      </p>

      {/* Metadata card */}
      <div className="border border-gray-300 p-4 rounded bg-gray-50 text-sm space-y-2 break-words">
        <div><strong>Title:</strong> {meta.title}</div>
        <div><strong>Description:</strong> {meta.description}</div>
        <div>
          <strong>Pay:</strong> {meta.jobPay} ETH
          {ethPrice && meta.jobPay && (
            <span className="ml-2 text-gray-600 text-sm italic">
              (~${(parseFloat(meta.jobPay) * ethPrice).toFixed(2)} USD)
            </span>
          )}
        </div>
        <div>
          <strong>Creation Fee:</strong> {meta.contractCreationFee} ETH
          {ethPrice && meta.contractCreationFee && (
            <span className="ml-2 text-gray-600 text-sm italic">
              (~${(parseFloat(meta.contractCreationFee) * ethPrice).toFixed(2)} USD)
            </span>
          )}
        </div>

        {/* --- TOTAL COST SECTION --- */}
        <div>
          <strong>Total Cost:</strong> {totalETH} ETH
          {ethPrice && (
            <span className="ml-2 text-gray-600 text-sm italic">
              (~${totalUSD} USD)
            </span>
          )}
        </div>
        {/* --- END TOTAL COST SECTION --- */}

        <div><strong>Deadline:</strong> {meta.deadline}</div>
        <div><strong>Client Address:</strong> {meta.clientAddress}</div>
        <div>
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside ml-4">
            {meta.requirements?.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Deliverables:</strong>
          <ul className="list-disc list-inside ml-4">
            {meta.deliverables?.map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>IPFS URI:</strong> <br />
          <span className="break-all">{uri}</span>
        </div>
      </div>

      {error && (
        <div className="text-center text-red-600 mt-2">{error}</div>
      )}

      {!deployed && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleDeploy}
            disabled={busy}
            className={gradientBtn}
          >
            {busy && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
            Deploy Job Contract
          </button>
        </div>
      )}

      {deployed && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-md space-y-1 text-center">
          <p>Job contract deployed successfully!</p>
          <p>
            <strong>Contract Address:</strong>{' '}
            <a href={`https://etherscan.io/address/${deployed.jobAddress}`} target="_blank" rel="noopener noreferrer" className="underline">
              {deployed.jobAddress}
            </a>
          </p>
          <p>
            <strong>Job ID:</strong> {deployed.jobId}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            navigate(-1);
          }}
          className="flex items-center text-blue-600 hover:text-blue-800 underline font-medium"
          style={{ textDecoration: 'none' }}
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          <span>Edit Metadata</span>
        </a>
        {deployed && (
          <button
            onClick={() => navigate('/client-dashboard')}
            className={gradientBtn}
          >
            Go to Dashboard →
          </button>
        )}
      </div>
    </div>
  );
};

export default MetadataPreviewPage;
