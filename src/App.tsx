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
import Footer from './components/Footer';
import SubmitForReview from './pages/SubmitForReviewPage';
import VerifyDelivery from './pages/VerifyDeliveryPage';
import SendToDropbox from './pages/SendToDropboxPage'; 



function App() {
  return (
    <WalletProvider>
      <JobProvider>
        <Router>

            <Navbar />
           
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-job" element={<CreateJobPage />} />
              <Route path="/job-board" element={<JobBoardGallery />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} /> 
              <Route path="/ai-review/:contractAddress/:jobId" element={<AIReviewResults />}/>
              <Route path="/assignment/:contractAddress/:jobId" element={<AssignmentDetails />}/>
              <Route path="/submit-for-review/:contractAddress" element={<SubmitForReview />} />
              <Route path="/verify-delivery/:contractAddress/:jobId" element={<VerifyDelivery />} />
              <Route path="/send-to-dropbox/:contractAddress" element={<SendToDropbox />} />
            </Routes>

            <Footer />
        
        </Router>
      </JobProvider>
    </WalletProvider>
  );
}

export default App;
