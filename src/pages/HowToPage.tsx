// src/pages/HowToPage.tsx

import React from "react";
import { Link } from "react-router-dom";

const howToTopics = [
  {
    step: 1,
    title: "How to Get a MetaMask Wallet & Fund it",
    videoUrl: "https://www.youtube.com/watch?v=Af_lQ1zUnoM",
    videoId: "Af_lQ1zUnoM",
    bullets: [
      "Go to metamask.io, install the extension, and create your wallet",
      "Write your recovery phrase down offline and never share it",
      "Add funds to your MetaMask wallet by clicking buy in the extension",
    ],
    detailsUrl: "/how-to/metamask",
  },
  {
    step: 2,
    title: "How to Connect Your Wallet to SecureWork",
    videoUrl: "https://www.youtube.com/watch?v=YTconnectDemo",
    videoId: "YTconnectDemo",
    bullets: [
      "Open SecureWork in your browser",
      "Click 'Connect Wallet'",
      "Approve the connection in MetaMask",
      "Wait for confirmation",
    ],
    detailsUrl: "/how-to/connect-wallet",
  },
  {
    step: 3,
    title: "How to Post a Job (Clients)",
    videoUrl: "https://www.youtube.com/watch?v=YTPostJobDemo",
    videoId: "YTPostJobDemo",
    bullets: [
      "Click 'Create New Job'",
      "Enter job details and requirements",
      "Upload to IPFS for transparency",
      "Review and confirm, then post",
    ],
    detailsUrl: "/how-to/post-job",
  },
  {
    step: 4,
    title: "How to Submit Work (Freelancers)",
    videoUrl: "https://www.youtube.com/watch?v=YTSubmitWorkDemo",
    videoId: "YTSubmitWorkDemo",
    bullets: [
      "Go to your assigned job in the dashboard",
      "Click 'Submit Work' button",
      "Upload your work files and add any notes",
      "Submit for AI review and client approval",
    ],
    detailsUrl: "/how-to/submit-work",
  },
  {
    step: 5,
    title: "What to do if AI Doesn't Approve Your Submission?",
    videoUrl: "https://www.youtube.com/watch?v=YTAiNotApprovedDemo",
    videoId: "YTAiNotApprovedDemo",
    bullets: [
      "Read the AI feedback, fix what's missing, and resubmit your work",
      "If the 3rd submission fails, request client verification",
    ],
    detailsUrl: "/how-to/ai-not-approved",
  },
];

const HowToPage: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-16">
    {/* HERO */}
    <div className="py-16 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
          Getting Started & How To Video Tutorials
        </h1>
        <p className="text-lg text-white/90 mb-6">
          Step-by-step video guides and quick instructions for every key task on SecureWork.
        </p>
      </div>
    </div>
    {/* HOW TO CARDS */}
    <div className="max-w-5xl mx-auto px-2">
      {howToTopics.map((topic) => (
        <div
          key={topic.step}
          className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-stretch min-h-[190px] mb-10 overflow-hidden"
        >
          {/* LEFT: Large Video Thumbnail */}
          <a
            href={topic.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="md:w-1/3 w-full flex items-center justify-center bg-gray-100 p-6"
            style={{ minHeight: "176px" }}
          >
            <img
              src={`https://img.youtube.com/vi/${topic.videoId}/hqdefault.jpg`}
              alt={topic.title}
              className="rounded-lg w-72 h-44 object-cover shadow-lg"
              style={{ background: "#eee" }}
            />
          </a>
          {/* CENTER: Step bullets */}
          <div className="md:w-1/2 w-full flex flex-col justify-center px-6 py-6">
            <h3 className="text-xl font-bold mb-2">
              Step {topic.step}: {topic.title}
            </h3>
            <ul className="list-disc ml-5 text-gray-700 text-base space-y-1">
              {topic.bullets.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          {/* RIGHT: See Details button */}
          <div className="md:w-1/4 w-full flex items-center justify-center md:justify-end px-6 py-6">
            <Link
              to={topic.detailsUrl}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition-transform"
            >
              See Details &gt;
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HowToPage;
