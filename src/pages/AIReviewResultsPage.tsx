//AiReviewResultsPae.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Helper (optional): style for the verdict badge
const verdictClass = (passed: boolean) =>
  passed
    ? "inline-block bg-emerald-500 text-white px-4 py-2 rounded-full text-lg font-semibold mb-4"
    : "inline-block bg-red-500 text-white px-4 py-2 rounded-full text-lg font-semibold mb-4";

// Main page
const AIReviewResults: React.FC = () => {
  const { contractAddress, jobId } = useParams<{ contractAddress: string; jobId: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<null | { passed: boolean; feedback: string; details?: any }>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const runAIReview = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/.netlify/functions/aiReview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contractAddress,
            jobId,
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        if (!data.reviewResult) throw new Error("AI review result missing.");
        setResult(data.reviewResult);
      } catch (err: any) {
        setError(typeof err === "string" ? err : err.message || "AI review failed.");
      } finally {
        setLoading(false);
      }
    };

    if (contractAddress && jobId) runAIReview();
  }, [contractAddress, jobId]);

  // Handlers for next steps
  const handleContinue = () => {
    // Go to the Dropbox submission step (customize this route for your app)
    navigate(`/verify-delivery/${contractAddress}/${jobId}`);
  };
  const handleBack = () => {
    // Go back to assignment details to fix work and resubmit
    navigate(`/assignment/${contractAddress}/${jobId}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">AI Review Results</h2>

      {/* Spinner while loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
          <span className="text-lg">Running AI review...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6 border border-red-300">
          {error}
          <div>
            <button
              onClick={handleBack}
              className="mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-2 px-6 rounded shadow"
            >
              Back to Assignment
            </button>
          </div>
        </div>
      )}

      {/* Show result */}
      {!loading && result && (
        <div>
          <div className={verdictClass(result.passed)}>
            {result.passed ? "PASS" : "FAIL"}
          </div>

          <div className="mt-4 mb-6 text-lg text-gray-800">
            {result.passed
              ? "Congratulations! Your submission passed the AI review."
              : "Your submission did not pass the AI review. Please see the feedback below."}
          </div>

          <div className="bg-gray-50 border p-4 rounded text-left whitespace-pre-line mb-4">
            <strong>AI Feedback:</strong>
            <div className="mt-1">
              {result.feedback}
            </div>
            {result.details && (
              <pre className="mt-2 text-xs text-gray-600">{JSON.stringify(result.details, null, 2)}</pre>
            )}
          </div>

          {result.passed ? (
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mt-6"
            >
              Continue to Submit Final Work
            </button>
          ) : (
            <button
              onClick={handleBack}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors mt-6"
            >
              Back to Assignment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIReviewResults;
