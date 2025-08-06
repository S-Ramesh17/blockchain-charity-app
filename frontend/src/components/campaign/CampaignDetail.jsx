import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useWeb3 } from '../../contexts/Web3Context';
import { useCampaigns } from '../../contexts/CampaignContext';
import DonateModal from '../donation/DonateModal';
import NFTBadge from '../nft/NFTBadge';

const CampaignDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { web3, account } = useWeb3();
  const { campaigns, fetchCampaigns } = useCampaigns();
  const [campaign, setCampaign] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (id && campaigns.length > 0) {
      const foundCampaign = campaigns.find(c => c.id.toString() === id);
      if (foundCampaign) {
        setCampaign(foundCampaign);
        setIsCreator(account && account.toLowerCase() === foundCampaign.creator.toLowerCase());
      }
    }
  }, [id, campaigns, account]);

  useEffect(() => {
    const fetchMilestones = async () => {
      if (web3 && id) {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = require('../../lib/contracts/CharityPlatform.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        const milestoneCount = await contract.methods.getMilestoneCount(id).call();
        const milestoneArray = [];
        
        for (let i = 0; i < milestoneCount; i++) {
          const milestone = await contract.methods.campaignMilestones(id, i).call();
          milestoneArray.push({
            description: milestone.description,
            targetAmount: web3.utils.fromWei(milestone.targetAmount, 'ether'),
            reached: milestone.reached
          });
        }
        
        setMilestones(milestoneArray);
      }
    };

    fetchCampaigns();
    fetchMilestones();
  }, [web3, id, fetchCampaigns]);

  if (!campaign) {
    return <div className="text-center py-8">Loading campaign details...</div>;
  }

  const progressPercentage = Math.min(
    (campaign.raisedAmount / campaign.targetAmount) * 100,
    100
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img 
          src={`https://ipfs.io/ipfs/${campaign.imageHash}`} 
          alt={campaign.title}
          className="w-full h-64 object-cover"
        />
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{campaign.title}</h1>
              <p className="text-gray-600">Created by: {campaign.creator.substring(0, 6)}...{campaign.creator.substring(38)}</p>
            </div>
            
            {campaign.verified && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                Verified
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{campaign.description}</p>
          
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Raised: {web3?.utils?.fromWei(campaign.raisedAmount, 'ether')} ETH</span>
              <span>Target: {web3?.utils?.fromWei(campaign.targetAmount, 'ether')} ETH</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setShowDonateModal(true)}
              disabled={!campaign.verified || campaign.completed}
              className={`px-6 py-2 rounded-lg ${(!campaign.verified || campaign.completed) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white transition`}
            >
              Donate Now
            </button>
            
            {isCreator && (
              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                Manage Campaign
              </button>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Milestones</h2>
            {milestones.length > 0 ? (
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${milestone.reached ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Milestone {index + 1}</h3>
                      {milestone.reached ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Reached
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">{milestone.description}</p>
                    <p className="text-sm">Target: {milestone.targetAmount} ETH</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No milestones set for this campaign</p>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Donor Badges</h2>
            <NFTBadge campaignId={id} />
          </div>
        </div>
      </div>
      
      {showDonateModal && (
        <DonateModal 
          campaign={campaign} 
          onClose={() => setShowDonateModal(false)}
          onDonationSuccess={() => {
            fetchCampaigns();
            setShowDonateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CampaignDetail;