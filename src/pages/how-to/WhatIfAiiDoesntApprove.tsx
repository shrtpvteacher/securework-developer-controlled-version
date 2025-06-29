// src/pages/how-to/HowToAiNotApproved.tsx

import React from "react";
import { Link } from "react-router-dom";

const HowToAiNotApproved: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-12">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-12 p-8 border border-gray-100">
      <Link to="/how-to" className="text-blue-700 hover:underline mb-4 inline-block">&larr; Back to Tutorials</Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">What to Do If AI Doesn’t Approve Your Work</h1>
      <div className="aspect-video rounded-xl overflow-hidden shadow mb-6">
        <iframe
          src="https://www.youtube.com/embed/YTAiNotApprovedDemo" // Replace with your real video
          title="What to Do If AI Doesn’t Approve Your Work"
          frameBorder={0}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <ol className="list-decimal ml-6 mb-8 space-y-3 text-gray-800 text-lg">
        <li>Read the feedback from the AI carefully. Each missing or incorrect item will be listed for you.</li>
        <li>Check the job deliverables and requirements to understand what was missed or needs improvement.</li>
        <li>Make the necessary corrections to your files, code, or documentation.</li>
        <li>Prepare a brief note explaining how you addressed the AI’s feedback (optional, but helpful).</li>
        <li>Return to the job page and click <b>“Resubmit Work”</b> or <b>“Submit Again”</b>.</li>
        <li>Upload your revised deliverables and submit.</li>
        <li>Your work will be re-reviewed by the AI. If you address all the feedback, approval is usually immediate.</li>
      </ol>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4 text-gray-800">
        <b>Still not approved?</b>  
        <ul className="list-disc ml-6">
          <li>If your work is rejected twice, you can ask for a manual client review.</li>
          <li>Click the <b>“Request Client Review”</b> button and provide a summary of your case.</li>
          <li>The client will receive a notification and can approve or request further changes.</li>
        </ul>
      </div>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2 text-gray-700">
        <b>Pro Tip:</b> Save copies of all feedback and your responses for your records. This helps with future jobs and shows your professionalism!
      </div>
    </div>
  </div>
);

export default HowToAiNotApproved;
