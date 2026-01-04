import React from 'react';
import { Check } from 'lucide-react';

const CheckInItem = ({ goal, categoryName, isCompleted, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={`bg-white p-5 rounded-lg shadow cursor-pointer transition ${
        isCompleted 
          ? 'border-2 border-green-500 bg-green-50' 
          : 'border-2 border-transparent hover:border-indigo-300'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
          isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
        }`}>
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{goal.title}</h3>
          <p className="text-sm text-gray-600">{categoryName}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckInItem;