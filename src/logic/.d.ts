// logic.d.ts

export function uploadMetadataToIPFS(metadata: any): Promise<string>;

export function storeEmail(args: {
  jobAddress: string;
  creatorEmail: string;
  freelancerEmail?: string;
  creatorAddress: string;
  jobTitle?: string;
}): Promise<void>;
