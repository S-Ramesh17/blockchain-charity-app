import React, { useState } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { useCampaigns } from '../../contexts/CampaignContext';
import { uploadToIPFS } from '../../utils/ipfs';

const CreateCampaignForm = () => {
  const { web3, account } = useWeb3();
  const { createCampaign } = useCampaigns();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    durationDays: '30',
    image: null,
    imagePreview: '',
  });
  const [milestones, setMilestones] = useState([{ description: '', targetAmount: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleMilestoneChange = (index, field, value) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { description: '', targetAmount: '' }]);
  };

  const removeMilestone = (index) => {
    const newMilestones = [...milestones];
    newMilestones.splice(index, 1);
    setMilestones(newMilestones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !web3) {
      alert('Please connect your wallet');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image to IPFS
      let imageHash = '';
      if (formData.image) {
        imageHash = await uploadToIPFS(formData.image);
      }

      // Prepare milestones for contract
      const formattedMilestones = milestones.map(m => ({
        description: m.description,
        targetAmount: web3.utils.toWei(m.targetAmount || '0', 'ether'),
      }));

      // Create campaign
      await createCampaign({
        title: formData.title,
        description: formData.description,
        targetAmount: formData.targetAmount,
        durationDays: formData.durationDays,
        imageHash,
      }, formattedMilestones);

      // Reset form
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        durationDays: '30',
        image: null,
        imagePreview: '',
      });
      setMilestones([{ description: '', targetAmount: '' }]);
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Campaign Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-lg"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2">Target Amount (ETH)</label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Duration (Days)</label>
            <input
              type="number"
              name="durationDays"
              value={formData.durationDays}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Campaign Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {formData.imagePreview && (
            <div className="mt-2">
              <img 
                src={formData.imagePreview} 
                alt="Preview" 
                className="h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Milestones</label>
          {milestones.map((milestone, index) => (
            <div key={index} className="mb-3 p-3 border rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Milestone {index + 1}</span>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={milestone.description}
                  onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Target Amount (ETH)</label>
                <input
                  type="number"
                  value={milestone.targetAmount}
                  onChange={(e) => handleMilestoneChange(index, 'targetAmount', e.target.value)}
                  min="0.1"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addMilestone}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Milestone
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white transition`}
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default CreateCampaignForm;