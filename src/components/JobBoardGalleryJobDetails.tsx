import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ethers } from 'ethers';
import { Calendar, User, FileText, ArrowLeft } from 'lucide-react';
import JobEscrowAbi from '../../netlify/functions/abis/JobEscrowABI.json';

const JobBoardGalleryJobDetails: React.FC = () => {
  const { jobAddress } = useParams<{ jobAddress: string }>();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
       if (!window.ethereum) {
            throw new Error("MetaMask is not available");
    }

const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const contract = new ethers.Contract(jobAddress!, JobEscrowAbi, provider);
        
        const [
          jobId,
          client,
          freelancer,
          aiVerifier,
          jobPay,
          status,
          metadataURI,
        ] = await Promise.all([
          contract.jobId(),
          contract.client(),
          contract.freelancer(),
          contract.aiVerifier(),
          contract.jobPay(),
          contract.status(),
          contract.metadataURI()
        ]);

        setJobData({
          jobId: jobId.toString(),
          client,
          freelancer,
          aiVerifier,
          amount: ethers.utils.formatEther(jobPay),
          status,
          metadataURI
        });

        if (metadataURI && metadataURI.startsWith('ipfs://')) {
          const ipfsURL = `https://ipfs.io/ipfs/${metadataURI.replace('ipfs://', '')}`;
          const res = await fetch(ipfsURL);
          const meta = await res.json();
          setMetadata(meta);
        }
      } catch (err) {
        console.error('Error loading job:', err);
      } finally {
        setLoading(false);
      }
    };

    if (jobAddress) loadJob();
  }, [jobAddress]);

  if (loading) {
    return <div className="p-6 text-center">Loading job details...</div>;
  }

  if (!jobData) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Job not found or failed to load.</p>
        <Link to="/jobs" className="text-blue-600 hover:underline">
          ← Back to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Job Board
      </Link>

      <div className="bg-white rounded-xl shadow-md p-6 border">
        <h1 className="text-2xl font-bold mb-2">{metadata?.title || 'Untitled Job'}</h1>
        <p className="text-gray-600 mb-4">{metadata?.description || 'No description provided.'}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span><strong>Client:</strong> {jobData.client.slice(0, 6)}...{jobData.client.slice(-4)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <span><strong>Freelancer:</strong> {jobData.freelancer.slice(0, 6)}...{jobData.freelancer.slice(-4)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span><strong>Status:</strong> {jobData.status}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span><strong>Job Pays:</strong> {jobData.jobPay} ETH</span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm text-gray-500">Job ID: #{jobData.jobId}</p>
          <p className="text-sm text-gray-500">Contract Address: {jobAddress}</p>
          <p className="text-sm text-gray-500">Metadata URI: {jobData.metadataURI}</p>
        </div>
      </div>
    </div>
  );
};

export default JobBoardGalleryJobDetails;
