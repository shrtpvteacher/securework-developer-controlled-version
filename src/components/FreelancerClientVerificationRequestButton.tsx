// src/components/FreelancerClientVerificationRequestButton.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface Props {
  contractAddress: string;
  provider: ethers.providers.Web3Provider;
  freelancerAddress: string;
}

const FreelancerClientVerificationRequestButton: React.FC<Props> = ({
  contractAddress,
  provider,
  freelancerAddress,
}) => {
  const [canRequest, setCanRequest] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Checking verification request eligibility...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const abi = [
    'function getJobInfo() view returns (address client, address freelancer, uint8 aiFailCount)',
    'function requestClientVerification() external',
  ];

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const jobInfo = await contract.getJobInfo();

        const { freelancer, aiFailCount } = jobInfo;

        if (freelancer.toLowerCase() !== freelancerAddress.toLowerCase()) {
          setCanRequest(false);
          setStatusMsg('You are not authorized to request verification for this job.');
          return;
        }

        if (aiFailCount >= 3) {
          setCanRequest(true);
          setStatusMsg('You can request manual client verification (AI failed 3+ times).');
          return;
        }

        setCanRequest(false);
        setStatusMsg(`Cannot request manual verification yet. AI failure count: ${aiFailCount}`);
      } catch (err: any) {
        setCanRequest(false);
        setStatusMsg('Error fetching job status.');
      }
    };

    checkEligibility();
  }, [contractAddress, provider, freelancerAddress]);

  const handleRequest = async () => {
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const signerAddress = await signer.getAddress();
      if (signerAddress.toLowerCase() !== freelancerAddress.toLowerCase()) {
        throw new Error('You are not authorized freelancer for this job');
      }

      const tx = await contract.requestClientVerification();
      await tx.wait();

      setSuccessMsg('Client verification requested successfully. The client will be notified.');
      setCanRequest(false);
      setStatusMsg('Verification request sent.');
    } catch (err: any) {
      const message = err?.error?.message || err?.message || 'Request failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <p className="mb-2 font-semibold">{statusMsg}</p>
      <button
        onClick={handleRequest}
        disabled={!canRequest || loading}
        className={`py-2 px-4 rounded font-semibold text-white transition-colors ${
          canRequest
            ? 'bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? 'Requesting...' : 'Request Client Verification'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {successMsg && <p className="text-green-600 mt-2">{successMsg}</p>}
    </div>
  );
};

export default FreelancerClientVerificationRequestButton;
