// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobBoardGallery from './pages/JobBoardGallery';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import JobDetails from './pages/JobDetails';
import { WalletProvider } from './context/WalletContext';
import { JobProvider } from './context/JobContext';
import CreateJobPage from './pages/CreateJobPage';
import Footer from './components/Footer';



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
              <Route path="/job/:jobId" element={<JobDetails />} />
            </Routes>

            <Footer />
        
        </Router>
      </JobProvider>
    </WalletProvider>
  );
}

export default App;
