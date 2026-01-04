import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';

const DayDetailModal = ({ date, onClose }) => {
  const [dayData, setDayData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDayDetails();
  }, [date]);

  const fetchDayDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/progress/day/${date}`);
      const data = await response.json();
      setDayData(data);
    } catch (error) {
      console.error('Error fetching day details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!date) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h2>
              {dayData && (
                <p className="text-sm text-gray-600">
                  {dayData.total_checkins} check-in{dayData.total_checkins !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading...</div>
        ) : dayData && dayData.checkins.length > 0 ? (
          <div className="space-y-4">
            {dayData.checkins.map((checkin) => (
              <div key={checkin.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">{checkin.goal_title}</h3>
                  <span className="text-sm text-gray-500">
                    {checkin.goal_frequency}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="font-medium">Progress: {checkin.value}</span>
                  <span>•</span>
                  <span>{new Date(checkin.created_at).toLocaleTimeString()}</span>
                </div>
                {checkin.note && (
                  <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 italic">
                    "{checkin.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No check-ins recorded for this day.
          </div>
        )}
      </div>
    </div>
  );
};

export default DayDetailModal;