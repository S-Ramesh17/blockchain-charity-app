import React from 'react';
import Layout from '../../components/Layout';
import { useUser } from '../../contexts/UserContext';
import { useCampaigns } from '../../contexts/CampaignContext';
import CampaignCard from '../../components/campaign/CampaignCard';
import CreateCampaignForm from '../../components/campaign/CreateCampaignForm';

const CharityDashboard = () => {
  const { user } = useUser();
  const { campaigns } = useCampaigns();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const myCampaigns = campaigns.filter(c => 
    user && c.creator.toLowerCase() === user.address.toLowerCase()
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Charity Dashboard</h1>
              {user && (
                <p className="text-gray-600 mt-2">
                  Welcome back, {user.name || 'Organization'}!
                </p>
              )}
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Create New Campaign
            </button>
          </div>
        </div>
        
        {showCreateForm ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <CreateCampaignForm onSuccess={() => setShowCreateForm(false)} />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6">Your Campaigns</h2>
            {myCampaigns.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600 mb-4">You haven't created any campaigns yet</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                >
                  Create Your First Campaign
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myCampaigns.map(campaign => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default CharityDashboard;