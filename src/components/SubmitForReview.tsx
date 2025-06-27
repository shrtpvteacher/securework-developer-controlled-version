// src/components/SubmitForReview.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

import JobABI from '../../netlify/functions/abis/JobEscrowABI.json';

/* ------------------------------------------------------------------ */
/*  Types that match the metadata JSON you upload to IPFS             */
/* ------------------------------------------------------------------ */

interface JobMetadata {
  title?: string;
  description?: string;
  jobPay?: string;
  requirements?: string[];
  deliverables?: string[];
    
  clientAddress?: string;
  contractCreationFee?: string;
  createdAt?: string;
}

interface ReviewBreakdownItem {
  requirement: string;
  met: boolean;
}

interface ReviewResult {
  status: 'Pass' | 'Fail' | string;
  itemBreakdown?: ReviewBreakdownItem[];
  promptUsed?: string;
}


interface SubmitForReviewProps {
  contractAddress: string;
  onClose: () => void;
  onReviewComplete?: (result: ReviewResult) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const SubmitForReview: React.FC<SubmitForReviewProps> = ({
contractAddress,
  onClose,
  onReviewComplete,
}) => {
  

  const [metadata, setMetadata] = useState<JobMetadata | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------- Fetch metadata --------------------------- */
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        if (!contractAddress) return;

        const provider = new ethers.providers.Web3Provider(
          (window as any).ethereum,
        );
        const contract = new ethers.Contract(contractAddress, JobABI, provider);

        const ipfsUri: string = await contract.jobMetadataURI();
        const httpUrl = ipfsUri.replace(
          'ipfs://',
          'https://gateway.pinata.cloud/ipfs/',
        );

        const res = await fetch(httpUrl);
        const data: JobMetadata = await res.json();
        setMetadata(data);
      } catch (err) {
        console.error('Metadata fetch error:', err);
        setError('Could not load job metadata.');
      }
    };

    loadMetadata();
  }, [contractAddress]);

  /* ----------------------------- File input ----------------------------- */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const isZip =
      file.type === 'application/zip' ||
      file.name.toLowerCase().endsWith('.zip');

    if (!isZip) {
      setError('Please upload a single .zip file.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setReviewResult(null);
    setError(null);
  };

  /* --------------------------- Submit to AI ----------------------------- */
  const handleSubmitReview = async () => {
    if (!selectedFile || !metadata) {
      setError('Select a .zip file and wait for metadata to load.');
      return;
    }

    setIsReviewing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile, selectedFile.name);
      formData.append(
        'deliverables',
        JSON.stringify(metadata.deliverables ?? []),
      );
      formData.append(
        'requirements',
        JSON.stringify(metadata.requirements ?? []),
      );

      const res = await axios.post<ReviewResult>(
        '/.netlify/functions/aiReview',
        formData,
      );

      setReviewResult(res.data);
      if (res.data.status === 'Pass' && onReviewComplete) {
        onReviewComplete(res.data); // parent can trigger Dropbox upload etc.
      }
    } catch (err) {
      console.error('AI review error:', err);
      setError('AI review failed.');
    } finally {
      setIsReviewing(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Submit Work for AI Review</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* ------------------------ AI Review Result ------------------------ */}
      {reviewResult && (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
          <h3 className="font-medium mb-2">
            {reviewResult.status === 'Pass'
              ? '✅ PASS: Your submission meets the requirements.'
              : '❌ FAIL: Your submission did not meet all required criteria.'}
          </h3>

          {reviewResult.itemBreakdown?.length ? (
            <ul className="ml-4 list-disc space-y-1 text-sm">
              {reviewResult.itemBreakdown.map((item, idx) => (
                <li key={idx}>
                  {item.met ? '✅' : '❌'} {item.requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No breakdown available.</p>
          )}
        </div>
      )}

      {/* --------------------------- Job Details -------------------------- */}
      {metadata ? (
        <>
          <h3 className="text-lg font-semibold mb-1">{metadata.title}</h3>
          <p className="mb-2">{metadata.description}</p>

          {metadata.jobPay && (
            <p className="mb-1 text-sm">
              <span className="font-medium">Pay:</span> {metadata.jobPay} ETH
            </p>
          )}
          

          {metadata.requirements?.length && (
            <div className="mb-4">
              <p className="font-semibold">Requirements:</p>
              <ul className="ml-4 list-disc text-sm">
                {metadata.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {metadata.deliverables?.length && (
            <div className="mb-4">
              <p className="font-semibold">Deliverables:</p>
              <ul className="ml-4 list-disc text-sm">
                {metadata.deliverables.map((del, i) => (
                  <li key={i}>{del}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <p className="mb-4">Loading metadata…</p>
      )}

      {/* --------------------------- File input --------------------------- */}
      <div className="my-4">
        <label
          htmlFor="file"
          className="block font-medium mb-1 text-sm text-gray-700"
        >
          Upload your completed work (.zip only)
        </label>
        <input
          id="file"
          type="file"
          accept=".zip,application/zip"
          onChange={handleFileChange}
          className="block w-full text-sm
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>

      {/* ------------------------ Action buttons ------------------------- */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmitReview}
          disabled={!selectedFile || isReviewing || !metadata}
          className="inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReviewing && (
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {isReviewing ? 'Reviewing…' : 'Submit for Review'}
        </button>

        <button
          onClick={onClose}
          className="text-gray-600 underline text-sm hover:text-gray-800"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SubmitForReview;
