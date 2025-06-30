// File: src/pages/ClientJobActionsPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import FundEscrowMint from "../components/FundEscrowMint";
import AssignFreelancer from "../components/AssignFreelancer";
import VerifyByClient from "../components/VerifyByClient";
import CancelBeforeAssigning from "../components/CancelBeforeAssigning";

const ClientJobActionsPage: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-emerald-600 p-4">
      <div className="max-w-2xl mx-auto pt-10 space-y-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8 drop-shadow">
          Job Actions for Job #{jobId}
        </h2>

        <FundEscrowMint jobId={jobId!} />
        <AssignFreelancer jobId={jobId!} />
        <VerifyByClient jobId={jobId!} />
        <CancelBeforeAssigning jobId={jobId!} />
      </div>
    </div>
  );
};

export default ClientJobActionsPage;
