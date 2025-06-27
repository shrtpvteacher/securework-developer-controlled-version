import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface SendToDropboxProps {
  dropboxFileId: string;      // Dropbox file ID for the zip file
  clientEmail: string;        // Client's email address for notification
  contractAddress: string;    // Job escrow smart contract address
  verificationType: 'AI' | 'Client'; // Which verify function to call on contract
  onSuccess?: () => void;     // Callback on success (optional)
}

const jobEscrowABI = [
  "function verifyByAI(string memory dropboxFileId) external",
  "function verifyByClient(string memory dropboxFileId) external"
];

const SendToDropbox: React.FC<SendToDropboxProps> = ({
  dropboxFileId,
  clientEmail,
  contractAddress,
  verificationType,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSend = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // Step 1: Call backend Netlify function to send email & delivery
      const deliverResp = await axios.post('/.netlify/functions/deliver-to-dropbox', {
        dropboxFileId,
        clientEmail,
        contractAddress,
      });

      if (!deliverResp.data.success) {
        throw new Error(deliverResp.data.error || 'Delivery failed');
      }

      // Step 2: Call smart contract verification
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
      await tx.wait();

      setSuccessMsg('Files sent and contract verified successfully!');
      onSuccess?.();

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred during delivery or verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded bg-gray-50">
      <button
        onClick={handleSend}
        disabled={loading || !dropboxFileId}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading && <Loader2 className="animate-spin h-5 w-5" />}
        Send File & Verify
      </button>

      {successMsg && (
        <p className="mt-3 text-green-700 flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {successMsg}
        </p>
      )}

      {errorMsg && (
        <p className="mt-3 text-red-600 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default SendToDropbox;
