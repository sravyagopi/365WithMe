import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { progressService } from '../../services/progressService';

const ProgressGoalItem = ({ goal, frequency, onAddProgress }) => {
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, [goal.id]);

  const fetchProgress = async () => {
    try {
      const data = await progressService.getGoalProgress(goal.id);
      setProgress(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const getButtonLabel = () => {
    const labels = {
      weekly: '+ Add Session',
      monthly: '+ Log Activity',
      yearly: '+ Add Entry',
      custom: '+ I showed up today'
    };
    return labels[frequency] || '+ Add';
  };

  const handleSubmit = async () => {
    await onAddProgress(goal.id, 1, note);
    setNote('');
    setShowModal(false);
    fetchProgress(); // Refresh progress after adding
  };

  if (!progress) {
    return <div className="p-4 bg-white rounded-lg border-2 border-gray-200">Loading...</div>;
  }

  const percentage = progress.percentage || 0;

  return (
    <>
      <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">{goal.title}</h3>
            <p className="text-sm text-gray-600">
              {progress.current_value} / {progress.target_value} {progress.period_label}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
          >
            {getButtonLabel()}
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              percentage >= 100 ? 'bg-green-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{goal.title}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add a note (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows="3"
                placeholder="How did it go? Any thoughts or reflections..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Add Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProgressGoalItem;
