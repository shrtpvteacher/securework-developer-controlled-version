import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  description: string;
  price: string;
  clientAddress: string;
  freelancerAddress: string;
  status: 'created' | 'funded' | 'accepted' | 'in_progress' | 'submitted' | 'reviewing' | 'completed' | 'disputed' | 'cancelled';
  createdAt: Date;
  metadataURI?: string;
  contractAddress?: string;
  workSubmissionHash?: string;
  dropboxFinalSubmission?: string;
  fundsReleased?: boolean;
  clientVerificationRequested?: boolean;
  verifiedBy?: string;
  completedAt?: Date;
  aiReviewResult?: {
    passed: boolean;
    feedback: string;
    score: number;
  };
}

interface JobContextType {
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  getJobsByRole: (address: string, role: 'client' | 'freelancer') => Job[];
  getJobById: (jobId: string) => Job | undefined;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([
    // Mock data for demonstration
    {
      id: '1',
      title: 'Build React Dashboard',
      description: 'Create a modern dashboard with charts and analytics',
      price: '2.5',
      clientAddress: '0x1234567890123456789012345678901234567890',
      freelancerAddress: '0x0987654321098765432109876543210987654321',
      status: 'in_progress',
      createdAt: new Date('2024-01-15'),
      metadataURI: 'ipfs://QmXyz123...',
      contractAddress: '0xabcd1234...'
    }
  ]);

  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  const updateJob = (jobId: string, updates: Partial<Job>) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    ));
  };

  const getJobsByRole = (address: string, role: 'client' | 'freelancer') => {
    return jobs.filter(job => 
      role === 'client' 
        ? job.clientAddress.toLowerCase() === address.toLowerCase()
        : job.freelancerAddress.toLowerCase() === address.toLowerCase()
    );
  };

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId);
  };

  return (
    <JobContext.Provider value={{
      jobs,
      addJob,
      updateJob,
      getJobsByRole,
      getJobById
    }}>
      {children}
    </JobContext.Provider>
  );
};