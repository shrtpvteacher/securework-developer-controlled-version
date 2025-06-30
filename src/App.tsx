// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobBoardGallery from './pages/JobBoardGallery';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import AssignmentDetails from "./pages/AssignmentDetailsPage";
import AIReviewResults from "./pages/AIReviewResultsPage";
import { WalletProvider } from './context/WalletContext';
import { JobProvider } from './context/JobContext';
import CreateJobPage from './pages/CreateJobPage';
import MetadataPreviewPage from './pages/MetadataPreviewPage';
//import DeployJobEscrowWithMetadataURL from './pages/DeployJobEscrowWithMetadataURL';
import Footer from './components/Footer';
import SubmitForReview from './pages/SubmitForReviewPage';
import VerifyDelivery from './pages/VerifyDeliveryPage';
import SendToDropbox from './pages/SendToDropboxPage'; 
import HowToPage from './pages/HowToPage';
import ClientJobActionsPage from "./pages/ClientJobActionsPage";
import SubmitProposalPage from './pages/SubmitProposalPage';


import HowToConnectWallet from './pages/how-to/HowToConnectWallet';
import HowToPostJob from './pages/how-to/HowToPostJob';
import HowToSubmitWork from './pages/how-to/HowToSubmitWork';
import HowToAiNotApproved from './pages/how-to/WhatIfAiiDoesntApprove';


function App() {
  return (
    <WalletProvider>
      <JobProvider>
        <Router>

            <Navbar />
           
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-job" element={<CreateJobPage />} />
             {/*} <Route path="/deploy-job-escrow" element={<DeployJobEscrowWithMetadataURL />} /> */}
              <Route path="/metadata-preview" element={<MetadataPreviewPage />} />
              <Route path="/job-board" element={<JobBoardGallery />} />
              <Route path="/job/:id" element={<ClientJobActionsPage />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} /> 
              <Route path="/job-board/:jobAddress/submit-proposal" element={<SubmitProposalPage />} />
              <Route path="/ai-review/:contractAddress/:jobId" element={<AIReviewResults />}/>
              <Route path="/assignment/:contractAddress/:jobId" element={<AssignmentDetails />}/>
              <Route path="/submit-for-review/:contractAddress" element={<SubmitForReview />} />
              <Route path="/verify-delivery/:contractAddress/:jobId" element={<VerifyDelivery />} />
              <Route path="/send-to-dropbox/:contractAddress" element={<SendToDropbox />} />
              <Route path="/how-to" element={<HowToPage />} />
              <Route path="/how-to/connect-wallet" element={<HowToConnectWallet />} />
              <Route path="/how-to/post-job" element={<HowToPostJob />} />
              <Route path="/how-to/submit-work" element={<HowToSubmitWork />} />
              <Route path="/how-to/ai-not-approved" element={<HowToAiNotApproved />} />
            </Routes>

            <Footer />
        
        </Router>
      </JobProvider>
    </WalletProvider>
  );
}

export default App;
