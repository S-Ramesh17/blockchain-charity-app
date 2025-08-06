import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';

const DonationHistory = () => {
  const { web3, account } = useWeb3();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!web3 || !account) return;
      
      setLoading(true);
      try {
        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
        const contractABI = require('../../lib/contracts/CharityPlatform.json');
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        
        // Get all campaigns first
        const campaignCount = await contract.methods.campaignCount().call();
        const allDonations = [];
        
        for (let i = 0; i < campaignCount; i++) {
          const donationAmount = await contract.methods.donations(account, i).call();
          if (donationAmount > 0) {
            const campaign = await contract.methods.campaigns(i).call();
            allDonations.push({
              campaignId: i,
              title: campaign.title,
              amount: web3.utils.fromWei(donationAmount, 'ether'),
              date: new Date().toISOString() // In a real app, you'd get this from events
            });
          }
        }
        
        setDonations(allDonations);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [web3, account]);

  if (!account) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Connect your wallet to view donation history</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-600">Loading donation history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Your Donation History</h2>
      
      {donations.length === 0 ? (
        <p className="text-gray-500">You haven't made any donations yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (ETH)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {donations.map((donation, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{donation.title}</div>
                    <div className="text-sm text-gray-500">ID: {donation.campaignId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationHistory;