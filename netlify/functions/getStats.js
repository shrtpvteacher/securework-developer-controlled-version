const { ethers } = require("ethers");
const factoryABI = require('./abis/JobEscrowFactoryABI.json');
const jobABI = require('./abis/JobEscrowABI.json');

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);

const factoryAddress = process.env.FACTORY_ADDRESS;





exports.handler = async () => {
  try {
    const factory = new ethers.Contract(factoryAddress, factoryABI, provider);
    const jobCount = await factory.jobCounter();
    let completed = 0;
    let totalValue = ethers.BigNumber.from(0);

    const uniqueUsers = new Set();

    for (let i = 0; i < jobCount; i++) {
      const jobAddress = await factory.jobContracts(i);
      const job = new ethers.Contract(jobAddress, jobABI, provider);

      const jobInfo = await job.getJobInfo();
      const status = jobInfo[5]; // JobStatus
      const amount = jobInfo[4]; // ETH
      const client = jobInfo[1];
      const freelancer = jobInfo[2];

      uniqueUsers.add(client.toLowerCase());
      if (freelancer !== ethers.constants.AddressZero) {
        uniqueUsers.add(freelancer.toLowerCase());
      }

      totalValue = totalValue.add(amount);

      if (status === 4) {
        completed++;
      }
    }

     const stats = [
      { label: "Jobs Completed", value: `${completed}` },
      { label: "Active Users", value: `${uniqueUsers.size}` },
      { label: "Total Value Secured", value: `$${(parseFloat(ethers.utils.formatEther(totalValue)) * 3400).toFixed(0)} USD` },
      { label: "Success Rate", value: jobCount > 0 ? `${((completed / jobCount) * 100).toFixed(1)}%` : "0.0%" }
    ];
    return {
      statusCode: 200,
      body: JSON.stringify(stats)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error fetching stats: ${err.message}`
    };
  }
};
