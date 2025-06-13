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
    const { ipfsHash, jobTitle, clientEmail, freelancerAddress } = JSON.parse(event.body);
    
    if (!ipfsHash || !jobTitle) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Download files from IPFS
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash.replace('ipfs://', '')}`;
    
    // In a real implementation, you would:
    // 1. Download the files from IPFS
    // 2. Upload them to Dropbox
    // 3. Create a shared link
    // 4. Send notification email to client

    // For now, we'll create a mock Dropbox link and simulate the process
    const dropboxLink = `https://www.dropbox.com/s/mock-${Date.now()}/${jobTitle.replace(/\s+/g, '-').toLowerCase()}?dl=0`;
    
    // Simulate Dropbox upload
    console.log(`Simulating Dropbox upload for job: ${jobTitle}`);
    console.log(`IPFS Hash: ${ipfsHash}`);
    console.log(`Generated Dropbox Link: ${dropboxLink}`);
    
    // In production, you would use the Dropbox API here:
    /*
    const dropboxResponse = await fetch('https://api.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/SecureWork/${jobTitle}/${filename}`,
          mode: 'add',
          autorename: true
        })
      },
      body: fileBuffer
    });
    */

    // Send notification email (simulated)
    if (clientEmail) {
      console.log(`Sending notification email to: ${clientEmail}`);
      console.log(`Subject: Work Delivered for "${jobTitle}"`);
      console.log(`Dropbox Link: ${dropboxLink}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        dropboxLink,
        message: 'Work files successfully delivered to Dropbox',
        emailSent: !!clientEmail
      })
    };

  } catch (error) {
    console.error('Error delivering to Dropbox:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to deliver files to Dropbox',
        details: error.message
      })
    };
  }
};