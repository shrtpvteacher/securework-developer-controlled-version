import { ethers } from 'ethers';
import JobEscrowABI from '../../netlify/functions/abis/JobEscrowABI.json'; // Update if ABI path is different

export interface JobMetadata {
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  // Add more fields if your metadata includes them
}

export interface AIReviewResult {
  passed: boolean;
  score: number;
  feedback: string;
  details: {
    requirementsMet: boolean;
    codeQuality: number;
    documentation: number;
    completeness: number;
  };
}

// Helper: fetch metadata from contract via IPFS
const fetchJobMetadata = async (contractAddress: string): Promise<JobMetadata> => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
  const contract = new ethers.Contract(contractAddress, JobEscrowABI, provider);

  // Assumes contract has jobMetadataURI() -> string (IPFS URI)
  const ipfsUri: string = await contract.jobMetadataURI();
  const httpUrl = ipfsUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

  const res = await fetch(httpUrl);
  if (!res.ok) throw new Error('Failed to fetch metadata from IPFS');
  return await res.json();
};

export const reviewWorkSubmission = async (
  contractAddress: string,
  workDescription: string,
  fileContents?: string[]
): Promise<AIReviewResult> => {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) throw new Error('OpenAI API key not configured');

  // Step 1: Fetch on-chain metadata
  const jobMetadata = await fetchJobMetadata(contractAddress);

  // Step 2: Prepare prompt for AI
  const prompt = `
You are an expert code reviewer and project evaluator. Please review the submitted work against the original job requirements.

**Original Job Requirements:**
Title: ${jobMetadata.title}
Description: ${jobMetadata.description}
Requirements: ${jobMetadata.requirements?.join(', ') ?? ''}
Expected Deliverables: ${jobMetadata.deliverables?.join(', ') ?? ''}

**Submitted Work:**
Description: ${workDescription}
${fileContents ? `File Contents: ${fileContents.join('\n---\n')}` : ''}

Please evaluate the work on the following criteria:
1. Requirements Met (0-100): Does the work fulfill all specified requirements?
2. Code Quality (0-100): Is the code well-written, clean, and maintainable?
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

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const result = JSON.parse(aiResponse);

      // Validate the response structure
      if (typeof result.passed !== 'boolean' || typeof result.score !== 'number') {
        throw new Error('Invalid AI response format');
      }

      return result;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);

      // Fallback response if parsing fails
      return {
        passed: false,
        score: 0,
        feedback: 'Error processing AI review. Please try again.',
        details: {
          requirementsMet: false,
          codeQuality: 0,
          documentation: 0,
          completeness: 0
        }
      };
    }
  } catch (error) {
    console.error('Error in AI review:', error);
    throw new Error('Failed to get AI review');
  }
};
