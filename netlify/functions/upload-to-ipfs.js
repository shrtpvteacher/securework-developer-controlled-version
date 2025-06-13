exports.handler = async (event, context) => {
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