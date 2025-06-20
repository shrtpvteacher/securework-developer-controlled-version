// src/context/JobContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Job {
  id: string;
  title: string;
  description: string;
  price: string;
  clientAddress: string;
  freelancerAddress: string;
  status: 'created' | 'funded' | 'accepted' | 'submitted' | 'verifiedBy' | 'cancelled';
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
  updateJob: (jobId: string, updates: Partial<Omit<Job, 'title' | 'description' | 'price'>>) => void;
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
  const [jobs, setJobs] = useState<Job[]>([]); // Start with empty list

  const addJob = (job: Job) => {
    setJobs(prev => [...prev, job]);
  };

  // Allows updating job status or off-chain fields (e.g., dropbox, aiReview)
  // Does NOT allow updating core job terms: title, description, or price
  const updateJob = (jobId: string, updates: Partial<Omit<Job, 'title' | 'description' | 'price'>>) => {
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
