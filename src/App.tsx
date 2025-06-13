import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import JobDetails from './pages/JobDetails';
import { WalletProvider } from './context/WalletContext';
import { JobProvider } from './context/JobContext';
import About from './pages/About';

function App() {
  return (
    <WalletProvider>
      <JobProvider>
        <Router>
        <div className="min-h-screen bg-red-500 text-white">

            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
              <Route path="/job/:jobId" element={<JobDetails />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </JobProvider>
    </WalletProvider>
  );
}

export default App;