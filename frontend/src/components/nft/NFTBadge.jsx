import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

const NFTBadge = ({ campaignId }) => {
  const { web3, account } = useWeb3();
  const [hasBadge, setHasBadge] = useState(false);
  const [badgeData, setBadgeData] = useState(null);

  useEffect(() => {
    const checkBadge = async () => {
      if (!web3 || !account || !campaignId) return;
      
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = require('../../lib/contracts/CharityPlatform.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        const nftAddress = await contract.methods.charityNFT().call();
        const nftABI = require('../../lib/contracts/CharityNFT.json');
        const nftContract = new web3.eth.Contract(nftABI, nftAddress);
        
        const hasBadge = await nftContract.methods.hasReceivedNFT(account, campaignId).call();
        setHasBadge(hasBadge);
        
        if (hasBadge) {
          // Find the token ID for this campaign
          const balance = await nftContract.methods.balanceOf(account).call();
          for (let i = 0; i < balance; i++) {
            const tokenId = await nftContract.methods.tokenOfOwnerByIndex(account, i).call();
            const tokenData = await nftContract.methods.tokenData(tokenId).call();
            if (tokenData.campaignId.toString() === campaignId.toString()) {
              setBadgeData({
                tokenId,
                donationAmount: web3.utils.fromWei(tokenData.donationAmount, 'ether'),
                mintDate: new Date(tokenData.mintDate * 1000).toLocaleDateString()
              });
              break;
            }
          }
        }
      } catch (error) {
        console.error('Error checking NFT badge:', error);
      }
    };

    checkBadge();
  }, [web3, account, campaignId]);

  if (!hasBadge || !badgeData) {
    return null;
  }

  return (
    <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="bg-yellow-100 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-medium">You've earned a donor badge!</h3>
          <p className="text-sm text-gray-600">
            Thank you for donating {badgeData.donationAmount} ETH to this campaign on {badgeData.mintDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTBadge;