// src/components/SetFreelancerCard.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import JobEscrowABI from '../abis/JobEscrowABI.json';

type Props = {
  jobAddress: string;
  onSet?: (freelancer: string) => void;
};

const isValidWallet = (address: string) =>
  /^0x[a-fA-F0-9]{40}$/.test(address);

const SetFreelancerCard: React.FC<Props> = ({ jobAddress, onSet }) => {
  const [freelancer, setFreelancer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetFreelancer = async () => {
    setBusy(true); setError(null);
    try {
      if (!isValidWallet(freelancer)) throw new Error("Invalid address");
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(jobAddress, JobEscrowABI, signer);

      // Call your contract's setFreelancer method
      const tx = await contract.setFreelancer(freelancer);
      await tx.wait();
      onSet && onSet(freelancer);
    } catch (err: any) {
      setError(err?.message || 'Failed to set freelancer');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto space-y-6">
      <h3 className="text-xl font-semibold text-center">Assign Freelancer</h3>
      <input
        className="w-full border p-2 rounded"
        placeholder="Freelancer wallet address (0x...)"
        value={freelancer}
        onChange={e => setFreelancer(e.target.value)}
        disabled={busy}
      />
      {freelancer && !isValidWallet(freelancer) && (
        <div className= "text-xs mt-1">Invalid wallet address</div>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex justify-center">
        <button
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow"
          disabled={busy || !isValidWallet(freelancer)}
          onClick={handleSetFreelancer}
        >
          {busy ? "Setting..." : "Set Freelancer"}
        </button>
      </div>
    </div>
  );
};

export default SetFreelancerCard;
