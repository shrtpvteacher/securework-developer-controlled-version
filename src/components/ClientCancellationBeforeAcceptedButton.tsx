// src/components/ClientCancellationBeforeAcceptedButton.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contractAddress: string;
  provider: ethers.providers.Web3Provider;
  clientAddress: string;
}

const ClientCancellationBeforeAcceptedButton: React.FC<Props> = ({ contractAddress, provider, clientAddress }) => {
  const [canCancel, setCanCancel] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Checking cancellation eligibility...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ABI fragment for contract read and cancel function
  const abi = [
    'function getJobInfo() view returns (address client, address freelancer, uint256 acceptedAt)',
    'function cancelJob() external',
  ];

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const jobInfo = await contract.getJobInfo();
        const { client, freelancer } = jobInfo;

        if (client.toLowerCase() !== clientAddress.toLowerCase()) {
          setCanCancel(false);
          setStatusMsg('You are not authorized to cancel this job.');
          return;
        }

        if (freelancer === ethers.constants.AddressZero) {
          setCanCancel(true);
          setStatusMsg('Cancellation allowed: freelancer has not accepted the job yet.');
          return;
        }

        setCanCancel(false);
        setStatusMsg('Cancellation not allowed: freelancer has already accepted the job.');
      } catch (err: any) {
        setCanCancel(false);
        setStatusMsg('Error fetching job info.');
      }
    };

    checkEligibility();
  }, [contractAddress, provider, clientAddress]);

  const handleCancel = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.cancelJob();
      await tx.wait();
      setSuccessMsg('Job cancelled successfully.');
      setCanCancel(false);
      setStatusMsg('Job has been cancelled.');
    } catch (err: any) {
      const message = err?.error?.message || err?.message || 'Cancellation failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="mb-2 font-semibold">{statusMsg}</p>
      <button
        onClick={handleCancel}
        disabled={!canCancel || loading}
        className={`py-2 px-4 rounded text-white ${
          canCancel ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Cancelling...' : 'Cancel Job'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
    </div>
  );
};

export default ClientCancellationBeforeAcceptedButton;
