// logic/ipfsUploader.ts

export interface Metadata {
  title: string;
  description: string;
  jobPay: string;
  clientAddress: string;
  requirements: string[];
  deliverables: string[];
}

export async function uploadMetadataToIPFS(metadata: Metadata): Promise<string> {
  const res = await fetch('/.netlify/functions/uploadMetadataToIPFS', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`IPFS upload failed: ${errorText}`);
  }

  const data: { ipfsHash: string } = await res.json();
  return data.ipfsHash; // e.g., ipfs://Qm...
}