// src/pages/how-to/HowToConnectWallet.tsx

import React from "react";
import { Link } from "react-router-dom";

const HowToConnectWallet: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-12">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-12 p-8 border border-gray-100">
      <Link to="/how-to" className="text-blue-700 hover:underline mb-4 inline-block">&larr; Back to Tutorials</Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">How to Connect Your Wallet</h1>
      <div className="aspect-video rounded-xl overflow-hidden shadow mb-6">
        <iframe
          src="https://www.youtube.com/embed/YTconnectDemo"
          title="How to Connect Your Wallet"
          frameBorder={0}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <ol className="list-decimal ml-6 mb-8 space-y-3 text-gray-800 text-lg">
        <li>Open SecureWork in your browser.</li>
        <li>Click the “Connect Wallet” button at the top right of the page.</li>
        <li>MetaMask will prompt you to approve the connection.</li>
        <li>Approve and wait for the confirmation notification.</li>
        <li>Your wallet address will now appear in the navigation bar.</li>
      </ol>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4 text-gray-700">
        <b>Tip:</b> Make sure you’re on the correct network (e.g., Ethereum Mainnet or the required testnet).
      </div>
    </div>
  </div>
);

export default HowToConnectWallet;
