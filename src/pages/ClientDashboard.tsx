import React, { useState } from 'react';
import { Plus, File, Clock, CheckCircle, Receipt, Eye } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useJobs } from '../context/JobContext';
import CreateJobPage from './CreateJobPage';
import JobCard from '../components/JobCard';
import walletHero from '../assets/wallet-hero.png';

const ClientDashboard: React.FC = () => {
  const { account, isConnected, connectWallet } = useWallet();
  const { getJobsByRole } = useJobs();
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');

  if (!isConnected) {
  return (
    <>
      {/* Gradient hero with card */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center py-8">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-6 flex flex-col items-center border-4 border-blue-100 max-w-md mx-auto backdrop-blur-lg">
          <img
            src={walletHero}
            alt="Open wallet with dollars, bitcoin and ethereum"
            className="w-32 h-24 mb-4 drop-shadow-2xl rounded-xl"
            draggable={false}
          />
          <h2 className="text-3xl md:text-5xl font-extrabold text-center leading-tight bg-gradient-to-r from-blue-600 via-purple-800 to-emerald-600 bg-clip-text text-transparent mb-6">
            Connect Your Wallet
          </h2>
          <p className="text-base text-gray-700 mb-6 text-center">
           to unlock your dashboard manage jobs, track progress, and see stats.
          </p>
        </div>
      </div>

      {/* Separate white section for the button with extra space */}
      <div className="w-full flex justify-center py-10 bg-white">
        <button
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>
    </>
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
        <div className="mb-10 px-2 text-center">
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

  {/* Tabs */}
     <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
  {[
      { key: 'all', label: 'All Jobs' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ].map((tab) => (
    <button
      key={tab.key}
      onClick={() => setActiveTab(tab.key as any)}
      // ⬇️ Replace the old className with this whole block:
      className={`
        px-4 py-2 font-medium rounded-t-md transition-all duration-200
        border border-r-2 border-t-2 border-l-2 border-b-0
        ${
          activeTab === tab.key
            ? 'bg-white text-blue-600 z-20 shadow-[0_-2px_12px_-2px_rgba(40,40,40,0.16),4px_0_12px_-2px_rgba(30,30,30,0.18)] border-gray-800'
            : 'bg-gray-100 text-gray-700 z-10 shadow-[0_-2px_8px_-2px_rgba(60,60,60,0.06),4px_0_8px_-2px_rgba(40,40,40,0.08)] border-gray-400 border-b-2'
        }
      `}
      // ⬇️ Add this style prop:
      style={{
        position: 'relative',
        marginBottom: activeTab === tab.key ? '-2px' : '0',
      }}
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
  );
};

export default ClientDashboard;
