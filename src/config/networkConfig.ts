// src/config/networkConfig.ts

function readAddress(envKey: string): string {
  // Vite uses import.meta.env
  const raw = import.meta.env[envKey];
  if (!/^0x[a-fA-F0-9]{40}$/.test(raw || '')) {
    throw new Error(`networkConfig.ts → Missing or invalid ${envKey} in .env`);
  }
  return raw;
}

export default {
  11155111: { // Sepolia
    jobFactoryAddress: readAddress('VITE_SEPOLIA_JOB_FACTORY_ADDRESS')
  },
  31337: { // Hardhat local dev
    jobFactoryAddress: readAddress('VITE_HARDHAT_JOB_FACTORY_ADDRESS')
  },
  // Add more networks as needed!
};
