// File: src/services/ipfs.ts
import axios from 'axios';

const pinataJWT = process.env.PINATA_JWT;

export async function handler(event: any): Promise<any> {
  try {
    if (!pinataJWT) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing Pinata JWT." }),
      };
      }
    }
}

export interface JobMetadata {
  title: string;
  description: string;
  requirements: string[];
  deliverables: string[];
  jobPrice: string;
  clientAddress: string;
  freelancerAddress: string;
  createdAt: string;
  jobId?: string;
} ;

export const uploadJobMetadata = async (metadata: JobMetadata): Promise<string> => {
  try {
    if (!pinataJWT) {
      throw new Error('Pinata JWT not configured');
    }

    const metadataWithTimestamp = {
      ...metadata,
      createdAt: new Date().toISOString(),
    };

    // Upload to IPFS via Pinata API
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: JSON.stringify({
        pinataContent: metadataWithTimestamp,
        pinataMetadata: {
          name: `job-metadata-${metadata.jobId || Date.now()}`,
          keyvalues: {
            jobId: metadata.jobId || '',
            client: metadata.clientAddress,
            freelancer: metadata.freelancerAddress
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Pinata API error: ${response.statusText}`);
    }

    const result = await response.json();
    const ipfsHash = result.IpfsHash;
    
    console.log('Metadata uploaded to IPFS:', ipfsHash);
    
    // Return the full IPFS URI
    return `ipfs://${ipfsHash}`;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

export const getJobMetadata = async (metadataURI: string): Promise<JobMetadata> => {
  try {
    // Handle both ipfs:// and direct hash formats
    const ipfsHash = metadataURI.startsWith('ipfs://') 
      ? metadataURI.replace('ipfs://', '')
      : metadataURI;
    
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata from IPFS');
    }
    
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch metadata from IPFS');
  }
};

export const uploadWorkFiles = async (files: File[]): Promise<string> => {
  try {
    if (!pinataJWT) {
      throw new Error('Pinata JWT not configured');
    }

    // For multiple files, create a directory structure
    const fileData = new FormData();
    
    files.forEach((file, index) => {
      fileData.append('file', file, `work-files/${file.name}`);
    });

    // Add metadata for the upload
    const metadata = JSON.stringify({
      name: `work-submission-${Date.now()}`,
      keyvalues: {
        type: 'work-submission',
        uploadedAt: new Date().toISOString()
      }
    });
    fileData.append('pinataMetadata', metadata);

    // Upload via Pinata API
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: fileData
    });

    if (!response.ok) {
      throw new Error('Failed to upload files to IPFS');
    }

    const result = await response.json();
    console.log('Work files uploaded to IPFS:', result.IpfsHash);
    
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading work files:', error);
    throw new Error('Failed to upload work files to IPFS');
  }
};

// Helper function to convert IPFS URI to HTTP gateway URL
export const getIPFSGatewayUrl = (ipfsUri: string): string => {
  const hash = ipfsUri.startsWith('ipfs://') 
    ? ipfsUri.replace('ipfs://', '')
    : ipfsUri;
  
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};