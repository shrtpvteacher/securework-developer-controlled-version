import React from 'react';

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
          <strong>SecureWork</strong> was built using Bolt.new on June 11, 2025 during the world’s largest hackathon hosted by Devpost.
        </p>

        <p style={{ lineHeight: '1.7', marginBottom: '2rem' }}>
          This project was created with Bolt.new and then refined with handcrafted logic to improve usability and protection inside the smart contracts — including one-time funding logic, fallback mechanisms for rejected work, and timeout-based payout options to ensure funds are never stuck.
        </p>

        <p style={{ lineHeight: '1.7', marginBottom: '2.5rem' }}>
          This project reflects a commitment to fairness and usability — for both freelancers and clients. It blends clean automation with thoughtful protections to avoid centralized gatekeeping.
        </p>

       
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
  <a
    href="https://bolt.new"
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'inline-block', textDecoration: 'none' }}
  >
    <img
      src="https://raw.githubusercontent.com/openbolt/bolt-badge/main/seal-light.svg"
      alt="Bolt.new badge"
      style={{ height: '40px' }}
    />
            <div style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.25rem' }}>
              Proudly built using Bolt.new
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
