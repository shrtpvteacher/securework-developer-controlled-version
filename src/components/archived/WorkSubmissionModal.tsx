import React, { useState } from 'react';
import { X, Upload, FileText, Brain, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Job, useJobs } from '../context/JobContext';

interface WorkSubmissionModalProps {
  job: Job;
  onClose: () => void;
}

const WorkSubmissionModal: React.FC<WorkSubmissionModalProps> = ({ job, onClose }) => {
  const { updateJob } = useJobs();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [workDescription, setWorkDescription] = useState('');
  const [aiReview, setAiReview] = useState<{
    passed: boolean;
    feedback: string;
    score: number;
  } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleSubmitForReview = async () => {
    setIsLoading(true);
    
    // Simulate file upload to IPFS
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate AI review
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI review result (in reality, this would call OpenAI API)
    const mockReview = {
      passed: Math.random() > 0.3, // 70% chance of passing
      feedback: Math.random() > 0.3 
        ? "The work meets all specified requirements. The code is well-structured, includes proper documentation, and fulfills all deliverables mentioned in the project description."
        : "The submission is missing some key requirements. Please ensure all deliverables are included and the code follows the specified guidelines. Consider adding more comprehensive testing and documentation.",
      score: Math.floor(Math.random() * 30) + 70 // Score between 70-100
    };
    
    setAiReview(mockReview);
    setIsLoading(false);
    
    // Update job status
    updateJob(job.id, {
      status: 'submitted',
      workSubmissionHash: `QmWorkHash${Date.now()}`,
      aiReviewResult: mockReview
    });
    
    setStep(3);
  };

  const handleFinalSubmission = () => {
    if (aiReview?.passed) {
      updateJob(job.id, {
        status: 'completed'
      });
    } else {
      updateJob(job.id, {
        status: 'in_progress'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Submit Work</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`h-0.5 w-8 mx-2 ${
                    step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Step {step} of 3: {
              step === 1 ? 'Upload Files' :
              step === 2 ? 'AI Review' :
              'Results'
            }
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Description
                </label>
                <textarea
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the work you've completed and how it meets the requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <label className="cursor-pointer">
                      <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Choose Files
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".zip,.rar,.tar,.gz,.7z,.pdf,.doc,.docx,.txt,.md"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload your completed work files (ZIP, PDF, DOC, etc.)
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900">Selected Files:</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <FileText className="h-4 w-4" />
                        <span>{file.name}</span>
                        <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-8">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="animate-spin mx-auto">
                    <Brain className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">AI is Reviewing Your Work</h3>
                  <p className="text-gray-600">
                    Our AI is analyzing your submission against the project requirements...
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>✓ Files uploaded to IPFS</div>
                      <div>✓ Analyzing code quality</div>
                      <div>⏳ Checking requirements compliance</div>
                      <div>⏳ Generating feedback</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
                  <h3 className="text-xl font-semibold text-gray-900">Files Uploaded Successfully</h3>
                  <p className="text-gray-600">Ready to start AI review process</p>
                </div>
              )}
            </div>
          )}

          {step === 3 && aiReview && (
            <div className="space-y-6">
              <div className={`p-6 rounded-lg ${aiReview.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {aiReview.passed ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <h3 className={`text-xl font-semibold ${aiReview.passed ? 'text-green-800' : 'text-red-800'}`}>
                      {aiReview.passed ? 'Work Approved!' : 'Revision Needed'}
                    </h3>
                    <p className={`text-sm ${aiReview.passed ? 'text-green-600' : 'text-red-600'}`}>
                      Score: {aiReview.score}/100
                    </p>
                  </div>
                </div>
                
                <div className={`${aiReview.passed ? 'text-green-700' : 'text-red-700'}`}>
                  <h4 className="font-medium mb-2">AI Feedback:</h4>
                  <p className="leading-relaxed">{aiReview.feedback}</p>
                </div>
              </div>

              {aiReview.passed && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Work will be sent to client via secure file sharing</li>
                    <li>• Funds will be released from escrow</li>
                    <li>• Job will be marked as completed</li>
                    <li>• You'll receive your payment automatically</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200">
          <button
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            disabled={isLoading}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={step === 1 ? () => setStep(2) : step === 2 ? handleSubmitForReview : handleFinalSubmission}
            disabled={(step === 1 && files.length === 0) || isLoading}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>
                {step === 1 ? 'Upload & Review' : 
                 step === 2 ? 'Start AI Review' : 
                 aiReview?.passed ? 'Complete Job' : 'Back to Work'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkSubmissionModal;