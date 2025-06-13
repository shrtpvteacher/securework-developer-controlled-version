import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import deployments from '../contracts/deployments.json';

// Updated Contract ABIs to match your new structure
const FACTORY_ABI = [
  "function createJobEscrow(uint256 _jobId, address _client, address _aiVerifier, uint256 _amount, string memory _metadataURI) external payable returns (address)",
  "function getJobInfo(uint256 _jobId) external view returns (tuple(address jobContract, address client, address freelancer, uint256 amount, string metadataURI, bool isActive, uint256 createdAt))",
  "function getClientJobs(address _client) external view returns (uint256[] memory)",
  "function getFreelancerJobs(address _freelancer) external view returns (uint256[] memory)",
  "function getAllActiveJobs() external view returns (uint256[] memory)",
  "function getContractCreationFee() external view returns (uint256)",
  "function completeJob(uint256 _jobId) external",
  "function owner() external view returns (address)",
  "event JobCreated(uint256 indexed jobId, address indexed jobContract, address indexed client, address freelancer, uint256 amount, string metadataURI)"
];

const JOB_ESCROW_ABI = [
  "function fundEscrow(address freelancerAddr) external payable",
  "function acceptJob() external",
  "function requestClientVerification(string memory dropboxLink) external",
  "function verifyByClient() external",
  "function verifyByAI(string memory dropboxLink) external",
  "function cancelJob() external",
  "function getJobDetails() external view returns (tuple(address client, address freelancer, uint256 amount, uint8 status, string metadataURI, string dropboxFinalSubmission, uint256 createdAt, uint256 completedAt, bool fundsReleased, bool clientVerificationRequested, string verifiedBy))",
  "function getContractBalance() external view returns (uint256)",
  "function clientTokenId() external view returns (uint256)",
  "function freelancerTokenId() external view returns (uint256)",
  "event JobAccepted(address indexed freelancer, uint256 timestamp)",
  "event JobCompleted(uint256 timestamp, string verifiedBy, string dropboxLink)",
  "event FundsReleased(address indexed to, uint256 amount)",
  "event ClientVerificationRequested(address indexed freelancer, string dropboxFileRef)",
  "event JobCancelled(address indexed client, uint256 timestamp)"
];

export const useContract = () => {
  const { provider, signer } = useWallet();
  const [factoryContract, setFactoryContract] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provider && deployments.factoryAddress) {
      const contract = new ethers.Contract(
        deployments.factoryAddress,
        FACTORY_ABI,
        provider
      );
      setFactoryContract(contract);
    }
  }, [provider]);

  const createJobContract = async (
    jobId: string,
    clientAddress: string,
    aiVerifierAddress: string,
    jobAmount: string,
    metadataURI: string
  ) => {
    if (!factoryContract || !signer) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    try {
      const contractWithSigner = factoryContract.connect(signer);
      const creationFee = await contractWithSigner.getContractCreationFee();
      const amount = ethers.parseEther(jobAmount);
      
      const tx = await contractWithSigner.createJobEscrow(
        jobId,
        clientAddress,
        aiVerifierAddress,
        amount,
        metadataURI,
        { value: creationFee }
      );
      
      const receipt = await tx.wait();
      
      // Parse the JobCreated event
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contractWithSigner.interface.parseLog(log);
          return parsed?.name === 'JobCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = contractWithSigner.interface.parseLog(event);
        return {
          jobId: parsed.args.jobId.toString(),
          jobContract: parsed.args.jobContract,
          transactionHash: receipt.hash
        };
      }
      
      throw new Error('JobCreated event not found');
    } finally {
      setIsLoading(false);
    }
  };

  const fundEscrow = async (jobContractAddress: string, freelancerAddress: string, amount: string) => {
    if (!signer) throw new Error('Signer not available');
    
    setIsLoading(true);
    try {
      const jobContract = getJobContract(jobContractAddress).connect(signer);
      const tx = await jobContract.fundEscrow(freelancerAddress, {
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      return tx.hash;
    } finally {
      setIsLoading(false);
    }
  };

  const getJobContract = (jobContractAddress: string) => {
    if (!provider) throw new Error('Provider not initialized');
    
    return new ethers.Contract(
      jobContractAddress,
      JOB_ESCROW_ABI,
      provider
    );
  };

  const getJobInfo = async (jobId: string) => {
    if (!factoryContract) throw new Error('Factory contract not initialized');
    
    try {
      const jobInfo = await factoryContract.getJobInfo(jobId);
      return {
        jobContract: jobInfo.jobContract,
        client: jobInfo.client,
        freelancer: jobInfo.freelancer,
        amount: ethers.formatEther(jobInfo.amount),
        metadataURI: jobInfo.metadataURI,
        isActive: jobInfo.isActive,
        createdAt: new Date(Number(jobInfo.createdAt) * 1000)
      };
    } catch (error) {
      console.error('Error getting job info:', error);
      throw error;
    }
  };

  const getJobDetails = async (jobContractAddress: string) => {
    if (!provider) throw new Error('Provider not initialized');
    
    try {
      const jobContract = getJobContract(jobContractAddress);
      const details = await jobContract.getJobDetails();
      
      return {
        client: details.client,
        freelancer: details.freelancer,
        amount: ethers.formatEther(details.amount),
        status: details.status,
        metadataURI: details.metadataURI,
        dropboxFinalSubmission: details.dropboxFinalSubmission,
        createdAt: new Date(Number(details.createdAt) * 1000),
        completedAt: details.completedAt > 0 ? new Date(Number(details.completedAt) * 1000) : null,
        fundsReleased: details.fundsReleased,
        clientVerificationRequested: details.clientVerificationRequested,
        verifiedBy: details.verifiedBy
      };
    } catch (error) {
      console.error('Error getting job details:', error);
      throw error;
    }
  };

  const acceptJob = async (jobContractAddress: string) => {
    if (!signer) throw new Error('Signer not available');
    
    setIsLoading(true);
    try {
      const jobContract = getJobContract(jobContractAddress).connect(signer);
      const tx = await jobContract.acceptJob();
      await tx.wait();
      return tx.hash;
    } finally {
      setIsLoading(false);
    }
  };

  const requestClientVerification = async (jobContractAddress: string, dropboxLink: string) => {
    if (!signer) throw new Error('Signer not available');
    
    setIsLoading(true);
    try {
      const jobContract = getJobContract(jobContractAddress).connect(signer);
      const tx = await jobContract.requestClientVerification(dropboxLink);
      await tx.wait();
      return tx.hash;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyByClient = async (jobContractAddress: string) => {
    if (!signer) throw new Error('Signer not available');
    
    setIsLoading(true);
    try {
      const jobContract = getJobContract(jobContractAddress).connect(signer);
      const tx = await jobContract.verifyByClient();
      await tx.wait();
      return tx.hash;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyByAI = async (jobContractAddress: string, dropboxLink: string) => {
    if (!signer) throw new Error('Signer not available');
    
    setIsLoading(true);
    try {
      const jobContract = getJobContract(jobContractAddress).connect(signer);
      const tx = await jobContract.verifyByAI(dropboxLink);
      await tx.wait();
      return tx.hash;
    } finally {
      setIsLoading(false);
    }
  };

  const getContractCreationFee = async () => {
    if (!factoryContract) throw new Error('Factory contract not initialized');
    
    try {
      const fee = await factoryContract.getContractCreationFee();
      return ethers.formatEther(fee);
    } catch (error) {
      console.error('Error getting creation fee:', error);
      throw error;
    }
  };

  const getTokenIds = async (jobContractAddress: string) => {
    if (!provider) throw new Error('Provider not initialized');
    
    try {
      const jobContract = getJobContract(jobContractAddress);
      const [clientTokenId, freelancerTokenId] = await Promise.all([
        jobContract.clientTokenId(),
        jobContract.freelancerTokenId()
      ]);
      
      return {
        clientTokenId: clientTokenId.toString(),
        freelancerTokenId: freelancerTokenId.toString()
      };
    } catch (error) {
      console.error('Error getting token IDs:', error);
      throw error;
    }
  };

  return {
    factoryContract,
    createJobContract,
    fundEscrow,
    getJobInfo,
    getJobDetails,
    acceptJob,
    requestClientVerification,
    verifyByClient,
    verifyByAI,
    getContractCreationFee,
    getJobContract,
    getTokenIds,
    isLoading
  };
};