import { Web3Provider } from '@ethersproject/providers';

export const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

export const RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
  5: `https://goerli.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,
};

export const SUPPORTED_CHAINS = {
  1: {
    name: 'Ethereum Mainnet',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    rpcUrl: RPC_URLS[1],
  },
  5: {
    name: 'Goerli Testnet',
    symbol: 'ETH',
    explorer: 'https://goerli.etherscan.io',
    rpcUrl: RPC_URLS[5],
  },
};