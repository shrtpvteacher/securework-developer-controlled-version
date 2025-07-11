// logic/deployJobContract.js
import { ethers } from 'ethers';
import JobEscrowFactoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS;

/**
 * Deploy a new JobEscrow and return both its address and numeric jobId.
 * @param {string} metadataURI  IPFS URI you just uploaded
 * @param {string} jobPay       Amount in ETH the client will pay (value sent with tx)
 * @returns {{ jobAddress: string; jobId: string }}
 */
export async function deployJobContract(metadataURI, jobPay) {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask (or another provider) not found');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();
  const factory  = new ethers.Contract(FACTORY_ADDRESS, JobEscrowFactoryABI, signer);

  // createJobEscrow(string) is payable — send jobPay as msg.value
  const tx = await factory.createJobEscrow(metadataURI, {
    value: ethers.utils.parseEther(jobPay),
  });
  const receipt = await tx.wait();

  // Find the JobCreated event in the receipt
  const evt = receipt.events?.find((e) => e.event === 'JobCreated');
  if (!evt || !evt.args) {
    throw new Error('JobCreated event not found');
  }

  const jobId      = evt.args[0].toString(); // BigNumber → string
  const jobAddress = evt.args[1];            // address

  return { jobAddress, jobId };
}