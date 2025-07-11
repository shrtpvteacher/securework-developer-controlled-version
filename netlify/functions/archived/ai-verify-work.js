/* exports.handler = async (event, context) => {
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
    const { jobMetadata, workDescription, dropboxLink, contractAddress } = JSON.parse(event.body);
    
    if (!jobMetadata || !workDescription || !contractAddress) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Call OpenAI API for work verification
    const prompt = `
You are an expert code reviewer and project evaluator. Please review the submitted work against the original job requirements.

**Original Job Requirements:**
Title: ${jobMetadata.title}
Description: ${jobMetadata.description}
Requirements: ${jobMetadata.requirements.join(', ')}
Expected Deliverables: ${jobMetadata.deliverables.join(', ')}

**Submitted Work:**
Description: ${workDescription}
Dropbox Link: ${dropboxLink}

Please evaluate the work on the following criteria:
1. Requirements Met (0-100): Does the work fulfill all specified requirements?
2. Code Quality (0-100): Is the work well-structured and maintainable?
3. Documentation (0-100): Is the work properly documented?
4. Completeness (0-100): Are all deliverables provided?

Provide your response in the following JSON format:
{
  "passed": boolean,
  "score": number (0-100, overall score),
  "feedback": "Detailed feedback explaining the evaluation",
  "details": {
    "requirementsMet": boolean,
    "codeQuality": number (0-100),
    "documentation": number (0-100),
    "completeness": number (0-100)
  }
}

Be thorough but fair in your evaluation. The work should pass if it meets the basic requirements and is of acceptable quality.
`;

    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical reviewer. Provide objective, constructive feedback on submitted work.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!aiResponse.ok) {
      throw new Error(`OpenAI API error: ${aiResponse.statusText}`);
    }

    const aiData = await aiResponse.json();
    const reviewResult = JSON.parse(aiData.choices[0].message.content);

    // If AI approves the work, call the smart contract to verify and release funds
    if (reviewResult.passed) {
      const { ethers } = require('ethers');
      
      // Connect to blockchain
      const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
      const aiVerifier = new ethers.Wallet(process.env.AI_VERIFIER_PRIVATE_KEY, provider);
      
      // Job Escrow ABI (simplified)
      const jobEscrowABI = [
        "function verifyByAI(string memory dropboxLink) external"
      ];
      
      const jobContract = new ethers.Contract(contractAddress, jobEscrowABI, aiVerifier);
      
      try {
        const tx = await jobContract.verifyByAI(dropboxLink);
        await tx.wait();
        
        console.log(`AI verified work and released funds for contract ${contractAddress}`);
      } catch (contractError) {
        console.error('Error calling smart contract:', contractError);
        // Continue with response even if contract call fails
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        reviewResult,
        contractCalled: reviewResult.passed
      })
    };

  } catch (error) {
    console.error('Error in AI verification:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to verify work',
        details: error.message
      })
    };
  }
};

*/

/*
const Busboy = require('busboy');
const AdmZip = require('adm-zip');
const { Readable } = require('stream');
// Adjust this import based on your project structure
const { reviewWorkSubmission } = require('../../src/utils/reviewWorkSubmission');

exports.handler = async (event, context) => {
  // Handle only POST
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

  return new Promise((resolve) => {
    const busboy = new Busboy({ headers: event.headers });
    let jobMetadata, workDescription = '';
    const fileContents = [];
    let zipFound = false;

    busboy.on('field', (name, value) => {
      if (name === 'jobMetadata') jobMetadata = JSON.parse(value);
      if (name === 'workDescription') workDescription = value;
    });

    busboy.on('file', (fieldname, file, filename) => {
      let buffers = [];
      file.on('data', (data) => buffers.push(data));
      file.on('end', () => {
        if (!filename.toLowerCase().endsWith('.zip')) {
          return resolve({
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Only .zip files are accepted.' })
          });
        }
        zipFound = true;
        const fileBuffer = Buffer.concat(buffers);
        const zip = new AdmZip(fileBuffer);
        zip.getEntries().forEach(entry => {
          if (
            entry.entryName.match(/\.(js|ts|sol|py|md|txt|json|html|css)$/i) &&
            !entry.isDirectory
          ) {
            fileContents.push(
              `// File: ${entry.entryName}\n${entry.getData().toString('utf8')}`
            );
          }
        });
      });
    });

    busboy.on('finish', async () => {
      try {
        if (!jobMetadata) throw new Error('Missing job metadata');
        if (!zipFound) throw new Error('No zip file found in submission');

        const result = await reviewWorkSubmission(
          jobMetadata,
          workDescription,
          fileContents
        );
        resolve({
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
          body: JSON.stringify(result),
        });
      } catch (err) {
        resolve({
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: err.message }),
        });
      }
    });

    // Support both base64 (binary) and utf8 bodies from Netlify
    const stream = Readable.from(
      Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
    );
    stream.pipe(busboy);
  });
};
*/