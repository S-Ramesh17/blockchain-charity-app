import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

const WalletConnect = () => {
  const { account, connectWallet, loading, error } = useWeb3();

  const truncateAddress = (addr) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  if (loading) {
    return (
      <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed">
        Connecting...
      </button>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div>
      {account ? (
        <div className="flex items-center space-x-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {truncateAddress(account)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;