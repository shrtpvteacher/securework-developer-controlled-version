// pinMetadataToIPFS.js
const axios = require('axios');

exports.handler = async function (event) {
  const pinataJWT = process.env.PINATA_JWT;

  try {
    const body = JSON.parse(event.body);
    const { title, description, requirements, deliverables, creatorAddress, freelancerAddress, amount } = body;

    if (!title || !description || !Array.isArray(requirements, deliverables) || !creatorAddress || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required metadata fields." })
      };
    }

    const metadata = {
      title,
      description,
      requirements,
      deliverables,
      creatorAddress,
      freelancerAddress: freelancerAddress || '',
      amount,
      createdAt: new Date().toISOString()
    };

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: `securework-job-${title}`
        },
        pinataContent: metadata
      },
      {
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
          "Content-Type": "application/json"
        }
      }
    );

    const ipfsHash = response.data.IpfsHash;

    return {
      statusCode: 200,
      body: JSON.stringify({
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        ipfsHash,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to upload metadata to IPFS." })
    };
  }
};