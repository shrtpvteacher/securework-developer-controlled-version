import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, User, FileText, Brain, Upload, Download, CheckCircle, XCircle } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useWallet } from '../context/WalletContext';
import WorkSubmissionModal from '../components/WorkSubmissionModal';
import SubmitForReview from '../components/SubmitForReview';
import UploadToDropbox from '../components/UploadToDropbox';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobById, updateJob } = useJobs();
  const { account } = useWallet();
  const [showWorkSubmission, setShowWorkSubmission] = useState(false);

  const job = getJobById(jobId!);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
          <Link to="/client-dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isClient = account?.toLowerCase() === job.clientAddress.toLowerCase();
  const isFreelancer = account?.toLowerCase() === job.freelancerAddress.toLowerCase();



  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAcceptJob = () => {
    updateJob(job.id, { status: 'accepted' });
  };

  const handleSubmitForReview = () => {
    updateJob(job.id, { status: 'submitted' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={isClient ? '/client-dashboard' : '/freelancer-dashboard'}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${(job.status)}`}>
                  {formatStatus(job.status)}
                </span>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <div className="text-3xl font-bold text-emerald-600">{job.jobPay} ETH</div>
                <div className="text-sm text-gray-500">Project Value</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="font-medium">{job.createdAt.toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Client</div>
                  <div className="font-medium">{formatAddress(job.clientAddress)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Freelancer</div>
                  <div className="font-medium">{formatAddress(job.freelancerAddress)}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>
          </div>
        </div>
  

        {/* Action Cards */}
                <div className="space-y-6">
          {isClient && job.status === 'created' && (
            <FundEscrow
              contractAddress={job.contractAddress}
              jobPay={job.jobPay}
               <button
                    onClick={handleAcceptJob}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  ></button>onSuccess={refetchOnChain}
            />
          )}
        <div className="space-y-6">
          {/* Freelancer Actions */}
          {isFreelancer && (
            <>
              {job.status === 'funded' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Accept Job</h3>
                  <p className="text-gray-600 mb-4">
                    Review the job requirements and accept to start working on this project.
                  </p>
                  <button
                    onClick={handleAcceptJob}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                  >
                    Accept Job
                  </button>
                </div>
              )}

              {job.status === 'accepted' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Work</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your completed work for AI verification and client review.
                  </p>
                  <button
                    onClick={() => setShowWorkSubmission(true)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Submit Work</span>
                  </button>
                </div>
              )}
            </>
          )}
          {role === 'freelancer' && job.status === 'accepted' && (
            <SubmitForReview
            metadataURI={job.metadataURI}
            onSuccess={fetchJob}      // backend will set status → 'reviewed_passed'
  />
)}



{role === 'freelancer' && job.status === 'reviewed_passed' && (
  <UploadToDropbox
    jobId={job.jobId}
    onSuccess={fetchJob}      // status flips to 'submitted'
  />
)}

          {/* AI Review Results */}
          {job.aiReviewResult && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Review Results</h3>
              </div>
              
              <div className={`p-4 rounded-lg ${job.aiReviewResult.passed ? 'bg-green-50' : 'bg-red-50'} mb-4`}>
                <div className="flex items-center space-x-2 mb-2">
                  {job.aiReviewResult.passed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${job.aiReviewResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                    {job.aiReviewResult.passed ? 'Work Approved' : 'Work Needs Revision'}
                  </span>
                </div>
                <p className={`${job.aiReviewResult.passed ? 'text-green-700' : 'text-red-700'} mb-2`}>
                  {job.aiReviewResult.feedback}
                </p>
                <div className={`text-sm ${job.aiReviewResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                  Score: {job.aiReviewResult.score}/100
                </div>
              </div>
            </div>
          )}

          {/* Work Submission Details */}
          {job.workSubmissionHash && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Submission</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Submitted Work</div>
                  <div className="text-sm text-gray-500">IPFS Hash: {job.workSubmissionHash}</div>
                </div>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          )}

          {/* Contract Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Information</h3>
            <div className="space-y-3">
              {job.contractAddress && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Contract Address:</span>
                  <span className="font-mono text-sm">{job.contractAddress}</span>
                </div>
              )}
              {job.ipfsHash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Metadata Hash:</span>
                  <span className="font-mono text-sm">{job.ipfsHash}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Work Submission Modal */}
      {showWorkSubmission && (
        <WorkSubmissionModal
          job={job}
          onClose={() => setShowWorkSubmission(false)}
        />
      )}
    </div>
  );
};

export default JobDetails;








*/


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, User, FileText, Brain, Upload,
  Download, CheckCircle, XCircle
} from 'lucide-react';

import { useJobs }    from '../context/JobContext';
import { useWallet }  from '../context/WalletContext';

import FundEscrow          from '../components/FundEscrow';
import AcceptJob           from '../components/AcceptJob';
import WorkSubmissionModal from '../components/WorkSubmissionModal';
import UploadToDropbox     from '../components/UploadToDropbox';

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobById, fetchJobFromChain } = useJobs();
  const { account } = useWallet();

  const [showModal, setShowModal] = useState(false);
  const [job, setJob] = useState<any | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      const jobData = await fetchJobFromChain(jobId!);
      setJob(jobData);
    };
    fetchJob();
  }, [jobId, fetchJobFromChain]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
          <Link to="/client-dashboard" className="text-blue-600">← Back</Link>
        </div>
      </div>
    );
  }

  const isClient     = account?.toLowerCase() === job.clientAddress.toLowerCase();
  const isFreelancer = account?.toLowerCase() === job.freelancerAddress.toLowerCase();

  const refetchOnChain = async () => {
    const jobData = await fetchJobFromChain(jobId!);
    setJob(jobData);
  };

  const format = (s: string) => s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const short  = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to={isClient ? '/client-dashboard' : '/freelancer-dashboard'}
          className="inline-flex items-center text-blue-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-sm border p-8 mb-10">
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
                {format(job.status)}
              </span>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold text-emerald-600">{job.jobPay} ETH</div>
              <div className="text-sm text-gray-500">Project Value</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <InfoRow icon={<Calendar className="h-5 w-5 text-gray-400" />} label="Created"
                     value={job.createdAt.toLocaleDateString()} />
            <InfoRow icon={<User className="h-5 w-5 text-gray-400" />} label="Client"
                     value={short(job.clientAddress)} />
            <InfoRow icon={<User className="h-5 w-5 text-gray-400" />} label="Freelancer"
                     value={short(job.freelancerAddress)} />
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{job.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {isClient && job.status === 'created' && (
            <FundEscrow
              contractAddress={job.contractAddress}
              jobPay={job.jobPay}
              onSuccess={refetchOnChain}
            />
          )}

          {isFreelancer && job.status === 'funded' && (
            <AcceptJob
              contractAddress={job.contractAddress}
              onSuccess={refetchOnChain}
            />
          )}

          {isFreelancer && job.status === 'accepted' && (
            <ButtonCard
              title="Submit Work"
              text="Upload your completed work for AI verification."
              onClick={() => setShowModal(true)}
            />
          )}

          {isFreelancer && job.status === 'reviewed_passed' && (
            <UploadToDropbox
              jobId={job.jobId}
              onSuccess={refetchOnChain}
            />
          )}

          {job.aiReviewResult && (
            <AIResultCard result={job.aiReviewResult} />
          )}

          {job.workSubmissionHash && (
            <FileHashCard hash={job.workSubmissionHash} />
          )}
        </div>
      </div>

      {showModal && (
        <WorkSubmissionModal
          job={job}
          onClose={() => setShowModal(false)}
          onSuccess={refetchOnChain}
        />
      )}
    </div>
  );
};

const InfoRow = ({ icon, label, value }: any) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const ButtonCard = ({ title, text, onClick }: any) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{text}</p>
    <button
      onClick={onClick}
      className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded shadow hover:opacity-90"
    >
      {title}
    </button>
  </div>
);

const AIResultCard = ({ result }: any) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <div className="flex items-center gap-2 mb-3">
      <Brain className="h-6 w-6 text-purple-600" />
      <h3 className="text-lg font-semibold">AI Review Results</h3>
    </div>
    <div className={`p-4 rounded ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
      {result.passed
        ? <CheckCircle className="h-5 w-5 text-green-600" />
        : <XCircle className="h-5 w-5 text-red-600" />}
      <span className={`ml-2 font-semibold ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
        {result.passed ? 'Approved' : 'Needs Revision'}
      </span>
      <p className="mt-2 text-sm">{result.feedback}</p>
      <p className="text-xs mt-1">Score: {result.score}/100</p>
    </div>
  </div>
);

const FileHashCard = ({ hash }: { hash: string }) => (
  <div className="bg-white rounded-xl shadow-sm border p-6">
    <h3 className="font-semibold mb-2">Work Submission</h3>
    <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
      <span className="text-sm font-mono">{hash}</span>
      <a href={`https://ipfs.io/ipfs/${hash}`} target="_blank" rel="noopener noreferrer"
         className="text-blue-600 flex items-center gap-1">
        <Download className="h-4 w-4" /> Download
      </a>
    </div>
  </div>
);

export default JobDetails;
