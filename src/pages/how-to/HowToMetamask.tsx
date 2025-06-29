// src/pages/how-to/HowToMetaMask.tsx

import React from "react";
import { Link } from "react-router-dom"; // Use if you want a "Back" button

const HowToMetaMask: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-12">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-12 p-8 border border-gray-100">
      {/* Optional back button */}
      <Link to="/how-to" className="text-blue-700 hover:underline mb-4 inline-block">&larr; Back to Tutorials</Link>
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">How to Get a MetaMask Wallet</h1>
      {/* Embedded video */}
      <div className="aspect-video rounded-xl overflow-hidden shadow mb-6">
        <iframe
          src="https://www.youtube.com/embed/Af_lQ1zUnoM"
          title="How to Get a MetaMask Wallet"
          frameBorder={0}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      {/* Written steps */}
      <ol className="list-decimal ml-6 mb-8 space-y-3 text-gray-800 text-lg">
        <li>Go to <a href="https://metamask.io" className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">metamask.io</a>.</li>
        <li>Click “Download” and choose your browser.</li>
        <li>Follow the prompts to add MetaMask as a browser extension.</li>
        <li>Click the MetaMask icon in your browser’s toolbar to launch.</li>
        <li>Click “Create a Wallet” and follow the prompts.</li>
        <li><b>IMPORTANT:</b> Write down your seed phrase and store it somewhere safe. Never share it with anyone.</li>
        <li>Set a strong password and finish setup.</li>
        <li>Your MetaMask wallet is now ready to use!</li>
      </ol>
      {/* Tips */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4 text-gray-700">
        <b>Tip:</b> MetaMask works best on Chrome, Firefox, or Brave browsers.
      </div>
    </div>
  </div>
);

export default HowToMetaMask;
