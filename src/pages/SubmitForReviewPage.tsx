// src/pages/SubmitForReviewPage.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubmitForReview from '../components/SubmitForReview';

const SubmitForReviewPage: React.FC = () => {
  const { contractAddress } = useParams<{ contractAddress: string }>();
  const navigate = useNavigate();

  if (!contractAddress) {
    return <p>Error: Contract address missing from URL.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Submit Work for AI Review</h1>
      <SubmitForReview
        contractAddress={contractAddress}
        onClose={() => navigate(-1)} // go back on cancel
        onReviewComplete={(result) => {
          if (result.status === 'Pass') {
            // After passing review, navigate to SendToDropbox page
            navigate(`/send-to-dropbox/${contractAddress}`);
          } else {
            alert('Submission did not pass review. Please fix and try again.');
          }
        }}
      />
    </div>
  );
};

export default SubmitForReviewPage;
