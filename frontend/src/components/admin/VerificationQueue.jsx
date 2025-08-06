import React from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

const VerificationQueue = ({ campaigns }) => {
  const { web3, account } = useWeb3();
  const unverifiedCampaigns = campaigns.filter(c => !c.verified);

  const verifyCampaign = async (campaignId) => {
    try {
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
      const contractABI = require('../../lib/contracts/CharityPlatform.json');
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      
      await contract.methods.verifyCampaign(campaignId)
        .send({ from: account });
      
      alert('Campaign verified successfully!');
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed: ' + error.message);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Campaigns Pending Verification ({unverifiedCampaigns.length})</h3>
      
      {unverifiedCampaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns awaiting verification</p>
      ) : (
        <div className="space-y-4">
          {unverifiedCampaigns.map(campaign => (
            <div key={campaign.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{campaign.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                </div>
                <button
                  onClick={() => verifyCampaign(campaign.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                >
                  Verify
                </button>
              </div>
              <div className="mt-2 text-sm">
                <p>Creator: {campaign.creator.substring(0, 6)}...{campaign.creator.substring(38)}</p>
                <p>Target: {web3?.utils?.fromWei(campaign.targetAmount, 'ether')} ETH</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerificationQueue;