import React, { useState } from 'react';

const AddGoalModal = ({ categories, selectedCategory, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    category_id: selectedCategory?.id || '',
    frequency: 'daily',
    target_value: 1
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.category_id) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Add New Goal</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Go to gym"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Frequency *
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="daily">Daily - Complete each day</option>
              <option value="weekly">Weekly - Target per week</option>
              <option value="monthly">Monthly - Target per month</option>
              <option value="yearly">Yearly - Annual target</option>
              <option value="custom">Custom - Free-form tracking</option>
            </select>
          </div>

          {formData.frequency !== 'daily' && formData.frequency !== 'custom' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Value *
              </label>
              <input
                type="number"
                min="1"
                value={formData.target_value}
                onChange={(e) => setFormData({...formData, target_value: parseInt(e.target.value)})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.frequency === 'weekly' && 'How many times per week?'}
                {formData.frequency === 'monthly' && 'How many times per month?'}
                {formData.frequency === 'yearly' && 'How many times per year?'}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Goal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGoalModal;
