/*import { ethers } from 'ethers';
import factoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS;

export async function fetchContractCreationFee(): Promise<string> {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(FACTORY_ADDRESS, factoryABI, await provider.getSigner());

  const fee: bigint = await contract.contractCreationFee();
  return ethers.utils.formatEther(fee);
} */

// logic/fetchContractCreationFee.js

import { ethers } from 'ethers';
import factoryABI from '../../netlify/functions/abis/JobEscrowFactoryABI.json';

const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS;

export async function fetchContractCreationFee() {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(FACTORY_ADDRESS, factoryABI, signer);

  const fee = await contract.contractCreationFee();
  return ethers.utils.formatEther(fee);
}