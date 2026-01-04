import React from 'react';

const ProgressSection = ({ title, icon: Icon, goals }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>

      <div className="space-y-4">
        {goals.map(goal => (
          <div key={goal.goal_id} className="border-l-4 border-indigo-600 pl-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">{goal.title}</h3>
              <span className="text-lg font-bold text-indigo-600">
                {Math.round(goal.percentage)}%
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              {goal.current_value} / {goal.target_value} {goal.period_label}
            </p>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  goal.percentage >= 100 ? 'bg-green-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${Math.min(goal.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSection;