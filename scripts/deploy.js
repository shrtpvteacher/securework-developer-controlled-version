const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  console.log("Deploying JobEscrowFactory...");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

    const networkKey = hre.network.name.toUpperCase();

const aiVerifier = process.env[`${networkKey}_AI_VERIFIER_ADDRESS`];
  const feeCollector = process.env[`${networkKey}_FEE_COLLECTOR_ADDRESS`];

  if (!aiVerifier || !feeCollector) {
    throw new Error(
      `Missing required environment variables: ${networkKey}_AI_VERIFIER_ADDRESS or ${networkKey}_FEE_COLLECTOR_ADDRESS`
    );
  }


  const JobEscrowFactory = await ethers.getContractFactory("JobEscrowFactory");
  const factory = await JobEscrowFactory.deploy(aiVerifier, feeCollector);
  await factory.waitForDeployment();
  const creationFee = await factory.contractCreationFee();
 console.log("Contract creation fee (from contract):", ethers.formatEther(creationFee), "ETH");


  const factoryAddress = await factory.getAddress();

  console.log("JobEscrowFactory deployed to:", factoryAddress);
  console.log("AI Verifier address:", aiVerifier);
  console.log("Fee Collector address:", feeCollector);

  const deploymentInfo = {
    network: hre.network.name,
    factoryAddress: factoryAddress,
    feeCollectorAddress: feeCollector,
    aiVerifierAddress: aiVerifier,
    deployedAt: new Date().toISOString(),
    deployer: deployer.address
  };

  const outputPath = path.join(
  __dirname,
  `../src/deployments/jobEscrowFactoryDeployment.${hre.network.name}.json`
);

  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to ${outputPath}`);

  console.log("\nAdd the following to your .env frontend file if needed:");
  console.log(`VITE_FACTORY_CONTRACT_ADDRESS=${factoryAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Deployment failed:", err);
    process.exit(1);
  });
