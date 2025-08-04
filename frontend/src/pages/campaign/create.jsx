import React from 'react';
import CreateCampaignForm from '../../components/campaign/CreateCampaignForm';
import Layout from '../../components/Layout';
import { useWeb3 } from '../../contexts/Web3Context';

const CreateCampaignPage = () => {
  const { account } = useWeb3();

  if (!account) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
            <p className="text-gray-600 mb-4">
              Please connect your wallet to create a new campaign.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <CreateCampaignForm />
      </div>
    </Layout>
  );
};

export default CreateCampaignPage;