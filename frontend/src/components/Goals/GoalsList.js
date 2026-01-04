import React from 'react';
import { Plus } from 'lucide-react';
import GoalCard from './GoalCard';

const GoalsList = ({ category, goals, onBack, onAddGoal }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="text-indigo-600 mb-4 hover:text-indigo-700"
        >
          ← Back to Categories
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {category?.title}
        </h1>

        <div className="space-y-4 mb-6">
          {goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        <button
          onClick={onAddGoal}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </button>
      </div>
    </div>
  );
};

export default GoalsList;