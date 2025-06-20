// src/logic-modules.d.ts

declare module '../logic/ipfsUploader.js' {
  export function uploadMetadataToIPFS(metadata: any): Promise<string>;
}

declare module '../logic/storeEmail.js' {
  export function storeEmail(args: {
    jobAddress: string;
    creatorEmail: string;
    freelancerEmail?: string;
    creatorAddress: string;
    jobTitle?: string;
  }): Promise<void>;
}
