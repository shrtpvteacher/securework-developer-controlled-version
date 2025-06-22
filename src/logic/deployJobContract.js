// logic/deployJobContract.ts

/*import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS;

export async function deployJobContract(metadataURI, jobPay): {
  if ( window.ethereum === 'undefined') {
    throw new Error('MetaMask is not available');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factory = new ethers.Contract(FACTORY_ADDRESS, JobEscrowFactoryABI, signer);

  const tx = await factory.createJobEscrow(metadataURI, {
    value: ethers.utils.parseEther(jobPay),
  });

  const receipt = await tx.wait();

  const jobCreatedEvent = receipt.events?.find((e: ethers.Event) => e.event === 'JobCreated');
  if (!jobCreatedEvent || !jobCreatedEvent.args || !jobCreatedEvent.args[0]) {
    throw new Error('JobCreated event not found in transaction receipt');
  }

  const jobAddress: string = jobCreatedEvent.args[0];
  return jobAddress;
}
*/

// logic/deployJobContract.js

import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS;

export async function deployJobContract(metadataURI, jobPay) {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not available');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factory = new ethers.Contract(FACTORY_ADDRESS, JobEscrowFactoryABI, signer);

  const tx = await factory.createJobEscrow(metadataURI, {
    value: ethers.utils.parseEther(jobPay),
  });

  const receipt = await tx.wait();

  const jobCreatedEvent = receipt.events?.find((e) => e.event === 'JobCreated');
  if (!jobCreatedEvent || !jobCreatedEvent.args || !jobCreatedEvent.args[0]) {
    throw new Error('JobCreated event not found in transaction receipt');
  }

  const jobAddress = jobCreatedEvent.args[0];
  return jobAddress;
}