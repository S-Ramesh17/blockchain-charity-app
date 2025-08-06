import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DonationStats = () => {
  const { web3 } = useWeb3();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalCampaigns: 0,
    topDonors: [],
    recentDonations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!web3) return;
      
      setLoading(true);
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = require('../../lib/contracts/CharityPlatform.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        const campaignCount = await contract.methods.campaignCount().call();
        let totalDonated = 0;
        
        for (let i = 0; i < campaignCount; i++) {
          const campaign = await contract.methods.campaigns(i).call();
          totalDonated += parseFloat(web3.utils.fromWei(campaign.raisedAmount, 'ether'));
        }
        
        // Simplified stats - in a real app you'd use TheGraph for complex queries
        setStats({
          totalDonations: totalDonated,
          totalCampaigns: campaignCount,
          topDonors: [], // Would query from events
          recentDonations: [] // Would query from events
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [web3]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Donations (ETH)',
        data: [12, 19, 3, 5, 2, 3], // Sample data
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Platform Statistics</h2>
      
      {loading ? (
        <p className="text-gray-500">Loading statistics...</p>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total Donations</h3>
              <p className="text-2xl font-bold">{stats.totalDonations.toFixed(2)} ETH</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Campaigns</h3>
              <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-800">Active Campaigns</h3>
              <p className="text-2xl font-bold">{stats.totalCampaigns}</p> {/* Simplified */}
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Monthly Donations</h3>
            <div className="h-64">
              <Bar 
                data={chartData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Top Donors</h3>
              {stats.topDonors.length > 0 ? (
                <ul className="space-y-2">
                  {stats.topDonors.map((donor, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{donor.address}</span>
                      <span>{donor.amount} ETH</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No donor data available</p>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
              {stats.recentDonations.length > 0 ? (
                <ul className="space-y-2">
                  {stats.recentDonations.map((donation, index) => (
                    <li key={index} className="flex justify-between">
                      <span>Donation to {donation.campaignId}</span>
                      <span>{donation.amount} ETH</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No recent donations</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationStats;