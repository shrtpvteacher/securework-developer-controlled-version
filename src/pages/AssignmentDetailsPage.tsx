/**
 * AssignmentDetails.tsx
 * Displays assignment info (from on-chain/IPFS): requirements, deliverables, pay, client address, jobId, contract address, etc.
 * Clicking the submit button navigates to the AI review results page.
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import JobABI from "../../netlify/functions/abis/JobEscrowABI.json";

// Helper: Convert ipfs://... to HTTP gateway
const ipfsToHttp = (ipfsUri: string) =>
  ipfsUri.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");

type Metadata = {
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  payAmount: string;
  clientAddress: string;
};

const AssignmentDetails: React.FC = () => {
  const { jobId, contractAddress } = useParams<{ jobId: string; contractAddress: string }>();
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      if (!jobId || !contractAddress) return;
      setLoading(true);

      try {
        // 1. Read jobMetadataURI from contract
        const provider = new ethers.providers.JsonRpcProvider(import.meta.env.SEPOLIA_RPC_URL);
        const contract = new ethers.Contract(contractAddress, JobABI, provider);
        const ipfsUri = await contract.jobMetadataURI(jobId);
        const httpUrl = ipfsToHttp(ipfsUri);

        // 2. Fetch metadata from IPFS
        const metaRes = await fetch(httpUrl);
        if (!metaRes.ok) throw new Error("Metadata fetch failed");
        const meta = await metaRes.json();
        setMetadata(meta);
      } catch (err) {
        setMetadata(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [jobId, contractAddress]);

  // Handler for button click: navigates to AIReviewResults page with necessary params
  const handleSubmitForReview = () => {
    navigate(`/ai-review/${contractAddress}/${jobId}`);
  };

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading assignment details...</div>;
  }

  if (!metadata) {
    return <div className="p-8 text-center text-red-500">Assignment not found or error loading data.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-8">
      {/* Job ID and Contract Address at the top */}
      <div className="mb-5 text-xs text-gray-500 text-center">
        <div>
          <span className="font-semibold">Job ID:</span> <span className="font-mono">{jobId}</span>
        </div>
        <div>
          <span className="font-semibold">Contract Address:</span>{" "}
          <span className="font-mono">{contractAddress}</span>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">{metadata.title}</h1>
      <div className="mb-3 text-gray-600">{metadata.description}</div>

      {/* Pay Amount */}
      <div className="mb-2">
        <span className="font-semibold">Pay Amount:</span>{" "}
        <span className="text-green-800">{metadata.payAmount} ETH</span>
      </div>
      {/* Client Address */}
      <div className="mb-2">
        <span className="font-semibold">Client Address:</span>{" "}
        <span className="font-mono text-blue-700">{metadata.clientAddress}</span>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">Requirements</h2>
        <ul className="list-disc list-inside ml-4">
          {metadata.requirements.map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-1">Deliverables</h2>
        <ul className="list-disc list-inside ml-4">
          {metadata.deliverables.map((del, idx) => (
            <li key={idx}>{del}</li>
          ))}
        </ul>
      </div>

      {/* Centered gradient button at bottom */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmitForReview}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          Submit For AI Review
        </button>
      </div>
    </div>
  );
};

export default AssignmentDetails;
