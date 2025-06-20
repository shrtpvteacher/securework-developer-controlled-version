require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { SEPOLIA_DEPLOYER_PRIVATE_KEY, SEPOLIA_AI_VERIFIER_PRIVATE_KEY  } = process.env;


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 20,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      
        
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [
        SEPOLIA_DEPLOYER_PRIVATE_KEY,
        SEPOLIA_AI_VERIFIER_PRIVATE_KEY
      ].filter(Boolean),
      chainId: 11155111,
    } 
  }
};
