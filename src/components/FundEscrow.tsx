import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Loader2 } from 'lucide-react';
import JobEscrowABI from '../../netlify/functions/abis/JobEscrowABI.json';

interface Props {
  contractAddress: string;   // JobEscrow contract address
  jobPay: string;            // value stored in metadata (e.g. "1.25" ETH)
  onSuccess: () => void;     // callback for parent to refresh on-chain state
}

/**
 * Sends `jobPay` as msg.value to fundEscrow().
 * On-chain, the JobEscrow contract compares msg.value to its `amount` variable
 * and mints tokenId 0 to the client when they match.
 */
const FundEscrow: React.FC<Props> = ({ contractAddress, jobPay, onSuccess }) => {
  const [busy, setBusy] = useState(false);
  const [err,  setErr ] = useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setErr(null);
    try {
      if (!window.ethereum) throw new Error('Wallet not found');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer   = provider.getSigner();
      const escrow   = new ethers.Contract(contractAddress, JobEscrowABI, signer);

      // jobPay (metadata) → msg.value → compared to `amount` inside contract
      const tx = await escrow.fundEscrow({
        value: ethers.utils.parseEther(jobPay),
      });
      await tx.wait();          // tokenId 0 minted on success
      onSuccess();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1">
      <button
        disabled={busy}
        onClick={run}
        className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? 'Funding…' : `Fund ${jobPay} ETH`}
      </button>
      {err && <p className="text-xs text-red-600">{err}</p>}
    </div>
  );
};

export default FundEscrow;