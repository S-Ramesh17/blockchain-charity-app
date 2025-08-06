import React from 'react';

const NFTRewards = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Donor Rewards Program</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">How It Works</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li>Donate 1 ETH or more to any campaign to receive a unique donor badge NFT</li>
          <li>Collect badges from different campaigns to increase your donor level</li>
          <li>Special rewards for top donors at the end of each quarter</li>
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Current Reward Tiers</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-yellow-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h4 className="font-medium">Bronze Donor (1+ badges)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-9">
              <li>Exclusive newsletter</li>
              <li>Early access to new campaigns</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gray-200 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h4 className="font-medium">Silver Donor (5+ badges)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-9">
              <li>All Bronze benefits</li>
              <li>VIP Discord role</li>
              <li>Monthly AMA with charity founders</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-yellow-300 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h4 className="font-medium">Gold Donor (10+ badges)</h4>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-9">
              <li>All Silver benefits</li>
              <li>Governance voting rights</li>
              <li>Exclusive donor events</li>
              <li>Charity matching bonus</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTRewards;