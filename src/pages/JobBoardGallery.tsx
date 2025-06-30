/* import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';
import { Link } from 'react-router-dom';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS as string;

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

export default JobBoardGallery;  */


import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';
import { Link } from 'react-router-dom';

// Use your environment variable or hardcode as needed
const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS as string;

interface JobData {
  jobId: number;
  jobAddress: string;
  metadata: any;
  client: string;
}

const ipfsToHttp = (uri: string) =>
  uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

const JobBoardGallery: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum as any);
        const factory = new ethers.Contract(FACTORY_ADDRESS, JobEscrowFactoryABI, provider);

        const filter = factory.filters.JobCreated();
        const events = await factory.queryFilter(filter);

        // Fetch metadata for each job
        const jobList: JobData[] = await Promise.all(
          events.map(async (e: any) => {
            const metadataURI = e.args?.metadataURI;
            let metadata: any = {};
            if (metadataURI && metadataURI.startsWith('ipfs://')) {
              try {
                const res = await fetch(ipfsToHttp(metadataURI));
                metadata = await res.json();
              } catch (err) {
                metadata = { title: 'Unavailable', description: '', requirements: [], deliverables: [] };
              }
            }
            return {
              jobId: e.args?.jobId.toNumber(),
              jobAddress: e.args?.jobContract,
              client: e.args?.client,
              metadata,
            };
          })
        );
        setJobs(jobList);
      } catch (err) {
        console.error('Error fetching job listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 to-emerald-50">
      <h1 className="text-3xl font-bold mb-6">Open Jobs</h1>
      {loading ? (
        <div className="text-gray-700">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {jobs.map((job, idx) => (
            <div
              className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl flex flex-col justify-between min-h-[360px]"
              key={job.jobId}
              style={{ borderLeft: idx % 2 === 0 ? '4px solid #06b6d4' : '4px solid #059669' }}
            >
              <div>
                <h2 className="text-lg font-bold mb-1">Job #{job.jobId}</h2>
                <div className="mb-2 text-sm text-gray-700 font-semibold">{job.metadata?.title || 'Untitled Job'}</div>
                <div className="text-xs text-gray-500 break-all mb-1">
                  <span className="font-medium">Client:</span> {job.client}
                </div>
                <div className="mb-2 text-gray-600 text-xs">
                  {job.metadata?.description?.slice(0, 120) || ''}
                  {job.metadata?.description?.length > 120 && '...'}
                </div>
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500">Requirements:</div>
                  <ul className="list-disc list-inside text-xs text-gray-700">
                    {job.metadata?.requirements?.slice(0, 2)?.map((req: string, i: number) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-500">Deliverables:</div>
                  <ul className="list-disc list-inside text-xs text-gray-700">
                    {job.metadata?.deliverables?.slice(0, 2)?.map((del: string, i: number) => (
                      <li key={i}>{del}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link
                to={`/job-board/${job.jobAddress}/submit-proposal`}
                className="mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-center font-bold shadow-lg hover:scale-105 transition w-full"
              >
                Write Proposal
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoardGallery;
