import React, { useState, useEffect } from 'react';
import { categoryService } from './services/categoryService';
import { goalService } from './services/goalService';
import { checkinService } from './services/checkinService';
import { progressService } from './services/progressService';

import WelcomeScreen from './components/Welcome/WelcomeScreen';
import CategoriesList from './components/Categories/CategoriesList';
import CategoryCard from './components/Categories/CategoryCard';
import GoalCard from './components/Goals/GoalCard';
import NewCheckInScreen from './components/CheckIn/NewCheckInScreen';
import NewProgressScreen from './components/Progress/NewProgressScreen';
import YearCalendar from './components/Calendar/YearCalendar';
import DayDetailModal from './components/Calendar/DayDetailModal';
import AddGoalModal from './components/Modals/AddGoalModal';
import EditGoalModal from './components/Modals/EditGoalModal';
import AddCategoryModal from './components/Modals/AddCategoryModal';
import EditCategoryModal from './components/Modals/EditCategoryModal';
import BottomNav from './components/Navigation/BottomNav';
import { Plus } from 'lucide-react';

const App = () => {
  const [currentView, setCurrentView] = useState('welcome');
  const [categories, setCategories] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  
  // Modal states
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showEditGoal, setShowEditGoal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchGoals();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchGoals = async () => {
    try {
      const data = await goalService.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setGoals([]);
    }
  };

  const fetchProgressData = async () => {
    try {
      const data = await progressService.getByFrequency();
      setProgressData(data);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgressData({});
    }
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
    if (view === 'progress') fetchProgressData();
    if (view === 'checkin') fetchGoals();
  };

  const handleAddCategory = async (categoryData) => {
    try {
      await categoryService.create(categoryData);
      await fetchCategories();
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    }
  };

  const handleEditCategory = async (categoryId, categoryData) => {
    try {
      await categoryService.update(categoryId, categoryData);
      await fetchCategories();
      setShowEditCategory(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error editing category:', error);
      alert('Failed to edit category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryService.delete(categoryId);
      await fetchCategories();
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleAddGoal = async (goalData) => {
    try {
      await goalService.create(goalData);
      await fetchGoals();
      setShowAddGoal(false);
    } catch (error) {
      console.error('Error adding goal:', error);
      alert('Failed to add goal');
    }
  };

  const handleEditGoal = async (goalId, goalData) => {
    try {
      await goalService.update(goalId, goalData);
      await fetchGoals();
      setShowEditGoal(false);
      setEditingGoal(null);
    } catch (error) {
      console.error('Error editing goal:', error);
      alert('Failed to edit goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await goalService.delete(goalId);
      await fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal');
    }
  };

  const handleToggleDaily = async (goalId, completed) => {
    try {
      if (completed) {
        await checkinService.create(goalId, 1, null);
      }
      // We don't delete on uncheck to preserve history
    } catch (error) {
      console.error('Error toggling daily check-in:', error);
    }
  };

  const handleAddProgress = async (goalId, value, note) => {
    try {
      await checkinService.create(goalId, value, note);
      await fetchProgressData();
    } catch (error) {
      console.error('Error adding progress:', error);
      alert('Failed to add progress');
    }
  };

  const handleDayClick = (date) => {
    if (typeof date === 'number') {
      // Year change
      setCalendarYear(date);
    } else {
      // Day clicked
      setSelectedDate(date);
    }
  };

  const getGoalCountByCategory = (categoryId) => {
    return goals.filter(g => g.category_id === categoryId).length;
  };

  return (
    <div className="pb-20">
      {currentView === 'welcome' && (
        <WelcomeScreen onStartDay={() => handleNavigate('categories')} />
      )}
      
      {currentView === 'categories' && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Categories</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  goalCount={getGoalCountByCategory(category.id)}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentView('categoryGoals');
                  }}
                  onEdit={(cat) => {
                    setEditingCategory(cat);
                    setShowEditCategory(true);
                  }}
                  onDelete={handleDeleteCategory}
                />
              ))}
              
              <div
                onClick={() => setShowAddCategory(true)}
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
      )}
      
      {currentView === 'categoryGoals' && (
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setCurrentView('categories')}
              className="text-indigo-600 mb-4 hover:text-indigo-700"
            >
              ← Back to Categories
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {selectedCategory?.title}
            </h1>

            <div className="space-y-4 mb-6">
              {goals
                .filter(g => g.category_id === selectedCategory?.id)
                .map(goal => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={(g) => {
                      setEditingGoal(g);
                      setShowEditGoal(true);
                    }}
                    onDelete={handleDeleteGoal}
                  />
                ))}
            </div>

            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Goal
            </button>
          </div>
        </div>
      )}
      
      {currentView === 'checkin' && (
        <NewCheckInScreen
          goals={goals}
          onAddProgress={handleAddProgress}
          onToggleDaily={handleToggleDaily}
          onNavigateToCategories={() => handleNavigate('categories')}
        />
      )}
      
      {currentView === 'progress' && (
        <NewProgressScreen progressData={progressData} />
      )}
      
      {currentView === 'calendar' && (
        <YearCalendar 
          year={calendarYear}
          onDayClick={handleDayClick}
        />
      )}
      
      {/* Modals */}
      {showAddGoal && (
        <AddGoalModal
          categories={categories}
          selectedCategory={selectedCategory}
          onSubmit={handleAddGoal}
          onClose={() => setShowAddGoal(false)}
        />
      )}
      
      {showEditGoal && editingGoal && (
        <EditGoalModal
          goal={editingGoal}
          categories={categories}
          onSubmit={handleEditGoal}
          onClose={() => {
            setShowEditGoal(false);
            setEditingGoal(null);
          }}
        />
      )}
      
      {showAddCategory && (
        <AddCategoryModal
          onSubmit={handleAddCategory}
          onClose={() => setShowAddCategory(false)}
        />
      )}
      
      {showEditCategory && editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onSubmit={handleEditCategory}
          onClose={() => {
            setShowEditCategory(false);
            setEditingCategory(null);
          }}
        />
      )}
      
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
      
      {currentView !== 'welcome' && (
        <BottomNav 
          currentView={currentView} 
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
};

export default App;