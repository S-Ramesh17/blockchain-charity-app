import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { donateToCampaign } from '../utils/blockchain';

const CampaignCard = ({ campaign }) => {
  const { web3, account } = useWeb3();
  const [donationAmount, setDonationAmount] = React.useState('0.1');
  
  const handleDonate = async () => {
    if (!account) {
      alert('Please connect your wallet');
      return;
    }
    
    try {
      await donateToCampaign(
        web3,
        campaign.id,
        web3.utils.toWei(donationAmount, 'ether')
      );
      alert('Donation successful!');
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={`https://ipfs.io/ipfs/${campaign.imageHash}`} 
        alt={campaign.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{campaign.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Raised:</span>
            <span>{web3?.utils?.fromWei(campaign.raisedAmount, 'ether')} ETH</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${(campaign.raisedAmount / campaign.targetAmount) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Target:</span>
            <span>{web3?.utils?.fromWei(campaign.targetAmount, 'ether')} ETH</span>
          </div>
        </div>
        
        {campaign.verified && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="border rounded px-3 py-2 flex-1"
              min="0.01"
              step="0.01"
            />
            <button
              onClick={handleDonate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Donate
            </button>
          </div>
        )}
        
        {!campaign.verified && (
          <div className="text-yellow-600 text-sm">
            Pending verification
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;