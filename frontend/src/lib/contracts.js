export const CONTRACT_ADDRESSES = {
  1: { // Mainnet
    charityPlatform: '0x123...',
    charityNFT: '0x456...',
    donationToken: '0x789...',
  },
  5: { // Goerli
    charityPlatform: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    charityNFT: process.env.NEXT_PUBLIC_NFT_ADDRESS,
    donationToken: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
  },
  1337: { // Localhost
    charityPlatform: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    charityNFT: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    donationToken: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
  },
};

export const getContractAddress = (chainId, contractName) => {
  return CONTRACT_ADDRESSES[chainId]?.[contractName] || null;
};