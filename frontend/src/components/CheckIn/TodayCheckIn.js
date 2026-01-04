import React from 'react';
import { Target } from 'lucide-react';
import CheckInItem from './CheckInItem';

const TodayCheckIn = ({ goals, checkIns, categories, onToggleCheckIn, onNavigateToCategories }) => {
  const getCheckInStatus = (goalId) => {
    const checkIn = checkIns.find(c => c.goal_id === goalId);
    return checkIn?.completed || false;
  };

  const getCategoryName = (categoryId) => {
    return categories.find(c => c.id === categoryId)?.title || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Check-In</h1>
        <p className="text-gray-600 mb-8">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-3">
          {goals.map(goal => (
            <CheckInItem
              key={goal.id}
              goal={goal}
              categoryName={getCategoryName(goal.category_id)}
              isCompleted={getCheckInStatus(goal.id)}
              onToggle={() => onToggleCheckIn(goal.id, getCheckInStatus(goal.id))}
            />
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No goals yet. Start by adding some!</p>
            <button
              onClick={onNavigateToCategories}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Go to Categories →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayCheckIn;
