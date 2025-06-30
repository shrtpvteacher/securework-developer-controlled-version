import React, { useState } from 'react';
import { ethers } from 'ethers';
import JobEscrowABI from '../../netlify/functions/abis/JobEscrowABI.json';

interface Props {
  jobAddress?: string;
  assignedFreelancer?: string;
  currentAccount: string;
}

const FreelancerActionCard: React.FC<Props> = ({ jobAddress: propJobAddress, assignedFreelancer, currentAccount }) => {
  const [jobAddress, setJobAddress] = useState(propJobAddress || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAccept = async () => {
    setBusy(true); setError(null); setSuccess(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      if (!jobAddress) throw new Error("Enter a job address");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(jobAddress, JobEscrowABI, signer);

      const tx = await contract.acceptJob();
      await tx.wait();

      setSuccess('Job accepted! You are now the assigned freelancer.');
    } catch (err: any) {
      setError(err?.message || 'Transaction failed');
    } finally {
      setBusy(false);
    }
  };

  if (assignedFreelancer && assignedFreelancer.toLowerCase() === currentAccount.toLowerCase()) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-2">Freelancer Actions</h3>
        <p className="mb-2 text-green-700 font-medium">
          You are already the assigned freelancer for this job!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-2">Freelancer Actions</h3>
      <label className="block font-medium mb-1">
        Job Address
        <input
          className="border border-gray-300 rounded px-3 py-2 w-full mt-1 mb-3"
          placeholder="Enter Job Address"
          value={jobAddress}
          onChange={e => setJobAddress(e.target.value)}
        />
      </label>
      <button
        onClick={handleAccept}
        disabled={busy || !jobAddress}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold px-5 py-2 rounded-xl mt-2 shadow hover:opacity-90 transition w-full"
      >
        {busy ? "Accepting..." : "Accept Job"}
      </button>
      {success && <p className="text-green-600 mt-2">{success}</p>}
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <a href="/job-board" className="block mt-4 text-blue-700 underline text-sm text-center">Back to Job Board</a>
    </div>
  );
};

export default FreelancerActionCard;
