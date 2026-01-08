import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const GoalCard = ({ goal, onEdit, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const getFrequencyLabel = () => {
    const labels = {
      daily: `${goal.target_value}x per day`,
      weekly: `${goal.target_value}x per week`,
      monthly: `${goal.target_value}x per month`,
      yearly: `${goal.target_value}x per year`,
      custom: 'Custom tracking'
    };
    return labels[goal.frequency] || goal.frequency;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow relative group">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {goal.title}
          </h3>
          <p className="text-gray-600">{getFrequencyLabel()}</p>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-800 mb-3">Delete this goal?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete(goal.id);
                setShowConfirm(false);
              }}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="px-3 py-1 bg-white text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
