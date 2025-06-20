# SecureWorkEscrow: Decentralized Freelance Job Escrow System

### Built for the 2025 Bolt Hackathon – World's Largest Hackathon by DevCon

**SecureWorkEscrow** is a decentralized platform for secure freelance job management, built for the **Bolt Hackathon (June 2025)** using **Bolt’s AI-powered platform** ([bolt.new](https://bolt.new)). Leveraging Ethereum smart contracts, the system facilitates trustless escrow between clients and freelancers with NFT-based role management, AI verification, and robust integrations for email notifications, file storage, metadata pinning, and AI-driven interactions. This project showcases Bolt’s ability to generate production-ready smart contracts and a deployable web app from a single **500-word prompt**, enhanced with minimal, targeted edits for security, live API functionality, and real-world usability.

**[Live Demo](https://your-netlify-url.netlify.app)** | **[Sepolia Testnet Contracts](https://sepolia.etherscan.io/address/0xYourFactoryAddress)** | **[Video Walkthrough](https://your-video-link.com)** | **[GitHub Repo](https://github.com/your-repo)**

---

## ✨ Project Overview

SecureWorkEscrow enables clients to post jobs, fund them with ETH, and approve freelancer submissions through on-chain AI or client verification. Freelancers accept jobs, submit work via IPFS, and receive payouts, with protections against inactivity or disputes. The system uses non-transferable NFT role tokens to enforce client-freelancer separation and includes safety mechanisms to prevent double funding, reentrancy attacks, and unauthorized access. Enhanced with **ReSend**, **DropBox**, **Pinata**, and **ChatGPT APIs**, it offers email notifications, file storage, IPFS pinning, and AI-driven verification support, making it a robust, production-ready solution.

### Key Features
- **One-Time Funding**: Jobs are funded once via `JobEscrow`, with immutable funding behavior.
- **NFT Role Tokens**: Non-transferable NFTs (`clientTokenId=0`, `freelancerTokenId=1`) ensure secure role-based access.
- **AI Verification**: An AI verifier (EOA) validates submissions, with client override for rejections.
- **Fallback Payout**: Client can refund funds if no action is taken (e.g., AI/freelancer inactivity).
- **Factory Deployment**: `JobEscrowFactory` deploys jobs with a 0.001 ETH creation fee.
- **API Integrations**:
  - **ReSend API**: Sends email notifications for job creation, funding, and verification.
  - **DropBox API**: Stores job submissions and metadata files.
  - **Pinata API**: Pins job metadata and submissions to IPFS for decentralized storage.
  - **ChatGPT API**: Enhances AI verification with natural language processing for submission analysis.
- **Frontend Integration**: Bolt-generated UI with live Ethereum and API interactions via Netlify Functions.
- **Security Mechanisms**: Reentrancy protection, double-funding guards, and immutable contract logic.

---

## 🚀 How Bolt Was Used

The core of SecureWorkEscrow was generated using **Bolt’s AI** via a **500-word prompt** designed to create a secure, decentralized escrow system. The prompt specified:
- NFT-based roles for clients and freelancers.
- AI-driven work verification with client override.
- A factory contract for job creation with platform fees.
- Netlify deployment with serverless functions for contract interactions.

Bolt’s AI produced:
- **`JobEscrow.sol`**: Manages the job lifecycle (funding, freelancer assignment, submission, verification, payout/refunded).
- **`JobEscrowFactory.sol`**: Deploys `JobEscrow` instances and collects a 0.001 ETH fee.
- **Frontend UI**: A Bolt-generated dashboard for job management.
- **Mock Netlify Functions**: Simulated contract interactions in `netlify/functions`.

The AI-generated code constitutes **90% of the project**, demonstrating Bolt’s ability to deliver functional, secure smart contracts and a deployable web app from a single prompt. All architecture and frontend logic remain Bolt-compliant, with targeted enhancements for production use.

---

## 🔧 Modifications and Enhancements

To make SecureWorkEscrow production-ready and suitable for a live demo, I made minimal, targeted edits to Bolt’s AI-generated code, independently and without external funding. These changes enhance security, enable live Ethereum and API interactions, and ensure robust deployment, while preserving Bolt’s core design.

### 1. Smart Contract Security Enhancements
- **Why**: Bolt’s `JobEscrow` used `.transfer`, limiting compatibility with smart contracts (e.g., multisigs) as clients/freelancers. The factory’s fee transfer lacked reentrancy protection, and state accounting could be improved.
- **Edits**:
  - **JobEscrow.sol**:
    - Replaced `.transfer` with `.call` in `_finalizeJob` and `refundToClient` for smart contract compatibility.
    - Added OpenZeppelin’s `ReentrancyGuard` with `nonReentrant` modifier to prevent reentrancy attacks.
    - Zeroed `amount` before payouts for clear accounting.
  - **JobEscrowFactory.sol**:
    - Added `ReentrancyGuard` to `createJobEscrow` to secure fee transfers to `contractFeeCollector`.
    - Enabled refund of excess `msg.value` for user-friendliness (e.g., if user sends >0.001 ETH).
    - Added validation to prevent job ID overwrites.
- **Impact**: Ensures robust security and flexibility, tested with Slither (`slither JobEscrow.sol`) and Foundry for reentrancy-proof design.

### 2. Netlify Functions: Mock to Live APIs
- **Why**: Bolt’s mock Netlify Functions simulated contract interactions, unsuitable for a live Sepolia demo.
- **Edits**:
  - Replaced mocks with live integrations using `ethers.js` and Alchemy’s Ethereum provider to interact with `JobEscrow` (e.g., `getJobInfo`, `fundEscrow`).
  - Integrated external APIs for enhanced functionality:
    - **ReSend API**: Sends email notifications for job events (creation, funding, verification).
    - **DropBox API**: Stores job submissions and metadata files, linked via `dropboxFinalSubmission`.
    - **Pinata API**: Pins job metadata and submissions to IPFS, ensuring decentralized storage.
    - **ChatGPT API**: Supports AI verification by analyzing submission content (e.g., text-based work).
  - Updated frontend components (e.g., `src/components/JobManager.js`) to call live functions.
- **Files Modified**:
  - `netlify/functions/callContract.js`
  - `netlify/functions/fundEscrow.js`
  - `netlify/functions/notify.js` (ReSend integration)
  - `netlify/functions/uploadToDropBox.js` (DropBox integration)
  - `netlify/functions/pinToIPFS.js` (Pinata integration)
  - `netlify/functions/analyzeSubmission.js` (ChatGPT integration)
  - `src/components/JobManager.js`
- **Impact**: Enables real-time Ethereum and API interactions, showcasing a dynamic, user-friendly app.

### 3. Netlify Environment Variables and Secrets
- **Why**: Live APIs and Ethereum provider require secure configuration to avoid hardcoded sensitive data.
- **Edits**:
  - Added environment variables in Netlify UI:
    - `ALCHEMY_API_KEY`: Connects to Sepolia via Alchemy.
    - `CONTRACT_ADDRESS`: Deployed `JobEscrowFactory` address.
    - `RESEND_API_KEY`: Authenticates ReSend API for email notifications.
    - `DROPBOX_API_KEY`: Authenticates DropBox API for file storage.
    - `PINATA_API_KEY`: Authenticates Pinata API for IPFS pinning.
    - `CHATGPT_API_KEY`: Authenticates ChatGPT API for submission analysis.
  - Updated `netlify.toml` to specify `functions = "netlify/functions"`.
- **Impact**: Ensures secure, scalable deployment compliant with best practices.

### 4. Testing and Auditing
- **Why**: To validate security, API integrations, and functionality for production and hackathon evaluation.
- **Edits**:
  - Ran Slither (`slither JobEscrow.sol`, `slither JobEscrowFactory.sol`) to detect vulnerabilities; addressed all warnings.
  - Used Foundry to test reentrancy with a malicious freelancer contract; all attacks failed.
  - Tested API integrations:
    - ReSend: Verified email delivery for job events.
    - DropBox: Confirmed file uploads and retrieval.
    - Pinata: Validated IPFS pinning for metadata and submissions.
    - ChatGPT: Ensured accurate submission analysis.
  - Deployed to Sepolia for live testing of job workflows.
- **Impact**: Demonstrates a secure, audited, and fully functional project, boosting technical execution scores.

### Why These Edits?
The modifications were essential to:
- **Enhance Security**: Protect against reentrancy and support smart contract clients/freelancers.
- **Enable Live Functionality**: Replace mocks with Ethereum and external API interactions (ReSend, DropBox, Pinata, ChatGPT) for a working demo.
- **Ensure Production-Readiness**: Configure secure deployment with Netlify secrets.
These changes enhance Bolt’s AI-generated code without altering its core architecture, maintaining full compliance with the hackathon’s ecosystem.

---

## ⚖ Roles
- **Client (Owner)**: Creates and funds jobs via `JobEscrowFactory`, holds NFT (`clientTokenId=0`), and can override AI rejections to approve/refunded funds.
- **Freelancer**: Accepts jobs, submits work via IPFS (pinned with Pinata, stored in DropBox), holds NFT (`freelancerTokenId=1`), and can request client verification if AI rejects.
- **AI Verifier**: An EOA that validates submissions (augmented by ChatGPT API), triggering payouts or client overrides.

---

## ⛏ Technologies Used
- **Solidity (v0.8.20)**: For `JobEscrow` and `JobEscrowFactory`.
- **OpenZeppelin Contracts**: `ERC721URIStorage`, `Ownable`, `ReentrancyGuard`.
- **Bolt.new**: Generated core contracts, frontend, and initial Netlify Functions.
- **Ethers.js**: Enables frontend and Netlify Function interactions with Ethereum.
- **Alchemy**: Sepolia testnet connectivity.
- **ReSend API**: Email notifications for job events.
- **DropBox API**: File storage for submissions and metadata.
- **Pinata API**: IPFS pinning for decentralized storage.
- **ChatGPT API**: Natural language processing for submission analysis.
- **Netlify**: Hosts frontend and serverless functions.
- **Hardhat**: Contract deployment and testing.
- **IPFS**: Stores job metadata and submission links.

---

## ✍ How It Works
1. **Job Creation**: Client deploys a `JobEscrow` contract via `JobEscrowFactory`, paying a 0.001 ETH fee (sent to `contractFeeCollector`). ReSend API notifies client/freelancer.
2. **Funding**: Client funds the job via `fundEscrow`, locking ETH. ReSend confirms funding.
3. **Freelancer Assignment**: Client assigns a freelancer, who accepts, receiving an NFT (`freelancerTokenId=1`).
4. **Submission**: Freelancer uploads work to DropBox, pins metadata/submission link to IPFS via Pinata, and submits via `submitForFinal`.
5. **Verification**:
   - AI verifier (augmented by ChatGPT API) approves via `verifyByAI`, releasing funds; ReSend notifies parties.
   - If rejected, freelancer requests client verification (`requestClientVerification`).
   - Client overrides via `verifyByClient`, releasing funds or refunding via `refundToClient`.
6. **Metadata**: Job details (description, submission links) are stored on IPFS via Pinata, referenced in `metadataURI`.

---

## 🛠 Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   npm install

2. **Deploy Contracts**
Deploy JobEscrowFactory to Sepolia using Hardhat:

bash
npx hardhat deploy --network sepolia
Update CONTRACT_ADDRESS in Netlify environment variables

3. **Configure Netlify**
Set environment variables in Netlify UI or CLI:
bash

netlify env:set ALCHEMY_API_KEY your-alchemy-key
netlify env:set CONTRACT_ADDRESS 0xYourFactoryAddress
netlify env:set RESEND_API_KEY your-resend-key
netlify env:set DROPBOX_API_KEY your-dropbox-key
netlify env:set PINATA_API_KEY your-pinata-key
netlify env:set CHATGPT_API_KEY your-chatgpt-key


4. **Ensure netlify.toml includes**
toml

[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"


5. **Deploy via GitHub or netlify deploy --prod**
bash

Run Locally

netlify dev
Access at http://localhost:8888


6. **Demo Workflow**

Connect MetaMask to Sepolia testnet (use a faucet for ETH).

Create a job via JobEscrowFactory (pay 0.001 ETH fee; receive ReSend email).

Fund the job through fundEscrow (ReSend confirms).

Assign a freelancer using assignFreelancer.

Freelancer accepts, uploads work to DropBox, pins to IPFS via Pinata, and submits.

AI (with ChatGPT analysis) verifies via verifyByAI or client overrides via verifyByClient; ReSend notifies.

Funds are released or refunded; view details via getJobInfo in the UI.


Project Goals
SecureWorkEscrow demonstrates how Bolt’s AI-generated contracts can be responsibly enhanced for production use while staying compliant with the hackathon’s ecosystem. By leveraging Bolt for 90% of the codebase and adding security, live Ethereum, and API integrations (ReSend, DropBox, Pinata, ChatGPT), the project delivers a secure, user-friendly freelance escrow system that addresses real-world needs:
Robust security against reentrancy and double funding.

Support for smart contract clients/freelancers.

Seamless notifications, storage, and AI analysis via external APIs.

A polished, deployable UI for end-to-end job management.






 **Acknowledgments**
Bolt.new: Generated the core smart contracts (JobEscrow.sol, JobEscrowFactory.sol), frontend, and initial Netlify Functions, enabling rapid development.

Me, Kelly Coldren: Enhanced the project with some edits to the code for security fixes, live API integrations (ReSend, DropBox, Pinata, ChatGPT), and production deployment for the 2025 Bolt Hackathon.

OpenZeppelin: Provided secure libraries (ReentrancyGuard, ERC721URIStorage).

Alchemy, ReSend, DropBox, Pinata, ChatGPT: Enabled robust API integrations.

