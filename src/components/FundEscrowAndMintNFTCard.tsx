// src/components/FundEscrowAndMintNFTCard.tsx
import React, { useState } from 'react';
import { ethers } from 'ethers';
import JobEscrowABI from '../../netlify/functions/abis/JobEscrowABI.json';

type Props = {
  jobAddress: string;
  jobPay: string; // as string, e.g. "0.05"
  onFunded?: () => void;
};

const FundEscrowAndMintNFTCard: React.FC<Props> = ({ jobAddress, jobPay, onFunded }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFundAndMint = async () => {
    setBusy(true); setError(null);
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(jobAddress, JobEscrowABI, signer);

      // Call your contract's fund-and-mint method.
      // Update this function name if your contract differs!
      const tx = await contract.fundEscrowAndMintNFT({
        value: ethers.utils.parseEther(jobPay)
      });
      await tx.wait();
      onFunded && onFunded();
    } catch (err: any) {
      setError(err?.message || 'Transaction failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto space-y-4">
      <h3 className="text-xl font-semibold text-center">Fund Escrow & Mint NFT #0</h3>
      <p className="text-gray-600 text-center">
        Deposit <strong>{jobPay} ETH</strong> into escrow and mint NFT #0 to yourself as the client.
      </p>
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex justify-center">
        <button
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-6 rounded shadow"
          disabled={busy}
          onClick={handleFundAndMint}
        >
          {busy ? "Processing..." : "Fund Escrow & Mint NFT"}
        </button>
      </div>
    </div>
  );
};

export default FundEscrowAndMintNFTCard;