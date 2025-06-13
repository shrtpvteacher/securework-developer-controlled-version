import { JobMetadata } from './ipfs';

const NETLIFY_FUNCTIONS_BASE = '/.netlify/functions';

export interface IPFSUploadResult {
  success: boolean;
  ipfsHash?: string;
  metadataURI?: string;
  gatewayUrl?: string;
  error?: string;
}

export interface AIVerificationResult {
  success: boolean;
  reviewResult?: {
    passed: boolean;
    score: number;
    feedback: string;
    details: {
      requirementsMet: boolean;
      codeQuality: number;
      documentation: number;
      completeness: number;
    };
  };
  contractCalled?: boolean;
  error?: string;
}

export interface DropboxDeliveryResult {
  success: boolean;
  dropboxLink?: string;
  message?: string;
  emailSent?: boolean;
  error?: string;
}

export const uploadToIPFSViaNetlify = async (metadata: JobMetadata): Promise<IPFSUploadResult> => {
  try {
    const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/upload-to-ipfs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ metadata })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload to IPFS');
    }

    return result;
  } catch (error) {
    console.error('Error uploading to IPFS via Netlify:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const verifyWorkViaAI = async (
  jobMetadata: JobMetadata,
  workDescription: string,
  dropboxLink: string,
  contractAddress: string
): Promise<AIVerificationResult> => {
  try {
    const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/ai-verify-work`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobMetadata,
        workDescription,
        dropboxLink,
        contractAddress
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to verify work');
    }

    return result;
  } catch (error) {
    console.error('Error verifying work via AI:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const deliverToDropbox = async (
  ipfsHash: string,
  jobTitle: string,
  clientEmail?: string,
  freelancerAddress?: string
): Promise<DropboxDeliveryResult> => {
  try {
    const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/deliver-to-dropbox`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ipfsHash,
        jobTitle,
        clientEmail,
        freelancerAddress
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to deliver to Dropbox');
    }

    return result;
  } catch (error) {
    console.error('Error delivering to Dropbox:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};