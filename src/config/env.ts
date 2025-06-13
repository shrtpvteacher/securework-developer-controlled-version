// Environment configuration
export const config = {
  // Pinata IPFS
  pinataJWT: import.meta.env.VITE_PINATA_JWT,
  
  // OpenAI
  openaiApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  
  // Dropbox
  dropboxAccessToken: import.meta.env.VITE_DROPBOX_ACCESS_TOKEN,
  
  // Blockchain
  alchemyRpcUrl: import.meta.env.VITE_ALCHEMY_RPC_URL,
  aiVerifierPrivateKey: import.meta.env.VITE_AI_VERIFIER_PRIVATE_KEY,
  
  // Contracts
  factoryContractAddress: import.meta.env.VITE_FACTORY_CONTRACT_ADDRESS,
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

// Validation helper
export const validateConfig = () => {
  const required = [
    'pinataJWT',
    'openaiApiKey', 
    'dropboxAccessToken',
    'alchemyRpcUrl',
    'factoryContractAddress'
  ];
  
  const missing = required.filter(key => !config[key as keyof typeof config]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return missing.length === 0;
};