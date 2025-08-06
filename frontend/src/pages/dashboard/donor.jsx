import React from 'react';
import Layout from '../../components/Layout';
import { useUser } from '../../contexts/UserContext';
import DonationHistory from '../../components/donation/DonationHistory';
import NFTGallery from '../../components/nft/NFTGallery';
import NFTRewards from '../../components/nft/NFTRewards';

const DonorDashboard = () => {
  const { user } = useUser();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>
          {user && (
            <p className="text-gray-600 mt-2">
              Welcome back, {user.name || 'Anonymous'}!
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <DonationHistory />
            <NFTGallery />
          </div>
          
          <div className="space-y-8">
            <NFTRewards />
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                  Discover Campaigns
                </button>
                <button className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition">
                  Share Your Badges
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition">
                  Download Tax Receipts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonorDashboard;