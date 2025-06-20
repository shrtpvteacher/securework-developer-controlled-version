// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract JobEscrow is ERC721URIStorage {
    enum JobStatus { Created, Funded, Accepted, ClientVerificationRequested, Completed, Cancelled, EscrowFundsReturned }

    uint256 public jobId;
    address public client;
    address public freelancer;
    address public aiVerifier;

    uint256 public amount;
    JobStatus public status;

    string public metadataURI;
    string public dropboxFinalSubmission;
    string public verifiedBy;

    uint256 public createdAt;
    uint256 public completedAt;

    address public fundsReleasedTo;

    bool public clientVerificationRequested;

    uint256 public clientTokenId;
    uint256 public freelancerTokenId;

    event JobFunded(address indexed client, uint256 amount);
    event FreelancerAssigned(address indexed freelancer);
    event JobAccepted(address indexed freelancer, uint256 timestamp);
    event JobCompleted(uint256 timestamp, string verifiedBy, string dropboxLink);
    event FundsReleased(address indexed to, uint256 amount);
    event ClientVerificationRequested(address indexed freelancer, string dropboxFileRef);
    event JobCancelled(address indexed client, uint256 timestamp);
    event EscrowFundsReturned(address indexed client, uint256 amount);

    constructor(
        uint256 _jobId,
        address _client,
        address _aiVerifier,
        uint256 _amount,
        string memory _metadataURI
    ) ERC721("SecureWorkEscrow", "SWE") {
        jobId = _jobId;
        client = _client;
        aiVerifier = _aiVerifier;
        amount = _amount;
        metadataURI = _metadataURI;
        createdAt = block.timestamp;
        status = JobStatus.Created;
    }

    modifier onlyClient() {
        require(msg.sender == client, "Only client");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer");
        _;
    }

    function assignFreelancer(address _freelancer) external onlyClient {
        require(freelancer == address(0), "Freelancer already assigned");
        require(_freelancer != address(0), "Invalid address");
        freelancer = _freelancer;
        emit FreelancerAssigned(_freelancer);
    }

 

    function fundEscrow() external payable onlyClient {
        require(status == JobStatus.Created, "Already funded");
        require(msg.value == amount, "Must match agreed amount");

        
        status = JobStatus.Funded;

        clientTokenId = 0;
        _mint(client, clientTokenId);
        _setTokenURI(clientTokenId, metadataURI);

        emit JobFunded(msg.sender, msg.value);
    }

   function acceptJob() external onlyFreelancer {
        require(status == JobStatus.Funded, "Must be funded");
        require(freelancerTokenId == 1, "NFT already minted");

        status = JobStatus.Accepted;
        freelancerTokenId = 1;
        _mint(freelancer, freelancerTokenId);
        _setTokenURI(freelancerTokenId, metadataURI);

        emit JobAccepted(msg.sender, block.timestamp);
    } 

    function requestClientVerification(string memory dropboxLink) external onlyFreelancer {
        require(status == JobStatus.Accepted, "Job not accepted");
        clientVerificationRequested = true;
        dropboxFinalSubmission = dropboxLink;
        emit ClientVerificationRequested(msg.sender, dropboxLink);
    }

    function verifyByClient() external onlyClient {
        require(clientVerificationRequested, "Not requested");
        _finalizeJob("Client");
    }

    function verifyByAI(string memory dropboxLink) external {
        require(msg.sender == aiVerifier, "Only AI verifier");
        require(status == JobStatus.Accepted, "Not accepted");
        dropboxFinalSubmission = dropboxLink;
        _finalizeJob("AI");
    }

    function _finalizeJob(string memory verifier) internal {
        require(fundsReleasedTo == address(0), "Already paid out");

        status = JobStatus.Completed;
        completedAt = block.timestamp;
        verifiedBy = verifier;
        fundsReleasedTo = freelancer;

        payable(freelancer).transfer(amount);
        emit JobCompleted(block.timestamp, verifier, dropboxFinalSubmission);
        emit FundsReleased(freelancer, amount);
    }

    function cancelJob() external onlyClient {
        require(status == JobStatus.Created|| status != JobStatus.Accepted, "Cannot cancel either not created or already accepted, please negotiate with freelancer");
        status = JobStatus.Cancelled;
        emit JobCancelled(msg.sender, block.timestamp);
    }

    function refundToClient() external onlyClient {
        require(status == JobStatus.Funded || status == JobStatus.Accepted, "Not refundable");
        require(fundsReleasedTo == address(0), "Already paid out");

        status = JobStatus.EscrowFundsReturned;
        fundsReleasedTo = client;

        uint256 refundAmount = address(this).balance;
        payable(client).transfer(refundAmount);

        emit EscrowFundsReturned(client, refundAmount);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getJobInfo() external view returns (
        uint256 _jobId,
        address _client,
        address _freelancer,
        address _aiVerifier,
        uint256 _amount,
        JobStatus _status,
        string memory _metadataURI,
        string memory _dropboxFinalSubmission,
        string memory _verifiedBy,
        uint256 _createdAt,
        uint256 _completedAt,
        address _fundsReleasedTo,
        bool _clientVerificationRequested
    ) {
        return (
            jobId,
            client,
            freelancer,
            aiVerifier,
            amount,
            status,
            metadataURI,
            dropboxFinalSubmission,
            verifiedBy,
            createdAt,
            completedAt,
            fundsReleasedTo,
            clientVerificationRequested
        );
    }

    // ⛔ Reject accidental or unauthorized ETH transfers
    receive() external payable {
        revert("Direct payments not allowed");
    }

    fallback() external payable {
        revert("Invalid call");
    }
}
