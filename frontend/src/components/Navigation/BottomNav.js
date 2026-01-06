// src/components/Navigation/BottomNav.js
import React from 'react';
import { Home, CheckSquare, Target, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

const BottomNav = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'welcome', label: 'Home', icon: Home },
    { id: 'checkin', label: 'Check-In', icon: CheckSquare },
    { id: 'categories', label: 'Goals', icon: Target },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'yearprogress', label: 'Year', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id || 
            (item.id === 'categories' && currentView === 'categoryGoals');
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition ${
                isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;