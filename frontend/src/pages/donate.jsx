import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useWeb3 } from '../contexts/Web3Context';
import { useCampaigns } from '../contexts/CampaignContext';
import CampaignCard from '../components/campaign/CampaignCard';
import DonationStats from '../components/donation/DonationStats';

const DonatePage = () => {
  const { account } = useWeb3();
  const { campaigns, loading, error } = useCampaigns();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(campaign => {
    // Filter by verification status
    if (filter === 'verified' && !campaign.verified) return false;
    if (filter === 'unverified' && campaign.verified) return false;
    
    // Filter by search term
    if (searchTerm && 
        !campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !campaign.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Support a Cause</h1>
          
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-lg ${filter === 'verified' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              >
                Verified
              </button>
              {account && (
                <button
                  onClick={() => setFilter('my')}
                  className={`px-4 py-2 rounded-lg ${filter === 'my' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                >
                  My Donations
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading campaigns...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
            Error loading campaigns: {error.message}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredCampaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">No campaigns found matching your criteria</p>
              </div>
            )}
          </>
        )}

        <DonationStats />
      </div>
    </Layout>
  );
};

export default DonatePage;