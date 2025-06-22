import React from 'react';
import { AlertTriangle, MessageCircle, Shield } from 'lucide-react';

const DisclosureNotice: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 my-6">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🔐 Important Disclosure
          </h3>
          <div className="text-blue-700 space-y-3">
            <p className="font-medium">
              SecureWork is a tool for accountability — not a replacement for communication.
            </p>
            
            <p>
              This platform is designed to increase trust between clients and freelancers by holding project funds in escrow and storing job terms permanently on IPFS. When a job is created, both parties agree to clear deliverables, deadlines, and compensation — and the client demonstrates commitment by funding the job upfront.
            </p>
            
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Communication is Essential</span>
              </div>
              <p className="text-sm">
                SecureWork does <strong>not</strong> replace the need for human interaction. Clients and freelancers are expected to communicate, collaborate, and clarify expectations throughout the process. Verification steps (by AI or by the client) help reinforce quality, but final judgment and mutual understanding still rest with the participants.
              </p>
            </div>
            
            <div className="bg-white bg-opacity-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Dispute Resolution</span>
              </div>
              <p className="text-sm">
                In the event of a serious dispute, SecureWork provides verifiable evidence — including timestamps, agreements, and submission records — but does not serve as an arbitrator or legal authority. Parties may still seek resolution through other means, with the benefit of immutable proof of their agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclosureNotice;