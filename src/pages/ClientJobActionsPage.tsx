// File: src/pages/ClientJobActionsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import FundEscrowMint from "../components/FundEscrowMint";
import AssignFreelancer from "../components/AssignFreelancer";
import VerifyByClient from "../components/VerifyByClient";
import CancelBeforeAssigning from "../components/CancelBeforeAssigning";
import JobEscrowFactoryABI from "../../netlify/functions/abis/JobEscrowFactoryABI.json";
import JobEscrowABI from "../../netlify/functions/abis/JobEscrowABI.json";

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;

const ClientJobActionsPage: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const [jobAddress, setJobAddress] = useState<string>("");
  const [jobPay, setJobPay] = useState<string>("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId || !window.ethereum) {
        setError("Job ID missing or MetaMask not available");
        setLoading(false);
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const factory = new ethers.Contract(FACTORY_ADDRESS, JobEscrowFactoryABI, provider);
        
        // Get job contract address from factory
        const contractAddress = await factory.jobContracts(jobId);
        
        if (contractAddress === ethers.constants.AddressZero) {
          throw new Error("Job not found");
        }
        
        setJobAddress(contractAddress);
        
        // Get job pay amount from the job contract
        const jobContract = new ethers.Contract(contractAddress, JobEscrowABI, provider);
        const amount = await jobContract.amount();
        setJobPay(ethers.utils.formatEther(amount));
        
      } catch (err: any) {
        console.error("Error fetching job details:", err);
        setError(err.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-emerald-600 p-4 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-emerald-600 p-4 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-emerald-600 p-4">
      <div className="max-w-2xl mx-auto pt-10 space-y-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow">
          Job Actions for Job #{jobId}
        </h2>

        <div className="text-center text-white/80 mb-6">
          <p className="text-sm">Contract: {jobAddress}</p>
          <p className="text-sm">Amount: {jobPay} ETH</p>
        </div>

        <FundEscrowMint jobAddress={jobAddress} jobPay={jobPay} />
        <AssignFreelancer jobAddress={jobAddress} />
        <VerifyByClient jobId={jobId!} />
        <CancelBeforeAssigning jobAddress={jobAddress} />
      </div>
    </div>
  );
};

export default ClientJobActionsPage;