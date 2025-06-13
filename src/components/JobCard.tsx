import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, User, ArrowRight, Clock, CheckCircle } from 'lucide-react';
import { Job } from '../context/JobContext';

interface JobCardProps {
  job: Job;
  userRole: 'client' | 'freelancer' | 'visitor';
}

const JobCard: React.FC<JobCardProps> = ({ job, userRole }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-gray-100 text-gray-800';
      case 'funded':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'reviewing':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'disputed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
      case 'submitted':
      case 'reviewing':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <div className="flex items-center space-x-2">
              {getStatusIcon(job.status)}
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                {formatStatus(job.status)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-600">{job.price} ETH</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Created {job.createdAt.toLocaleDateString()}</span>
          </div>
          
          {userRole === 'visitor' && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-2" />
              <span>Client: {formatAddress(job.clientAddress)}</span>
            </div>
          )}
          
          {userRole === 'client' && (
            <div className="flex items-center text-sm text-gray-500">
              <User className="h-4 w-4 mr-2" />
              <span>Freelancer: {formatAddress(job.freelancerAddress)}</span>
            </div>
          )}
        </div>

        {/* AI Review Result */}
        {job.aiReviewResult && (
          <div className={`p-3 rounded-lg mb-4 ${job.aiReviewResult.passed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${job.aiReviewResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                AI Review: {job.aiReviewResult.passed ? 'Passed' : 'Failed'}
              </span>
              <span className={`text-xs ${job.aiReviewResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                {job.aiReviewResult.score}/100
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link
            to={`/job/${job.id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm group"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Quick Actions based on status and role */}
          {userRole === 'freelancer' && job.status === 'funded' && (
            <button className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              Accept
            </button>
          )}
          
          {userRole === 'freelancer' && job.status === 'in_progress' && (
            <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Submit Work
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;