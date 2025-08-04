import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setNetworkId(networkId);
        
        // Set up event listeners
        window.ethereum.on('accountsChanged', (newAccounts) => {
          setAccount(newAccounts[0] || null);
        });
        
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        setError('Please install MetaMask!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    } else {
      setLoading(false);
      setError('Web3 not detected. Please install MetaMask.');
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        account,
        networkId,
        loading,
        error,
        connectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);