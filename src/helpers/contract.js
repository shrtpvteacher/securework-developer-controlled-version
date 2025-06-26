// helpers/contract.js

import { ethers } from 'ethers';
import JOB_FACTORY_ABI from '../abis/JobFactory.json';
import JOB_ESCROW_ABI from '../abis/JobEscrow.json';

// ─────────────────────────────────────────────
// Load dynamic network config (networkId → factory address)
// ─────────────────────────────────────────────
async function getNetworkConfig() {
  const config = await import('../config/networkConfig');
  return config.default;
}

// ─────────────────────────────────────────────
// Provider and signer
// ─────────────────────────────────────────────
async function getProviderAndSigner() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return { provider, signer };
}

// ─────────────────────────────────────────────
// Resolve factory address from network config
// ─────────────────────────────────────────────
async function getFactoryAddress() {
  const { provider } = await getProviderAndSigner();
  const { chainId } = await provider.getNetwork();
  const config = await getNetworkConfig();

  if (!config[chainId]) {
    throw new Error(`Unsupported network ID: ${chainId}`);
  }

  return config[chainId].factoryAddress;
}

// ─────────────────────────────────────────────
// Contracts
// ─────────────────────────────────────────────
export async function getFactoryContract() {
  const address = await getFactoryAddress();
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(address, JOB_FACTORY_ABI, signer);
}

export async function getJobContract(jobAddress) {
  const { signer } = await getProviderAndSigner();
  return new ethers.Contract(jobAddress, JOB_ESCROW_ABI, signer);
}

// ─────────────────────────────────────────────
// Factory helpers
// ─────────────────────────────────────────────
export async function createJob(metadataURI, payEther, freelancer) {
  const factory = await getFactoryContract();
  const value = ethers.utils.parseEther(payEther);
  const tx = await factory.createJob(metadataURI, freelancer, { value });
  const receipt = await tx.wait();

  const event = receipt.events.find(e => e.event === 'JobCreated');
  return event?.args?.jobAddr ?? null;
}

export async function getMyJobs() {
  const factory = await getFactoryContract();
  const { signer } = await getProviderAndSigner();
  const address = await signer.getAddress();
  return factory.jobsByUser(address);
}

// ─────────────────────────────────────────────
// Job escrow helpers
// ─────────────────────────────────────────────
export async function fundEscrow(jobAddress, amountEther) {
  const job = await getJobContract(jobAddress);
  const tx = await job.fundEscrow({ value: ethers.utils.parseEther(amountEther) });
  return tx.wait();
}

export async function acceptJob(jobAddress) {
  const job = await getJobContract(jobAddress);
  const tx = await job.acceptJob();
  return tx.wait();
}

export async function submitForReview(jobAddress, dropboxFileId) {
  const job = await getJobContract(jobAddress);
  const tx = await job.submitForReview(dropboxFileId);
  return tx.wait();
}

export async function verifyByAI(jobAddress, dropboxFileId) {
  const job = await getJobContract(jobAddress);
  const tx = await job.verifyByAI(dropboxFileId);
  return tx.wait();
}

export async function requestClientVerification(jobAddress) {
  const job = await getJobContract(jobAddress);
  const tx = await job.requestClientVerification();
  return tx.wait();
}

export async function getJobStatus(jobAddress) {
  const job = await getJobContract(jobAddress);
  const status = await job.status();
  return status.toNumber(); // status is likely a BigNumber enum
}

export async function getEscrowBalance(jobAddress) {
  const { provider } = await getProviderAndSigner();
  const balance = await provider.getBalance(jobAddress);
  return ethers.utils.formatEther(balance);
}

export async function withdraw(jobAddress) {
  const job = await getJobContract(jobAddress);
  const tx = await job.withdraw();
  return tx.wait();
}

// ─────────────────────────────────────────────
// Debug in browser devtools (optional)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  window.ws = {
    getFactoryContract,
    getJobContract,
    createJob,
    fundEscrow,
    acceptJob,
    submitForReview,
    verifyByAI,
    getJobStatus,
    withdraw,
  };
}
