// src/pages/how-to/HowToPostJob.tsx

import React from "react";
import { Link } from "react-router-dom";

const HowToPostJob: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-12">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-12 p-8 border border-gray-100">
      <Link to="/how-to" className="text-blue-700 hover:underline mb-4 inline-block">&larr; Back to Tutorials</Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">How to Create a New Job</h1>
      <div className="aspect-video rounded-xl overflow-hidden shadow mb-6">
        <iframe
          src="https://www.youtube.com/embed/YTPostJobDemo" // Replace with your real video
          title="How to Create a New Job"
          frameBorder={0}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <ol className="list-decimal ml-6 mb-8 space-y-3 text-gray-800 text-lg">
        <li>Navigate to the <b>“Post a Job”</b> or <b>“Create New Job”</b> page from your dashboard.</li>
        <li>Fill in the <b>Job Title</b> and a short summary.</li>
        <li>Write a <b>detailed description</b> of what you want done. Include all requirements and outcomes.</li>
        <li><b>List clear, numbered deliverables</b> (e.g., “1. Landing page mockup”, “2. Deploy contract to Sepolia”).</li>
        <li>Set the <b>budget/payment amount</b> (ETH or stablecoin), and choose the deadline if needed.</li>
        <li>Add any supporting documents or links (screenshots, example docs, etc.).</li>
        <li>Review all fields for accuracy and clarity.</li>
        <li>Click <b>“Create Job”</b> and confirm the transaction in your wallet.</li>
        <li>Your job will now be visible to freelancers and reviewed by our AI for scope clarity!</li>
      </ol>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4 text-gray-700">
        <b>Pro Tip:</b> The more specific your requirements and deliverables, the better our AI and freelancers can understand and deliver on your expectations.  
        <br />For best results, use clear language, add numbers or checklists, and mention any “must-have” or “nice-to-have” features.
      </div>
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-2 text-gray-800">
        <b>Example Deliverables:</b>
        <ul className="list-disc ml-6">
          <li>Responsive landing page with mobile support</li>
          <li>Smart contract deployed to Sepolia</li>
          <li>Test suite and deployment documentation</li>
        </ul>
      </div>
    </div>
  </div>
);

export default HowToPostJob;
