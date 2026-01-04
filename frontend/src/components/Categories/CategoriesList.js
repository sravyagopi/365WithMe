import React from 'react';
import { Plus } from 'lucide-react';
import CategoryCard from './CategoryCard';

const CategoriesList = ({ categories, goals, onCategoryClick, onAddCategory }) => {
  const getGoalCountByCategory = (categoryId) => {
    return goals.filter(g => g.category_id === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              goalCount={getGoalCountByCategory(category.id)}
              onClick={() => onCategoryClick(category)}
            />
          ))}
          
          <div
            onClick={onAddCategory}
            className="bg-indigo-50 p-6 rounded-lg border-2 border-dashed border-indigo-300 hover:border-indigo-400 transition cursor-pointer flex items-center justify-center"
          >
            <div className="text-center">
              <Plus className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-indigo-600 font-semibold">Add Category</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesList;
