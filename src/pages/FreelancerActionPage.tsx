import React from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import FreelancerActionCard from '../components/FreelancerActionCard';

const FreelancerJobActionsPage: React.FC = () => {
  const { jobAddress } = useParams<{ jobAddress: string }>();
  const { account } = useWallet();

  // You'd probably fetch assignedFreelancer via a contract call or context.
  // For this skeleton, we'll just pass undefined.
  const assignedFreelancer = undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center py-12">
      <div className="max-w-lg w-full">
        <FreelancerActionCard
          jobAddress={jobAddress}
          assignedFreelancer={assignedFreelancer}
          currentAccount={account || ''}
        />
      </div>
    </div>
  );
};

export default FreelancerJobActionsPage;
