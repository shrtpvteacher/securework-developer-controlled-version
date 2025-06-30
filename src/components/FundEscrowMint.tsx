import React, { useState } from "react";
import { ethers } from "ethers";
import JobEscrowABI from "../../netlify/functions/abis/JobEscrowABI.json";

const FundEscrowMint: React.FC<{ jobAddress: string, jobPay: string }> = ({ jobAddress, jobPay }) => {
  const [ethAmount, setEthAmount] = useState("");
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

   const getJobContract = (jobAddress: string) => {
    if (!(window as any).ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(jobAddress, JobEscrowABI, signer);
  };

  const handleFund = async () => {
    setTxLoading(true);
    setError(null);
    try {
      const contract = getJobContract(jobAddress);
      // Make sure the function name below matches your contract!
      const tx = await contract.fundEscrowAndMint({
        value: ethers.utils.parseEther(jobPay),
      });
      await tx.wait();
      alert("Escrow funded and NFT minted!");
    } catch (err: any) {
      setError(err?.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-2">Fund Escrow & Mint NFT</h3>
      <p className="mb-4 text-gray-600">
        Fund escrow and mint client NFT for the job <b>#{jobAddress}</b>.
      </p>
      <input
        type="number"
        step="any"
        className="border border-gray-300 rounded p-2 w-full mb-3"
        placeholder="Amount in ETH"
        value={ethAmount}
        onChange={e => setEthAmount(e.target.value)}
      />
      <button
        onClick={handleFund}
        disabled={txLoading || !ethAmount}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold px-5 py-2 rounded-xl mt-2 shadow hover:opacity-90 transition w-full"
      >
        {txLoading ? "Funding..." : "Fund & Mint"}
      </button>
    </div>
  );
};

export default FundEscrowMint;
