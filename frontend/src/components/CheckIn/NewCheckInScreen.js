import React, { useState, useEffect } from 'react';
import { Sun, Calendar as CalIcon, FileText, Target as TargetIcon, Sparkles } from 'lucide-react';
import DailyGoalItem from './DailyGoalItem';
import ProgressGoalItem from './ProgressGoalItem';

const NewCheckInScreen = ({ goals, onAddProgress, onToggleDaily, onNavigateToCategories }) => {
  const [groupedGoals, setGroupedGoals] = useState({
    daily: [],
    weekly: [],
    monthly: [],
    yearly: [],
    custom: []
  });

  useEffect(() => {
    const grouped = {
      daily: goals.filter(g => g.frequency === 'daily'),
      weekly: goals.filter(g => g.frequency === 'weekly'),
      monthly: goals.filter(g => g.frequency === 'monthly'),
      yearly: goals.filter(g => g.frequency === 'yearly'),
      custom: goals.filter(g => g.frequency === 'custom')
    };
    setGroupedGoals(grouped);
  }, [goals]);

  const sections = [
    { key: 'daily', title: '🌅 Daily', icon: Sun, description: 'Complete today' },
    { key: 'weekly', title: '📅 Weekly', icon: CalIcon, description: 'This week\'s progress' },
    { key: 'monthly', title: '🗓 Monthly', icon: FileText, description: 'This month\'s activities' },
    { key: 'yearly', title: '🏁 Yearly', icon: TargetIcon, description: 'Annual goals' },
    { key: 'custom', title: '✨ Custom', icon: Sparkles, description: 'Free-form tracking' }
  ];

  if (goals.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check-In</h1>
          <p className="text-gray-600 mb-8">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <div className="text-center py-12">
            <TargetIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No goals yet. Start by adding some!</p>
            <button
              onClick={onNavigateToCategories}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Go to Categories →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check-In</h1>
        <p className="text-gray-600 mb-8">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-8">
          {sections.map(section => {
            const sectionGoals = groupedGoals[section.key];
            if (sectionGoals.length === 0) return null;

            return (
              <div key={section.key} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-6 h-6 text-indigo-600" />
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {sectionGoals.map(goal => 
                    section.key === 'daily' ? (
                      <DailyGoalItem
                        key={goal.id}
                        goal={goal}
                        onToggle={onToggleDaily}
                      />
                    ) : (
                      <ProgressGoalItem
                        key={goal.id}
                        goal={goal}
                        frequency={section.key}
                        onAddProgress={onAddProgress}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewCheckInScreen;