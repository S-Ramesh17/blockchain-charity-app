import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { donateToCampaign } from '../../utils/blockchain';

const DonateModal = ({ campaign, onClose, onDonationSuccess }) => {
  const { web3, account } = useWeb3();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDonate = async () => {
    if (!account) {
      alert('Please connect your wallet');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsSubmitting(true);
    try {
      await donateToCampaign(
        web3,
        campaign.id,
        web3.utils.toWei(amount, 'ether')
      );
      onDonationSuccess();
      onClose();
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Donate to {campaign.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-700 mb-2">Current raised: {web3?.utils?.fromWei(campaign.raisedAmount, 'ether')} ETH</p>
          <p className="text-gray-700 mb-2">Target: {web3?.utils?.fromWei(campaign.targetAmount, 'ether')} ETH</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Amount (ETH)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="0.1"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Message (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="2"
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Add a message of support..."
          ></textarea>
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="anonymous"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="anonymous" className="text-gray-700">
            Donate anonymously
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDonate}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white transition`}
          >
            {isSubmitting ? 'Processing...' : 'Donate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;