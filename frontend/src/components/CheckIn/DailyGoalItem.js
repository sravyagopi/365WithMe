import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { checkinService } from '../../services/checkinService';

const DailyGoalItem = ({ goal, onToggle }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkTodayStatus();
  }, [goal.id]);

  const checkTodayStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const checkins = await checkinService.getByGoal(goal.id, today, today);
      setIsCompleted(checkins.length > 0);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleToggle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newStatus = !isCompleted;
      setIsCompleted(newStatus);
      
      if (newStatus) {
        // Create a check-in
        await checkinService.create(goal.id, 1, null);
      }
      // Note: We don't delete on uncheck to preserve history
      // If you want to allow deletion, you'd need to track the check-in ID
      
      await onToggle(goal.id, newStatus);
    } catch (error) {
      console.error('Error toggling check-in:', error);
      setIsCompleted(!isCompleted); // Revert on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
        loading ? 'opacity-50 cursor-wait' :
        isCompleted 
          ? 'bg-green-50 border-green-500' 
          : 'bg-white border-gray-200 hover:border-indigo-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
          isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-300'
        }`}>
          {isCompleted && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className="font-semibold text-gray-800">{goal.title}</span>
      </div>
    </div>
  );
};

export default DailyGoalItem;