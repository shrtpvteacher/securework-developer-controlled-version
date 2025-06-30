// src/pages/MetadataPreviewPage.tsx
import React, { useState, useEffect } from 'react';
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

  // Router state provides metadata, URI, and private email
  const { state } = useLocation() as {
    state: { metadata: any; metadataURI: string; clientEmail: string };
  };

  const meta = state?.metadata;
  const uri = state?.metadataURI;
  const clientEmail = state?.clientEmail;

  const [fetchedMeta, setFetchedMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [busy, setBusy] = useState(false);
  const [deployed, setDeployed] = useState<null | {
    jobAddress: string;
    jobId: string;
  }>(null);

  // Use metadata from router state or fetch it from IPFS if missing
  useEffect(() => {
    if (!meta && uri) {
      setLoading(true);
      fetch(uri)
        .then(res => res.json())
        .then(data => setFetchedMeta(data))
        .catch(() => setFetchedMeta(null))
        .finally(() => setLoading(false));
    }
  }, [meta, uri]);

  const dataToDisplay = meta || fetchedMeta;

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">Loading metadata...</p>
      </div>
    );
  }

  if (!dataToDisplay || !uri) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <p className="text-gray-600">No metadata found. Please start again.</p>
      </div>
    );
  }

  // Deploy the JobEscrow and store email (but stay on this page)
  const handleDeploy = async () => {
    setBusy(true);
    try {
      const { jobAddress, jobId } = await deployJobContract(uri, dataToDisplay.jobPay);

      await storeEmail({
        jobAddress,
        email: clientEmail,
        title: dataToDisplay.title,
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

      {/* Public metadata card */}
      <div className="border border-gray-300 p-4 rounded bg-gray-50 text-sm space-y-2">
        <div><strong>Title:</strong> {dataToDisplay.title}</div>
        <div><strong>Description:</strong> {dataToDisplay.description}</div>
        <div><strong>Pay:</strong> {dataToDisplay.jobPay} ETH</div>
        <div><strong>Creation Fee:</strong> {dataToDisplay.contractCreationFee} ETH</div>
        <div><strong>Deadline:</strong> {dataToDisplay.deadline}</div>
        <div><strong>Client Address:</strong> {dataToDisplay.clientAddress}</div>
        <div>
          <strong>Requirements:</strong>
          <ul className="list-disc list-inside ml-4">
            {(dataToDisplay.requirements || []).map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>Deliverables:</strong>
          <ul className="list-disc list-inside ml-4">
            {(dataToDisplay.deliverables || []).map((d: string, i: number) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <strong>IPFS URI:</strong>{' '}
          <span className="break-all">{uri}</span>
        </div>
      </div>

      {/* Success banner */}
      {deployed && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-md space-y-1">
          <p>✅ Job contract deployed successfully!</p>
          <p>
            <strong>Contract Address:</strong>{' '}
            <a
              href={`https://etherscan.io/address/${deployed.jobAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
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

export default MetadataPreviewPage;
