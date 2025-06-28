// netlify/functions/upload-to-ipfs.js

/*exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { metadata } = JSON.parse(event.body);
    
    if (!metadata) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Metadata is required' })
      };
    }

    // Upload to Pinata IPFS
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PINATA_JWT}`
      },
      body: JSON.stringify({
        pinataContent: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          version: '1.0'
        },
        pinataMetadata: {
          name: `job-metadata-${metadata.jobId || Date.now()}`,
          keyvalues: {
            jobId: metadata.jobId || '',
            client: metadata.clientAddress,
            freelancer: metadata.freelancerAddress,
            type: 'job-metadata'
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        ipfsHash: result.IpfsHash,
        metadataURI: `ipfs://${result.IpfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      })
    };

  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to upload to IPFS',
        details: error.message
      })
    };
  }
};
*/

import axios from 'axios';

const pinataJWT = process.env.PINATA_JWT;

export async function handler(event) {
  try {
    if (!pinataJWT) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing Pinata JWT." }),
      };
    }

    const {
      title,
      description,
      tasks,
      creatorAddress,
      freelancerAddress,
      amount,
    } = JSON.parse(event.body);

    // Validate required fields
    if (!title || !description || !Array.isArray(tasks) || !creatorAddress || !amount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required metadata fields." }),
      };
    }

    // Build metadata without image
    const metadata = {
      title,
      description,
      requirements,
      deliverables,
      creatorAddress,
      freelancerAddress: freelancerAddress || "", // default to empty string if missing
      jobPay,
      createdAt: new Date().toISOString(),
    };

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        pinataMetadata: {
          name: `freelance-job-${title}`,
        },
        pinataContent: metadata,
      },
      {
        headers: {
          Authorization: `Bearer ${pinataJWT}`,
          "Content-Type": "application/json",
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;

    return {
      statusCode: 200,
      body: JSON.stringify({
        ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        ipfsHash,
      }),
    };
  } catch (error) {
    console.error("IPFS upload failed:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to upload metadata to IPFS via Pinata." }),
    };
  }
}
