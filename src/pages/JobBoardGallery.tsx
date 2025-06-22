import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';
import { Link } from 'react-router-dom';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS as string;

interface JobData {
  jobId: number;
  jobAddress: string;
  metadataURI: string;
  client: string;
}

const JobBoardGallery: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const factory = new ethers.Contract(FACTORY_ADDRESS, JobEscrowFactoryABI, provider);

        const filter = factory.filters.JobCreated();
        const events = await factory.queryFilter(filter);

        const jobList = events.map((e) => ({
          jobId: e.args?.jobId.toNumber(),
          jobAddress: e.args?.jobContract,
          metadataURI: e.args?.metadataURI,
          client: e.args?.client,
        }));

        setJobs(jobList);
      } catch (err) {
        console.error('Error fetching job listings:', err);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Open Jobs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {jobs.map((job) => (
         
<Link
  key={job.jobId}
  to={`/job-board/${job.jobAddress}`}
  className="border rounded-xl p-4 shadow-md hover:shadow-lg bg-white block"
>
  <h2 className="text-lg font-semibold">Job #{job.jobId}</h2>
  <p className="text-sm text-gray-600 break-all">Client: {job.client}</p>
  <p className="text-xs text-blue-600 mt-2">View Details</p>
</Link>
            
        ))}
      </div>
    </div>
  );
};

export default JobBoardGallery;
