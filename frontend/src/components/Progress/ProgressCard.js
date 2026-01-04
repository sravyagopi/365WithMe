import React from 'react';

const ProgressCard = ({ progress }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{progress.category}</h3>
        <span className="text-2xl font-bold text-indigo-600">
          {Math.round(progress.completion_rate)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all"
          style={{ width: `${progress.completion_rate}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {progress.completed_count} / {progress.total_goals} goals this week
      </p>
    </div>
  );
};

export default ProgressCard;

