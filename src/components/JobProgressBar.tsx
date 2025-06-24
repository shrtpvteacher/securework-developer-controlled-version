// components/JobProgressBar.tsx
import React from 'react';
import { CheckCircle, CircleDot } from 'lucide-react';

interface JobProgressBarProps {
  status: string;
}

const steps = [
  'created',
  'funded',
  'accepted',
  'submitted',
  'reviewing',
  'completed'
];

const JobProgressBar: React.FC<JobProgressBarProps> = ({ status }) => {
  const currentStepIndex = steps.indexOf(status.toLowerCase());

  return (
    <div className="flex items-center justify-between w-full mb-8">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;

        return (
          <div key={step} className="flex flex-col items-center w-full">
            <div className="flex items-center justify-center w-6 h-6 rounded-full mb-1">
              {isCompleted ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : isCurrent ? (
                <CircleDot className="w-5 h-5 text-green-500 animate-pulse" />
              ) : (
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />
              )}
            </div>
            <span
              className={`text-xs text-center ${
                isCompleted || isCurrent ? 'text-gray-800 font-semibold' : 'text-gray-400'
              }`}
            >
              {step.charAt(0).toUpperCase() + step.slice(1)}
            </span>
            {idx < steps.length - 1 && (
              <div className="h-px bg-gray-300 w-full mt-2" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default JobProgressBar;
