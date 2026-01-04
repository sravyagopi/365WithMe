import React from 'react';
import { TrendingUp } from 'lucide-react';
import ProgressCard from './ProgressCard';

const WeeklyProgress = ({ progress }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Weekly Progress</h1>

        <div className="space-y-6">
          {progress.map(item => (
            <ProgressCard key={item.category} progress={item} />
          ))}
        </div>

        {progress.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No progress data yet. Start checking in daily!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyProgress;