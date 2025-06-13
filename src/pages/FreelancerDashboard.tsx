import React, { useState } from 'react';
import { Search, Briefcase, Clock, CheckCircle, Star, Filter } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';

const FreelancerDashboard: React.FC = () => {
  const { account, isConnected } = useWallet();
  const { jobs, getJobsByRole } = useJobs();
  const [activeTab, setActiveTab] = useState<'available' | 'my-jobs' | 'completed'>('available');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the freelancer dashboard.</p>
        </div>
      </div>
    );
  }

  const myJobs = getJobsByRole(account!, 'freelancer');
  const availableJobs = jobs.filter(job => 
    job.freelancerAddress.toLowerCase() !== account!.toLowerCase() &&
    ['created', 'funded'].includes(job.status)
  );
  const completedJobs = myJobs.filter(job => job.status === 'completed');

  const getJobsToShow = () => {
    let jobsToShow = [];
    
    switch (activeTab) {
      case 'available':
        jobsToShow = availableJobs;
        break;
      case 'my-jobs':
        jobsToShow = myJobs.filter(job => job.status !== 'completed');
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
        const price = parseFloat(job.price);
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
      value: `${completedJobs.reduce((sum, job) => sum + parseFloat(job.price), 0).toFixed(2)} ETH`,
      icon: Star,
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Freelancer Dashboard</h1>
          <p className="text-gray-600">Find work and manage your projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default FreelancerDashboard;