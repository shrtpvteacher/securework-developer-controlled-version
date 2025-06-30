import { ethers } from "ethers";
import React, { useState } from "react";
import JobEscrowABI from "../../netlify/functions/abis/JobEscrowABI.json";

const AssignFreelancer: React.FC<{ jobAddress: string }> = ({ jobAddress }) => {
  const [freelancer, setFreelancer] = useState("");
  const [txLoading, setTxLoading] = useState(false);

 const getJobContract = (jobAddress: string) => {
    if (!(window as any).ethereum) throw new Error("MetaMask not found");
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(jobAddress, JobEscrowABI, signer);
  };

  const handleAssign = async () => {
    setTxLoading(true);
    try {
      const contract = getJobContract(jobAddress);
      const tx = await contract.assignFreelancer(freelancer);
      await tx.wait();
      alert("Freelancer assigned!");
    } catch (err: any) {
      alert(err?.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <h3 className="text-xl font-semibold mb-2">Assign Freelancer</h3>
      <p className="mb-4 text-gray-600">
        Enter the wallet address to assign a freelancer for job <b>#{jobAddress}</b>.
      </p>
      <input
        type="text"
        className="border border-gray-300 rounded p-2 w-full mb-3"
        placeholder="Freelancer Wallet Address"
        value={freelancer}
        onChange={e => setFreelancer(e.target.value)}
      />
      <button
        onClick={handleAssign}
        disabled={txLoading || !freelancer}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold px-5 py-2 rounded-xl mt-2 shadow hover:opacity-90 transition w-full"
      >
        {txLoading ? "Assigning..." : "Assign Freelancer"}
      </button>
    </div>
  );
};

export default AssignFreelancer;
