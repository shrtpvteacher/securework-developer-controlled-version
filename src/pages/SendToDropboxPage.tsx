import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const jobEscrowABI = [
  "function verifyByAI(string memory dropboxFileId) external",
  "function verifyByClient(string memory dropboxFileId) external"
];

const SendToDropboxPage: React.FC = () => {
  const { contractAddress } = useParams<{ contractAddress: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // Expecting dropboxFileId, clientEmail, and verificationType passed in router state
  const state = location.state as {
    dropboxFileId?: string;
    clientEmail?: string;
    verificationType?: 'AI' | 'Client';
  } | undefined;

  const dropboxFileId = state?.dropboxFileId || '';
  const clientEmail = state?.clientEmail || '';
  const verificationType = state?.verificationType || 'AI';

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  if (!contractAddress) {
    return <p className="max-w-xl mx-auto mt-8 text-red-600">Error: Missing contract address in URL.</p>;
  }

  if (!dropboxFileId || !clientEmail) {
    return <p className="max-w-xl mx-auto mt-8 text-red-600">Error: Missing Dropbox file ID or client email.</p>;
  }

  const handleSendAndVerify = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setTxHash(null);

    try {
      // Step 1: Call backend to deliver file & email client
      const deliverResp = await axios.post('/.netlify/functions/deliver-to-dropbox', {
        dropboxFileId,
        clientEmail,
        contractAddress,
      });

      if (!deliverResp.data.success) {
        throw new Error(deliverResp.data.error || 'Delivery failed');
      }

      // Step 2: Call smart contract verify function
      if (!window.ethereum) throw new Error('MetaMask not detected');

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, jobEscrowABI, signer);

      let tx;
      if (verificationType === 'AI') {
        tx = await contract.verifyByAI(dropboxFileId);
      } else {
        tx = await contract.verifyByClient(dropboxFileId);
      }

      const receipt = await tx.wait();
      setTxHash(receipt.transactionHash);

      // Step 3: Save tx hash via backend API for dashboard tracking
      await axios.post('/.netlify/functions/save-txhash', {
        contractAddress,
        txHash: receipt.transactionHash,
        verificationType,
        dropboxFileId,
      });

      setSuccessMsg('Files sent and contract verified successfully!');

      // Redirect after 3 seconds so user can see message
      setTimeout(() => navigate('/client-dashboard'), 3000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred during delivery or verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded bg-gray-50 shadow space-y-6">
      <h1 className="text-3xl font-bold">Send Files to Dropbox & Verify Contract</h1>

      <p><strong>Contract Address:</strong> {contractAddress}</p>
      <p><strong>Dropbox File ID:</strong> {dropboxFileId}</p>
      <p><strong>Client Email:</strong> {clientEmail}</p>
      <p><strong>Verification Type:</strong> {verificationType}</p>

      <button
        onClick={handleSendAndVerify}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading && <Loader2 className="animate-spin h-6 w-6" />}
        Send File & Verify
      </button>

      {txHash && (
        <p className="text-green-700 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Transaction Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash}</a>
        </p>
      )}

      {successMsg && (
        <p className="text-green-700 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMsg}
        </p>
      )}

      {errorMsg && (
        <p className="text-red-600 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default SendToDropboxPage;

