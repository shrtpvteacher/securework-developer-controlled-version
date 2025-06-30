import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

const SubmitProposalPage: React.FC = () => {
  const { jobAddress } = useParams<{ jobAddress: string }>();
  const [proposal, setProposal] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!proposal || !email) {
      setError('Please enter your proposal and email.');
      return;
    }

    setBusy(true);
    try {
      // Connect wallet and get freelancer address
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const freelancerAddress = await signer.getAddress();

      // Post proposal to backend (Netlify Function, etc)
      await fetch('/.netlify/functions/submitProposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobAddress,
          proposal,
          freelancerAddress,
          email,
        }),
      });

      setSuccess(true);
      setTimeout(() => navigate('/freelancer-dashboard'), 1800);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-emerald-100 py-12 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit Proposal</h2>
        {success ? (
          <div className="text-green-700 text-center">
            Proposal submitted! <br /> You’ll hear back soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-semibold block mb-1">Your Email</label>
              <input
                type="email"
                className="w-full border rounded p-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={busy}
                required
                placeholder="name@email.com"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Your Proposal</label>
              <textarea
                className="w-full border rounded p-2 h-32"
                value={proposal}
                onChange={e => setProposal(e.target.value)}
                disabled={busy}
                required
                placeholder="Why are you a great fit? How would you approach this job?"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold py-2 rounded shadow hover:opacity-90 transition"
              disabled={busy}
            >
              {busy ? "Submitting..." : "Submit Proposal"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SubmitProposalPage;
