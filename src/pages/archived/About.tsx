/* import React from 'react';
import { Zap } from 'lucide-react';

const About: React.FC = () => {


  
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
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
        <p style={{ lineHeight: '1.5', marginBottom: '2rem' }}>
            SecureWork is a decentralized application that allows two parties document an unchangeable record the terms of a job and securely hold payment until the work is delivered. 
            Providing a permanent, time-stamped record of what was promised before any work begins. This creates accountability by clearly recording the deal up front.
        Payment is locked in a smart contract and released only after the submitted work is reviewed. SecureWork uses task checklists and AI analysis to determine if the job meets the original terms. If the AI can’t confirm that the work is complete — or returns a rejection — the freelancer can trigger a fallback and ask the client to manually review and approve the submission. This ensures the agreement can be completed fairly, even when AI review isn't enough.
       
            This app is the escrow service for job contracts.  A way for two parties to agree on the terms of a job, hold payment in escrow, and ensure that the work is delivered as promised.  </p>

        <p style={{ lineHeight: '1.5', marginBottom: '2rem' }}>
          It uses IPFS decentralized storage to make a record of the terms of the agreement, including: itemized list of deliverables with requirements, the job pay, any deadlines so both parties have an unchangable record of the agreement.  
       
        </p>
            It uses smart contracts to hold the payment in escrow until the work is verified and delivered.  
        <p style={{ lineHeight: '1.5', marginBottom: '2.5rem' }}>
            It uses AI to verify that the work meets the requirements of the job as defined and recorded on IPFS.  If the AI cannot verify the work, it will trigger a fallback to allow the client to manually review and approve the work.  This ensures that the agreement can be completed fairly, even when AI review isn't enough.
        </p>
        <p style={{ lineHeight: '1.7', marginBottom: '2.5rem' }}>
             </p>


   <div className="flex items-center gap-3 w-fit mx-auto mt-6">
  <Zap
    size={32}
    stroke="none"
    className="text-[#e5f836]"
    style={{ fill: 'currentColor' }}
  />
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
  
            <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.05rem' }}>
              Proudly built using Bolt.new
            </div>
       </div>   
        </div>
      </div>
    </div>
  
  )};

export default About;  */
