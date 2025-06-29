import React, { useState } from 'react';
import { Search, Briefcase, Clock, CheckCircle, Star, Filter } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';
import walletHero from '../assets/wallet-hero.png';

const FreelancerDashboard: React.FC = () => {
  const { account, isConnected } = useWallet();
  const { jobs, getJobsByRole } = useJobs();
  const [activeTab, setActiveTab] = useState<'available' | 'my-jobs' | 'completed'>('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

 if (!isConnected) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center">
       <div className="bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border-4 border-blue-100 max-w-lg mx-auto backdrop-blur-lg">
        <img
          src={walletHero}
          alt="Open wallet with dollars, bitcoin and ethereum"
          className="w-44 h-44 mb-8 drop-shadow-2xl rounded-2xl"
          draggable={false}
        />
        <h2 className="text-3xl font-extrabold text-gray-900 mb-5 text-center">
          Connect Your wallet
        </h2>
        <p className="text-lg text-gray-700 mb-12 text-center">
           to unlock your dashboard, manage jobs, see earnings, and new opportunities!
        </p>
        <button
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
          // onClick={handleConnectWallet}
          disabled
        >
          Connect Wallet
        </button>
      </div>
      </div>
    
  );
}

  const myJobs = getJobsByRole(account!, 'freelancer') || [];
  const availableJobs = jobs.filter(job => 
    job.freelancerAddress.toLowerCase() !== account!.toLowerCase() &&
    ['created', 'funded'].includes(job.status)
  );
  const completedJobs = myJobs.filter(job => job.status === 'verifiedBy');

  const getJobsToShow = () => {
    let jobsToShow = [];
    
    switch (activeTab) {
      case 'available':
        jobsToShow = availableJobs;
        break;
      case 'my-jobs':
        jobsToShow = myJobs.filter(job => job.status !== 'verifiedBy');
        break;
      case 'completed':
        jobsToShow = completedJobs;
        break;
      default:
        jobsToShow = availableJobs;
    }

    // Apply search filter
    if (searchTerm) {
      jobsToShow = jobsToShow.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      jobsToShow = jobsToShow.filter(job => {
        const price = parseFloat(job.jobPay);
        switch (priceFilter) {
          case 'low':
            return price < 1;
          case 'medium':
            return price >= 1 && price < 5;
          case 'high':
            return price >= 5;
          default:
            return true;
        }
      });
    }

    return jobsToShow;
  };

  const stats = [
    {
      label: 'Available Jobs',
      value: availableJobs.length,
      icon: Briefcase,
      color: 'blue'
    },
    {
      label: 'Active Jobs',
      value: myJobs.filter(job => !['completed', 'disputed'].includes(job.status)).length,
      icon: Clock,
      color: 'orange'
    },
    {
      label: 'Completed',
      value: completedJobs.length,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Earned',
      value: `${completedJobs.reduce((sum, job) => sum + parseFloat(job.jobPay), 0).toFixed(2)} ETH`,
      icon: Star,
      color: 'purple'
    }
  ];

 return (
  <div className="min-h-screen bg-gray-50">
    {/* HERO SECTION: gradient right at the top */}
    <div className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 py-16">
      <div className="max-w-5xl w-full mx-auto">
        {/* Header and subtitle (left-aligned) */}
        <div className="mb-10 px-2">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Freelancer Dashboard</h1>
          <p className="text-gray-200">Find work and manage your projects</p>
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
    { key: 'available', label: 'Available Jobs' },
    { key: 'my-jobs', label: 'My Jobs' },
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

        {/* Search and Filters */}
        {activeTab === 'available' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Price Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value as any)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[150px]"
                >
                  <option value="all">All Prices</option>
                  <option value="low">{'< 1 ETH'}</option>
                  <option value="medium">1-5 ETH</option>
                  <option value="high">{'> 5 ETH'}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {getJobsToShow().map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              userRole={activeTab === 'available' ? 'visitor' : 'freelancer'} 
            />
          ))}
        </div>

        {getJobsToShow().length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">
              {activeTab === 'available' 
                ? searchTerm || priceFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'No jobs are currently available. Check back later!'
                : `No ${activeTab.replace('-', ' ')} found.`
              }
            </p>
          </div>
        )}
      </div>
  );
};

export default FreelancerDashboard;