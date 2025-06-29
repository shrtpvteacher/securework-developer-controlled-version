// src/pages/HowToPage.tsx

import React from "react";
import { Link } from "react-router-dom";

const howToTopics = [
  {
    step: 1,
    title: "How to Get a MetaMask Wallet",
    videoUrl: "https://www.youtube.com/watch?v=Af_lQ1zUnoM",
    videoId: "Af_lQ1zUnoM",
    bullets: [
      "Go to metamask.io",
      "Install the browser extension",
      "Create a new wallet",
      "Secure your seed phrase",
    ],
    detailsUrl: "/how-to/metamask",
  },
  {
    step: 2,
    title: "How to Fund Your Account",
    videoUrl: "https://www.youtube.com/watch?v=QqZ6B1H9lfs",
    videoId: "QqZ6B1H9lfs",
    bullets: [
      "Buy ETH from an exchange or friend",
      "Copy your MetaMask wallet address",
      "Send ETH to your address",
      "Check balance before starting",
    ],
    detailsUrl: "/how-to/fund-account",
  },
  {
    step: 3,
    title: "How to Connect Your Wallet",
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
    step: 4,
    title: "How to Use Your Dashboard",
    videoUrl: "https://www.youtube.com/watch?v=YTDashboardDemo",
    videoId: "YTDashboardDemo",
    bullets: [
      "See your job stats and earnings",
      "Switch tabs for jobs and proposals",
      "Click jobs to view their details",
      "Track all your activity here",
    ],
    detailsUrl: "/how-to/dashboard",
  },
  {
    step: 5,
    title: "How to Post a Job (Clients)",
    videoUrl: "https://www.youtube.com/watch?v=YTPostJobDemo",
    videoId: "YTPostJobDemo",
    bullets: [
      "Go to 'Post a Job'",
      "Fill in job details and requirements",
      "Set payment, deadline, and options",
      "Click 'Create Job' and confirm",
    ],
    detailsUrl: "/how-to/post-job",
  },
  {
    step: 6,
    title: "How to Find & Apply for Jobs (Freelancers)",
    videoUrl: "https://www.youtube.com/watch?v=YTFindJobsDemo",
    videoId: "YTFindJobsDemo",
    bullets: [
      "Browse available jobs on the dashboard",
      "Read the job details and requirements",
      "Click 'Apply' and submit your proposal",
      "Track your applications and offers",
    ],
    detailsUrl: "/how-to/apply-jobs",
  },
  {
    step: 7,
    title: "How to Submit Work & Get Paid",
    videoUrl: "https://www.youtube.com/watch?v=YTSubmitWorkDemo",
    videoId: "YTSubmitWorkDemo",
    bullets: [
      "Go to your active job",
      "Click 'Submit Work' and upload files",
      "Add comments or links if needed",
      "Wait for client review and payment",
    ],
    detailsUrl: "/how-to/submit-work",
  },
  {
    step: 8,
    title: "How to Dispute a Job or Payment",
    videoUrl: "https://www.youtube.com/watch?v=YTDisputeDemo",
    videoId: "YTDisputeDemo",
    bullets: [
      "Go to the job details page",
      "Click 'Dispute' and describe your issue",
      "Wait for platform review",
      "Check your dashboard for updates",
    ],
    detailsUrl: "/how-to/dispute",
  },
  {
    step: 9,
    title: "How to Update Your Profile",
    videoUrl: "https://www.youtube.com/watch?v=YTProfileDemo",
    videoId: "YTProfileDemo",
    bullets: [
      "Click on your avatar at the top right",
      "Select 'Profile' from the menu",
      "Edit your details and bio",
      "Save your changes",
    ],
    detailsUrl: "/how-to/profile",
  },
  {
    step: 10,
    title: "Security Tips & Troubleshooting",
    videoUrl: "https://www.youtube.com/watch?v=YTSecurityDemo",
    videoId: "YTSecurityDemo",
    bullets: [
      "Never share your wallet seed phrase",
      "Check job details before applying",
      "Use support if you have an issue",
      "Contact us for urgent help",
    ],
    detailsUrl: "/how-to/security",
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl shadow-lg p-6 mb-12 border border-gray-100 min-h-[180px] max-h-[180px] items-center"
        >
          {/* LEFT: Video Thumbnail */}
          <a
            href={topic.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-center items-center h-full mb-4 md:mb-0"
            style={{ minHeight: "100px", maxHeight: "100px" }}
          >
            <img
              src={`https://img.youtube.com/vi/${topic.videoId}/hqdefault.jpg`}
              alt={topic.title}
              className="rounded-xl shadow-md object-cover w-[120px] h-[100px] hover:scale-105 transition-transform duration-200"
              style={{ background: "#eee" }}
            />
          </a>
          {/* CENTER: Step bullets */}
          <div className="flex flex-col justify-center h-full items-center md:items-start">
            <h3 className="text-lg font-bold mb-1 text-center md:text-left">
              Step {topic.step}: {topic.title}
            </h3>
            <ul className="list-disc ml-4 text-gray-700 text-base space-y-1">
              {topic.bullets.slice(0, 4).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          {/* RIGHT: See Details button */}
          <div className="flex justify-center md:justify-end items-center h-full">
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
