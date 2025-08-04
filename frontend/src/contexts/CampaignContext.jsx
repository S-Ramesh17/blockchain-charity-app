import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWeb3 } from './Web3Context';
import CharityPlatformABI from '../lib/contracts/CharityPlatform.json';

const CampaignContext = createContext();

export const CampaignProvider = ({ children }) => {
  const { web3, account } = useWeb3();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const fetchCampaigns = async () => {
    if (!web3) return;
    
    setLoading(true);
    try {
      const contract = new web3.eth.Contract(
        CharityPlatformABI,
        CONTRACT_ADDRESS
      );
      
      const count = await contract.methods.campaignCount().call();
      const campaignArray = [];
      
      for (let i = 0; i < count; i++) {
        const campaign = await contract.methods.campaigns(i).call();
        campaignArray.push({
          id: i,
          creator: campaign.creator,
          title: campaign.title,
          description: campaign.description,
          targetAmount: campaign.targetAmount,
          raisedAmount: campaign.raisedAmount,
          deadline: campaign.deadline,
          imageHash: campaign.imageHash,
          verified: campaign.verified,
          completed: campaign.completed
        });
      }
      
      setCampaigns(campaignArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData, milestones) => {
    if (!web3 || !account) {
      throw new Error('Wallet not connected');
    }
    
    try {
      const contract = new web3.eth.Contract(
        CharityPlatformABI,
        CONTRACT_ADDRESS
      );
      
      const tx = await contract.methods
        .createCampaign(
          campaignData.title,
          campaignData.description,
          web3.utils.toWei(campaignData.targetAmount, 'ether'),
          campaignData.durationDays,
          campaignData.imageHash,
          milestones
        )
        .send({ from: account });
      
      await fetchCampaigns();
      return tx;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [web3, account]);

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,
        error,
        fetchCampaigns,
        createCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => useContext(CampaignContext);