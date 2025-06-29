import React, { useState } from 'react';
import { Plus, File, Clock, CheckCircle, Receipt, Eye } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useJobs } from '../context/JobContext';
import CreateJobPage from './CreateJobPage';
import JobCard from '../components/JobCard';

const ClientDashboard: React.FC = () => {
  const { account, isConnected } = useWallet();
  const { getJobsByRole } = useJobs();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the client dashboard.</p>
        </div>
      </div>
    );
  }

  const allJobs = getJobsByRole(account!, 'client');
  const activeJobs = allJobs.filter(job => !['completed', 'disputed'].includes(job.status));
  const completedJobs = allJobs.filter(job => ['completed'].includes(job.status));

  const getJobsToShow = () => {
    switch (activeTab) {
      case 'active':
        return activeJobs;
      case 'completed':
        return completedJobs;
      default:
        return allJobs;
    }
  };

  const stats = [
    {
      label: 'Total Jobs',
      value: allJobs.length,
      icon: File,
      color: 'gray'
    },
    {
      label: 'Active Jobs',
      value: activeJobs.length,
      icon: Clock,
      color: 'green'
    },
    {
      label: 'Completed',
      value: completedJobs.length,
      icon: CheckCircle,
      color: 'grey'
    },
    {
      label: 'Total Spent',
      value: `${allJobs.reduce((sum, job) => sum + parseFloat(job.jobPay), 0).toFixed(2)} ETH`,
      icon: Receipt,
      color: 'green'
    }
  ];

 return (
  <div className="min-h-screen bg-gray-50">
    {/* HERO SECTION: gradient right at the top */}
    <div className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-16">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header and subtitle (left-aligned) */}
        <div className="mb-10 px-2">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Client Dashboard</h1>
          <p className="text-gray-200">Manage your jobs and track progress</p>
        </div>
        {/* Stats cards (centered) */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-4xl">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-100 mt-2">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* The rest of the page (white background) */}
    <div className="max-w-5xl w-full mx-auto px-2 mt-8">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        {[
          { key: 'all', label: 'All Jobs' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'all' | 'active' | 'completed')}
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {getJobsToShow().map((job) => (
          <JobCard key={job.id} job={job} userRole="client" />
        ))}
      </div>

      {getJobsToShow().length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'all'
              ? "You haven't created any jobs yet. Start by creating your first job!"
              : `No ${activeTab} jobs found.`}
          </p>
          {activeTab === 'all' && (
            <button
              onClick={() => setShowCreateJob(true)}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Create A New Job Post
            </button>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

export default ClientDashboard;
