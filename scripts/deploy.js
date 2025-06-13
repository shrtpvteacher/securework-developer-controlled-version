const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying JobEscrow contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // For demo purposes, use deployer as AI verifier
  // In production, this would be a dedicated AI service wallet
  const aiVerifierAddress = deployer.address;

  // Deploy JobEscrowFactory
  const JobEscrowFactory = await ethers.getContractFactory("JobEscrowFactory");
  const factory = await JobEscrowFactory.deploy(aiVerifierAddress);
  await factory.waitForDeployment();

  const factoryAddress = await factory.getAddress();
  console.log("JobEscrowFactory deployed to:", factoryAddress);
  console.log("AI Verifier address:", aiVerifierAddress);
  console.log("Contract creation fee:", ethers.formatEther(await factory.getContractCreationFee()), "ETH");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    factoryAddress: factoryAddress,
    aiVerifierAddress: aiVerifierAddress,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // Save to file for frontend integration
  const fs = require('fs');
  fs.writeFileSync(
    './src/contracts/deployments.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\nDeployment info saved to src/contracts/deployments.json");
  console.log("Update your .env file with:");
  console.log(`VITE_FACTORY_CONTRACT_ADDRESS=${factoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });