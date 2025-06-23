import { ethers } from 'ethers';
import JobEscrowABI from '../../netlify/functions/abis/JobEscrowABI.json';

export async function fundEscrow(contractAddress: string, ethAmount: string) {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, JobEscrowABI, signer);

  const tx = await contract.fundEscrow({ value: ethers.utils.parseEther(ethAmount) });
  await tx.wait();
}
