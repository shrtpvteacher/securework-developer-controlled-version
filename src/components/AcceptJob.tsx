// src/components/AcceptJob.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import JobEscrowABI from '../../netlify/functions/abis/JobEscrowABI.json';

interface AcceptJobProps {
  contractAddress: string;   // address of the JobEscrow instance
  onSuccess?: () => void;    // callback after successful accept
}

const btn =
  'bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium ' +
  'inline-flex items-center gap-1 disabled:opacity-50';

const AcceptJob: React.FC<AcceptJobProps> = ({ contractAddress, onSuccess }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setBusy(true);
    setError(null);

    try {
      if (!window.ethereum) throw new Error('Wallet provider not found');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer   = provider.getSigner();
      const escrow   = new ethers.Contract(contractAddress, JobEscrowABI, signer);

      const tx = await escrow.acceptJob();  // ← on-chain call
      await tx.wait();                      // wait for mining

      onSuccess?.();                        // let parent refetch status
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Accept failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1">
      <button onClick={handleAccept} disabled={busy} className={btn}>
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? 'Accepting…' : 'Accept Job'}
      </button>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default AcceptJob;
