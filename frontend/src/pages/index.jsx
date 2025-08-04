import { useEffect, useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import CampaignCard from '../components/campaign/CampaignCard';
import { getCampaigns } from '../utils/blockchain';

export default function Home() {
  const { account, contract, connectWallet } = useWeb3();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      if (contract) {
        setLoading(true);
        const data = await getCampaigns(contract);
        setCampaigns(data);
        setLoading(false);
      }
    };
    
    loadCampaigns();
  }, [contract]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Charity Platform</h1>
          {account ? (
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
              {account.substring(0, 6)}...{account.substring(38)}
            </span>
          ) : (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}