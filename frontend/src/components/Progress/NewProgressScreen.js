import React, { useEffect, useState } from 'react';
import { TrendingUp, Sun, Calendar as CalIcon, FileText, Target as TargetIcon, Sparkles } from 'lucide-react';
import ProgressSection from './ProgressSection';

const NewProgressScreen = ({ progressData }) => {
  const sections = [
    { key: 'daily', title: '🌅 Daily Goals', icon: Sun },
    { key: 'weekly', title: '📅 Weekly Goals', icon: CalIcon },
    { key: 'monthly', title: '🗓 Monthly Goals', icon: FileText },
    { key: 'yearly', title: '🏁 Yearly Goals', icon: TargetIcon },
    { key: 'custom', title: '✨ Custom Goals', icon: Sparkles }
  ];

  const hasData = progressData && Object.keys(progressData).length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Progress</h1>

        {!hasData ? (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No progress data yet. Start checking in daily!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map(section => {
              const sectionData = progressData[section.key];
              if (!sectionData || sectionData.length === 0) return null;

              return (
                <ProgressSection
                  key={section.key}
                  title={section.title}
                  icon={section.icon}
                  goals={sectionData}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewProgressScreen;
