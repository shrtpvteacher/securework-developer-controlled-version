import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface VerifyByClientProps {
  jobId: string;
}

const VerifyByClient: React.FC<VerifyByClientProps> = ({ jobId }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVerificationStatus('success');
    } catch (error) {
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-300" />
        <h3 className="text-xl font-semibold text-white">Verify Work Completion</h3>
      </div>
      
      <p className="text-white/80 mb-6">
        Review and verify that the freelancer has completed the work according to your requirements.
      </p>

      {verificationStatus === 'success' && (
        <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-300" />
            <span className="text-green-100 font-medium">Work verified successfully!</span>
          </div>
        </div>
      )}

      {verificationStatus === 'error' && (
        <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-300" />
            <span className="text-red-100 font-medium">Verification failed. Please try again.</span>
          </div>
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={isVerifying || verificationStatus === 'success'}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isVerifying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verifying...
          </>
        ) : verificationStatus === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Verified
          </>
        ) : (
          'Verify Work Completion'
        )}
      </button>
    </div>
  );
};

export default VerifyByClient;