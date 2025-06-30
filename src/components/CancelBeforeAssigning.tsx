import React, { useState } from "react";

import { ethers } from "ethers";
import JobEscrowABI from "../../netlify/functions/abis/JobEscrowABI.json";


const CancelBeforeAssigning: React.FC<{ jobAddress: string }> = ({ jobAddress }) => {
  const [txLoading, setTxLoading] = useState(false);

  // Helper function goes here, INSIDE the component:
  const getJobContract = (jobAddress: string) => {
    if (!(window as any).ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(jobAddress, JobEscrowABI, signer);
  };


   const handleCancel = async () => {
    setTxLoading(true);
    try {
      const contract = getJobContract(jobAddress);
      const tx = await contract.cancelBeforeAssigning();
      await tx.wait();
      alert("Job canceled!");
    } catch (err: any) {
      alert(err?.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-2">Cancel Before Assigning</h3>
      <p className="mb-4 text-gray-600">
        Client: Cancel this job (unfunded or not yet assigned) for job <b>#{jobAddress}</b>.
      </p>
      <button
        onClick={handleCancel}
        disabled={txLoading}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold px-5 py-2 rounded-xl mt-2 shadow hover:opacity-90 transition w-full"
      >
        {txLoading ? "Cancelling..." : "Cancel Job"}
      </button>
    </div>
  );
};

export default CancelBeforeAssigning;
