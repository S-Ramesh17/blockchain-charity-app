import React from 'react';

const MilestoneForm = ({ milestone, index, onChange, onRemove, showRemove }) => {
  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Milestone {index + 1}</h3>
        {showRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Remove
          </button>
        )}
      </div>
      <div className="mb-3">
        <label className="block text-gray-700 mb-1">Description</label>
        <input
          type="text"
          name="description"
          value={milestone.description}
          onChange={(e) => onChange(index, 'description', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Describe this milestone"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-1">Target Amount (ETH)</label>
        <input
          type="number"
          name="targetAmount"
          value={milestone.targetAmount}
          onChange={(e) => onChange(index, 'targetAmount', e.target.value)}
          min="0.1"
          step="0.1"
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="0.1"
        />
      </div>
    </div>
  );
};

export default MilestoneForm;