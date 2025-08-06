import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

const NFTGallery = () => {
  const { web3, account } = useWeb3();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!web3 || !account) return;
      
      setLoading(true);
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = require('../../lib/contracts/CharityPlatform.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        const nftAddress = await contract.methods.charityNFT().call();
        const nftABI = require('../../lib/contracts/CharityNFT.json');
        const nftContract = new web3.eth.Contract(nftABI, nftAddress);
        
        const balance = await nftContract.methods.balanceOf(account).call();
        const nftArray = [];
        
        for (let i = 0; i < balance; i++) {
          const tokenId = await nftContract.methods.tokenOfOwnerByIndex(account, i).call();
          const tokenData = await nftContract.methods.tokenData(tokenId).call();
          const campaign = await contract.methods.campaigns(tokenData.campaignId).call();
          
          nftArray.push({
            tokenId,
            campaignId: tokenData.campaignId,
            campaignTitle: campaign.title,
            donationAmount: web3.utils.fromWei(tokenData.donationAmount, 'ether'),
            mintDate: new Date(tokenData.mintDate * 1000).toLocaleDateString(),
            imageUrl: `https://ipfs.io/ipfs/${campaign.imageHash}`
          });
        }
        
        setNfts(nftArray);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [web3, account]);

  if (!account) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Connect your wallet to view your NFT badges</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading your NFT badges...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Your Donor Badges</h2>
      
      {nfts.length === 0 ? (
        <p className="text-gray-500">You haven't earned any donor badges yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="border rounded-lg overflow-hidden">
              <img 
                src={nft.imageUrl} 
                alt={nft.campaignTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium mb-1">{nft.campaignTitle}</h3>
                <p className="text-sm text-gray-600 mb-2">Donated: {nft.donationAmount} ETH</p>
                <p className="text-xs text-gray-500">Earned: {nft.mintDate}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTGallery;