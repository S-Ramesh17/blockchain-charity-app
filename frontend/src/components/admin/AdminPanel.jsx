import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useCampaigns } from '../../contexts/CampaignContext';
import VerificationQueue from './VerificationQueue';
import FraudDetection from './FraudDetection';

const AdminPanel = () => {
  const { account, web3 } = useWeb3();
  const { campaigns, fetchCampaigns } = useCampaigns();
  const [activeTab, setActiveTab] = useState('verification');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (web3 && account) {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = require('../../lib/contracts/CharityPlatform.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        const owner = await contract.methods.owner().call();
        setIsAdmin(owner.toLowerCase() === account.toLowerCase());
      }
    };

    checkAdminStatus();
    fetchCampaigns();
  }, [web3, account, fetchCampaigns]);

  if (!isAdmin) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <p className="text-gray-600">You must be an administrator to access this panel.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'verification' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('verification')}
        >
          Verification Queue
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'fraud' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('fraud')}
        >
          Fraud Detection
        </button>
      </div>

      {activeTab === 'verification' && <VerificationQueue campaigns={campaigns} />}
      {activeTab === 'fraud' && <FraudDetection campaigns={campaigns} />}
    </div>
  );
};

export default AdminPanel;