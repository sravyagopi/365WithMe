import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const CategoryCard = ({ category, goalCount, onClick, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-indigo-300 relative"
    >
      <div onClick={onClick}>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {category.title}
        </h3>
        <p className="text-gray-600">
          {goalCount} {goalCount === 1 ? 'goal' : 'goals'}
        </p>
      </div>

      {showActions && !showConfirm && (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
            }}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {showConfirm && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-white p-4 rounded-lg border-2 border-red-300 flex flex-col justify-center"
        >
          <p className="text-sm text-red-800 mb-3">Delete "{category.title}"?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onDelete(category.id);
                setShowConfirm(false);
              }}
              className="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 px-3 py-1 bg-white text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryCard;