import React from 'react';
import { Zap } from 'lucide-react';

const About: React.FC = () => {


  
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        backgroundImage: `
          radial-gradient(circle at top, #ffffff 10%, transparent 30%),
          linear-gradient(to bottom, #fafafa, #d9d9d9, #0b0e23)
        `,
        color: '#1a1a1a',
        fontFamily: 'sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.75rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center',
          color: '#0b0e23',
        }}
      >
        About This Project
      </h1>

      <div
        style={{
          maxWidth: '850px',
          padding: '0 1rem',
          textAlign: 'left',
        }}
      >
        <p style={{ lineHeight: '1.7', marginBottom: '2rem' }}>
          <strong>SecureWork</strong> build began June 11, 2025 during the world’s largest hackathon hosted by Devpost
        </p>

        <p style={{ lineHeight: '1.7', marginBottom: '2rem' }}>
          This project was created with Bolt.new, edits and improvements to code were done off platform in vscode by hand by entrant to improve usability.
        </p>

        <p style={{ lineHeight: '1.7', marginBottom: '2.5rem' }}>
          This project reflects a commitment to fairness and usability — It blends clean automation with thoughtful protections to avoid centralized gatekeeping.
        </p>
        <p style={{ lineHeight: '1.7', marginBottom: '2.5rem' }}>
            SecureWork is a decentralized application that allows two parties to document the terms of a job and securely hold payment until the work is delivered. Once the agreement is submitted, the terms cannot be changed — providing a permanent, time-stamped record of what was promised before any work begins. This creates accountability by clearly recording the deal up front.
        Payment is locked in a smart contract and released only after the submitted work is reviewed. SecureWork uses task checklists and AI analysis to determine if the job meets the original terms. If the AI can’t confirm that the work is complete — or returns a rejection — the freelancer can trigger a fallback and ask the client to manually review and approve the submission. This ensures the agreement can be completed fairly, even when AI review isn't enough.
        </p>


   <div className="flex items-center gap-3 bg-gray-900 p-4 rounded-xl shadow-md w-fit mx-auto mt-6">
  <Zap
    size={32}
    stroke="none"
    className="text-[#E6FF00]"
    style={{ fill: 'currentColor' }}
  />
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
  
            <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.25rem' }}>
              Proudly built using Bolt.new
            </div>
       </div>   
        </div>
      </div>
    </div>
  
    };

export default About;
