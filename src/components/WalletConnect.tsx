import React from 'react';
import { Wallet, LogOut, Copy } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

const WalletConnect: React.FC = () => {
  const { account, isConnected, balance, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <Wallet className="h-4 w-4" />
        <span className="font-medium">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="bg-gray-50 px-3 py-2 rounded-lg border">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(account!)}
          </span>
          <button
            onClick={copyAddress}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Copy address"
          >
            <Copy className="h-3 w-3 text-gray-500" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {parseFloat(balance).toFixed(4)} ETH
        </div>
      </div>
      <button
        onClick={disconnectWallet}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        title="Disconnect wallet"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
};

export default WalletConnect;