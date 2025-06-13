// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./JobEscrow.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JobEscrowFactory is Ownable {
    uint256 public jobCounter;
    uint256 public contractCreationFee = 0.001 ether;

    address public contractFeeCollector;
    address public aiVerifier;

    mapping(uint256 => address) public jobContracts;
    mapping(address => uint256[]) public clientJobs;
    mapping(address => uint256[]) public freelancerJobs;

    event JobCreated(uint256 indexed jobId, address indexed jobContract, address indexed client, string metadataURI);
    event PlatformFeeUpdated(uint256 newFee);
    event PlatformFeeCollectorUpdated(address newCollector);
    event AiVerifierUpdated(address newVerifier);

    constructor(address _aiVerifier, address _feeCollector) Ownable(msg.sender) {
        require(_feeCollector != address(0), "Invalid fee collector");
        aiVerifier = _aiVerifier;
        contractFeeCollector = _feeCollector;
    }

    function createJobEscrow(
        string memory _metadataURI
    ) external payable returns (uint256 jobId, address jobContract) {
        require(msg.value == contractCreationFee, "Must pay exact creation fee");

        jobId = jobCounter++;

        JobEscrow newJob = new JobEscrow(
            jobId,
            msg.sender,
            aiVerifier,
            0, // Escrow amount will be set later via fundEscrow
            _metadataURI
        );

        jobContract = address(newJob);
        jobContracts[jobId] = jobContract;
        clientJobs[msg.sender].push(jobId);

        emit JobCreated(jobId, jobContract, msg.sender, _metadataURI);

        // Immediately forward fee to fee collector
        (bool sent, ) = payable(contractFeeCollector).call{value: msg.value}("");
        require(sent, "Failed to transfer creation fee");
    }

    function linkFreelancer(uint256 jobId, address freelancer) external {
        require(msg.sender == JobEscrow(payable(jobContracts[jobId])).client(), "Only client can assign freelancer");
        freelancerJobs[freelancer].push(jobId);
    }

    function getClientJobs(address _client) external view returns (uint256[] memory) {
        return clientJobs[_client];
    }

    function getFreelancerJobs(address _freelancer) external view returns (uint256[] memory) {
        return freelancerJobs[_freelancer];
    }

    function updateContractCreationFee(uint256 _newFee) external onlyOwner {
        contractCreationFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    function updateAiVerifier(address _newAiVerifier) external onlyOwner {
        aiVerifier = _newAiVerifier;
        emit AiVerifierUpdated(_newAiVerifier);
    }

    function updateContractFeeCollector(address _newCollector) external onlyOwner {
        contractFeeCollector = _newCollector;
        emit PlatformFeeCollectorUpdated(_newCollector);
    }

    function getContractCreationFee() external view returns (uint256) {
        return contractCreationFee;
    }
}
