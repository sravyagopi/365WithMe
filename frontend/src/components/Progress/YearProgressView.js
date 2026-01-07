// src/components/Progress/YearProgressView.js
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const YearProgressView = ({ goals, categories }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState('year'); // 'week', 'month', 'year'
  const [goalProgress, setGoalProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('YearProgressView mounted/updated', { year, goalsCount: goals.length });
    if (goals.length > 0) {
      fetchAllGoalProgress();
    } else {
      setLoading(false);
    }
  }, [year, goals]);

  const fetchAllGoalProgress = async () => {
    console.log('Fetching progress for', goals.length, 'goals');
    setLoading(true);
    try {
      const progressData = {};
      
      // Import checkinService to use authenticated API
      const { checkinService } = await import('../../services/checkinService');
      
      // Fetch check-ins for each goal for the entire year
      for (const goal of goals) {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        
        console.log(`Fetching check-ins for goal ${goal.id}: ${goal.title}`);
        
        try {
          // Use the service which handles auth automatically
          const checkins = await checkinService.getByGoal(goal.id, startDate, endDate);
          console.log(`Goal ${goal.id} has ${checkins.length} check-ins`);
          
          // Group by date
          const byDate = {};
          checkins.forEach(checkin => {
            if (!byDate[checkin.date]) {
              byDate[checkin.date] = 0;
            }
            byDate[checkin.date] += checkin.value;
          });
          
          progressData[goal.id] = byDate;
        } catch (error) {
          console.error(`Failed to fetch check-ins for goal ${goal.id}:`, error);
          progressData[goal.id] = {};
        }
      }
      
      console.log('All progress data:', progressData);
      setGoalProgress(progressData);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInYear = (year) => {
    const days = [];
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const getColorForGoal = (goalId, date, intensity) => {
    // Get category color
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 'bg-gray-100';
    
    const category = categories.find(c => c.id === goal.category_id);
    const categoryColors = {
      'Fitness': 'red',
      'Personal Growth': 'blue',
      'Financial': 'green',
      'Relationships': 'purple',
      'Community': 'yellow',
      'Self-Care': 'pink'
    };
    
    const color = categoryColors[category?.title] || 'indigo';
    
    if (intensity === 0) return 'bg-gray-100';
    if (intensity <= 0.3) return `bg-${color}-200`;
    if (intensity <= 0.6) return `bg-${color}-400`;
    return `bg-${color}-600`;
  };

  const calculateYearCompletion = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return 0;
    
    const dates = goalProgress[goalId] || {};
    const totalDays = getDaysInYear(year).length;
    const completedDays = Object.keys(dates).length;
    
    // For frequency-based goals, calculate based on target
    if (goal.frequency === 'daily') {
      return Math.round((completedDays / totalDays) * 100);
    } else if (goal.frequency === 'weekly') {
      const weeksInYear = 52;
      const totalCheckins = Object.values(dates).reduce((sum, val) => sum + val, 0);
      const expectedTotal = weeksInYear * goal.target_value;
      return Math.round((totalCheckins / expectedTotal) * 100);
    } else if (goal.frequency === 'yearly') {
      const totalCheckins = Object.values(dates).reduce((sum, val) => sum + val, 0);
      return Math.round((totalCheckins / goal.target_value) * 100);
    }
    
    return Math.round((completedDays / totalDays) * 100);
  };

  const getCategoryColor = (categoryTitle) => {
    const colors = {
      'Fitness': 'text-red-600 bg-red-50',
      'Personal Growth': 'text-blue-600 bg-blue-50',
      'Financial': 'text-green-600 bg-green-50',
      'Relationships': 'text-purple-600 bg-purple-50',
      'Community': 'text-yellow-600 bg-yellow-50',
      'Self-Care': 'text-pink-600 bg-pink-50'
    };
    return colors[categoryTitle] || 'text-indigo-600 bg-indigo-50';
  };

  const renderYearGrid = (goalId) => {
    const days = getDaysInYear(year);
    const dates = goalProgress[goalId] || {};
    const values = Object.values(dates);
    const maxValue = values.length > 0 ? Math.max(...values) : 1;
    
    // Filter days based on view
    let displayDays = days;
    if (view === 'week') {
      // Show current week only
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      displayDays = days.filter(d => d >= startOfWeek && d <= endOfWeek);
    } else if (view === 'month') {
      // Show current month only
      const today = new Date();
      displayDays = days.filter(d => 
        d.getMonth() === today.getMonth() && 
        d.getFullYear() === today.getFullYear()
      );
    }
    
    const gridCols = view === 'week' ? 'grid-cols-7' : 
                     view === 'month' ? 'grid-cols-31' : 
                     'grid-cols-53';
    const squareSize = view === 'week' ? 'w-8 h-8' : 
                      view === 'month' ? 'w-3 h-3' : 
                      'w-2 h-2';
    
    return (
      <div className={`grid ${gridCols} gap-1`}>
        {displayDays.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0];
          const value = dates[dateStr] || 0;
          const intensity = value / maxValue;
          
          // Get goal and category for color
          const goal = goals.find(g => g.id === goalId);
          const category = categories.find(c => c.id === goal?.category_id);
          
          let bgColor = 'bg-gray-100';
          if (value > 0) {
            if (category?.title === 'Fitness') {
              if (intensity <= 0.3) bgColor = 'bg-red-200';
              else if (intensity <= 0.6) bgColor = 'bg-red-400';
              else bgColor = 'bg-red-600';
            } else if (category?.title === 'Personal Growth') {
              if (intensity <= 0.3) bgColor = 'bg-blue-200';
              else if (intensity <= 0.6) bgColor = 'bg-blue-400';
              else bgColor = 'bg-blue-600';
            } else if (category?.title === 'Financial') {
              if (intensity <= 0.3) bgColor = 'bg-green-200';
              else if (intensity <= 0.6) bgColor = 'bg-green-400';
              else bgColor = 'bg-green-600';
            } else if (category?.title === 'Relationships') {
              if (intensity <= 0.3) bgColor = 'bg-purple-200';
              else if (intensity <= 0.6) bgColor = 'bg-purple-400';
              else bgColor = 'bg-purple-600';
            } else if (category?.title === 'Community') {
              if (intensity <= 0.3) bgColor = 'bg-yellow-200';
              else if (intensity <= 0.6) bgColor = 'bg-yellow-400';
              else bgColor = 'bg-yellow-600';
            } else if (category?.title === 'Self-Care') {
              if (intensity <= 0.3) bgColor = 'bg-pink-200';
              else if (intensity <= 0.6) bgColor = 'bg-pink-400';
              else bgColor = 'bg-pink-600';
            } else {
              if (intensity <= 0.3) bgColor = 'bg-indigo-200';
              else if (intensity <= 0.6) bgColor = 'bg-indigo-400';
              else bgColor = 'bg-indigo-600';
            }
          }
          
          return (
            <div
              key={index}
              className={`${squareSize} ${bgColor} rounded-sm`}
              title={`${dateStr}: ${value} check-in${value !== 1 ? 's' : ''}`}
            />
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <Calendar className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading year progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Year Progress</h1>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setYear(year - 1)}
                className="p-2 hover:bg-gray-200 rounded transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <span className="text-2xl font-bold text-gray-900">{year}</span>
              <button
                onClick={() => setYear(year + 1)}
                className="p-2 hover:bg-gray-200 rounded transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm inline-flex">
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-md transition ${
                view === 'week' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-md transition ${
                view === 'month' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('year')}
              className={`px-4 py-2 rounded-md transition ${
                view === 'year' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        {/* Goal Grids */}
        <div className="space-y-4">
          {goals.map(goal => {
            const category = categories.find(c => c.id === goal.category_id);
            const completion = calculateYearCompletion(goal.id);
            const colorClasses = getCategoryColor(category?.title);

            return (
              <div key={goal.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${colorClasses}`}>
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">{category?.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{completion}%</div>
                    <div className="text-xs text-gray-500">
                      {goal.frequency === 'daily' && 'Daily goal'}
                      {goal.frequency === 'weekly' && `${goal.target_value}x per week`}
                      {goal.frequency === 'monthly' && `${goal.target_value}x per month`}
                      {goal.frequency === 'yearly' && `${goal.target_value}x per year`}
                    </div>
                  </div>
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                  {renderYearGrid(goal.id)}
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No goals yet. Create some goals to see your year progress!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearProgressView;