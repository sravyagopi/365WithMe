// src/components/Calendar/YearCalendar.js - Debugged Version
import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const YearCalendar = ({ year, onDayClick }) => {
  const [calendarData, setCalendarData] = useState({});
  const [maxCheckins, setMaxCheckins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCalendarData();
  }, [year]);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8000/progress/calendar/${year}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Calendar data received:', data);
      
      setCalendarData(data.calendar || {});
      
      // Find max check-ins for color scaling
      const counts = Object.values(data.calendar || {});
      const max = counts.length > 0 ? Math.max(...counts) : 0;
      setMaxCheckins(max);
      
      console.log('Max checkins:', max);
      console.log('Calendar entries:', Object.keys(data.calendar || {}).length);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      setError(error.message);
      setCalendarData({});
    } finally {
      setLoading(false);
    }
  };

  const getColorForCount = (count) => {
    if (!count || count === 0) return 'bg-gray-100';
    
    const intensity = count / Math.max(maxCheckins, 1);
    
    if (intensity <= 0.25) return 'bg-indigo-200';
    if (intensity <= 0.5) return 'bg-indigo-400';
    if (intensity <= 0.75) return 'bg-indigo-600';
    return 'bg-indigo-800';
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const renderMonth = (monthIndex) => {
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const firstDay = getFirstDayOfMonth(year, monthIndex);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const count = calendarData[dateStr] || 0;
      const colorClass = getColorForCount(count);

      days.push(
        <div
          key={day}
          onClick={() => count > 0 && onDayClick(dateStr)}
          className={`w-8 h-8 ${colorClass} rounded ${count > 0 ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500' : ''} transition flex items-center justify-center text-xs font-semibold`}
          title={count > 0 ? `${dateStr}: ${count} check-in${count !== 1 ? 's' : ''}` : dateStr}
        >
          {count > 0 && <span className="text-white">{count}</span>}
        </div>
      );
    }

    return (
      <div key={monthIndex} className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">{months[monthIndex]}</h3>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500 font-semibold">
              {d}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const handleYearChange = (newYear) => {
    onDayClick(newYear);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-indigo-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error loading calendar: {error}</p>
            <button
              onClick={fetchCalendarData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-indigo-600" />
            Year Calendar
          </h1>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleYearChange(year - 1)}
              className="p-2 hover:bg-gray-200 rounded transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-2xl font-bold text-gray-900">{year}</span>
            <button
              onClick={() => handleYearChange(year + 1)}
              className="p-2 hover:bg-gray-200 rounded transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold">Activity Level:</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded border border-gray-300"></div>
            <span>None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-200 rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-400 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-600 rounded"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-800 rounded"></div>
            <span>Very High</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {months.map((_, index) => renderMonth(index))}
        </div>
      </div>
    </div>
  );
};

export default YearCalendar;