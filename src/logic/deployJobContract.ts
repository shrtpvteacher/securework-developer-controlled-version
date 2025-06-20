import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../abis/JobEscrowFactory.json';
import { JOB_ESCROW_FACTORY_ADDRESS } from '../config/contract.config';

export async function deployJobContract(metadataURI: string, ethAmount: string): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask.");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factory = new ethers.Contract(JOB_ESCROW_FACTORY_ADDRESS, JobEscrowFactoryABI, signer);

  const value = ethers.utils.parseEther(ethAmount);

  const tx = await factory.createJob(metadataURI, {
    value,
    gasLimit: 4500000
  });

  const receipt = await tx.wait();

  const event = receipt.events?.find((e) => e.event === "JobCreated");
  const jobAddress = event?.args?.jobAddress;

  if (!jobAddress) {
    throw new Error("JobCreated event not found in transaction receipt.");
  }

  return jobAddress;
}
