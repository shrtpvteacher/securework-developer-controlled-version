// src/pages/how-to/HowToSubmitWork.tsx

import React from "react";
import { Link } from "react-router-dom";

const HowToSubmitWork: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-12">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-12 p-8 border border-gray-100">
      <Link to="/how-to" className="text-blue-700 hover:underline mb-4 inline-block">&larr; Back to Tutorials</Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">How to Submit Work for Review</h1>
      <div className="aspect-video rounded-xl overflow-hidden shadow mb-6">
        <iframe
          src="https://www.youtube.com/embed/YTSubmitWorkDemo" // Replace with your real video
          title="How to Submit Work for Review"
          frameBorder={0}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <ol className="list-decimal ml-6 mb-8 space-y-3 text-gray-800 text-lg">
        <li>Go to your <b>active job</b> page from the dashboard.</li>
        <li>Click the <b>“Submit Work”</b> or <b>“Submit for Review”</b> button.</li>
        <li>Upload all required files, links, or documentation as specified in the job deliverables.</li>
        <li>Add a short summary or comments if needed (explain any choices or special considerations).</li>
        <li>Review your submission to make sure everything matches the job requirements.</li>
        <li>Click <b>“Submit”</b> and confirm the submission.</li>
        <li>Your work will be automatically sent to our AI for initial review.</li>
      </ol>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4 text-gray-700">
        <b>Tip:</b> Submitting all requested deliverables the first time speeds up approval. Double-check your work and include any relevant test results or demo links.
      </div>
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded mb-2 text-gray-800">
        <b>After Submission:</b>
        <ul className="list-disc ml-6">
          <li>The AI will check your work against the original job requirements and deliverables.</li>
          <li>If approved, the client is notified and the payment process begins.</li>
          <li>If not approved, you’ll receive detailed feedback so you can make corrections.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default HowToSubmitWork;
