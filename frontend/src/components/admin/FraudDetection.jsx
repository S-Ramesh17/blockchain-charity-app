import React from 'react';

const FraudDetection = ({ campaigns }) => {
  // This is a simplified version - in a real app you'd have more sophisticated fraud detection
  const suspiciousCampaigns = campaigns.filter(campaign => {
    // Example criteria for suspicious campaigns:
    // 1. Very high target amount
    // 2. Very short duration
    // 3. Similar descriptions to known fraudulent campaigns
    const targetEth = parseFloat(web3?.utils?.fromWei(campaign.targetAmount, 'ether'));
    return targetEth > 1000; // Flag campaigns asking for more than 1000 ETH
  });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Potential Fraud Alerts ({suspiciousCampaigns.length})</h3>
      
      {suspiciousCampaigns.length === 0 ? (
        <p className="text-gray-500">No suspicious campaigns detected</p>
      ) : (
        <div className="space-y-4">
          {suspiciousCampaigns.map(campaign => (
            <div key={campaign.id} className="border rounded-lg p-4 bg-red-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{campaign.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                </div>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  High Risk
                </span>
              </div>
              <div className="mt-2 text-sm">
                <p>Target: {web3?.utils?.fromWei(campaign.targetAmount, 'ether')} ETH</p>
                <p>Creator: {campaign.creator.substring(0, 6)}...{campaign.creator.substring(38)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FraudDetection;