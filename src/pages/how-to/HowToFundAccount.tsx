// src/pages/how-to/HowToFundAccount.tsx

import React from "react";
import { Link } from "react-router-dom";

const HowToFundAccount: React.FC = () => (
  <div className="min-h-screen w-full bg-gradient-to-r from-blue-600 to-emerald-600 pb-12">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-12 p-8 border border-gray-100">
      <Link to="/how-to" className="text-blue-700 hover:underline mb-4 inline-block">&larr; Back to Tutorials</Link>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">How to Fund Your Account</h1>
      <div className="aspect-video rounded-xl overflow-hidden shadow mb-6">
        <iframe
          src="https://www.youtube.com/embed/QqZ6B1H9lfs"
          title="How to Fund Your Account"
          frameBorder={0}
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <ol className="list-decimal ml-6 mb-8 space-y-3 text-gray-800 text-lg">
        <li>Buy ETH from a crypto exchange or receive from a friend.</li>
        <li>Open MetaMask and copy your wallet address (top of the extension).</li>
        <li>Initiate a withdrawal or send transaction to your MetaMask address.</li>
        <li>Wait for network confirmation (may take a minute or two).</li>
        <li>Check your new balance in MetaMask.</li>
      </ol>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4 text-gray-700">
        <b>Tip:</b> For testing, you can use a testnet faucet (ask your project admin for the faucet link if needed).
      </div>
    </div>
  </div>
);

export default HowToFundAccount;
