import { useState, useEffect } from 'react';
import { goalService } from '../services/goalService';

export const useGoals = (categoryId = null) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const data = categoryId 
        ? await goalService.getByCategory(categoryId)
        : await goalService.getAll();
      setGoals(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData) => {
    try {
      await goalService.create(goalData);
      await fetchGoals();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      await goalService.update(id, goalData);
      await fetchGoals();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteGoal = async (id) => {
    try {
      await goalService.delete(id);
      await fetchGoals();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [categoryId]);

  return { goals, loading, error, fetchGoals, addGoal, updateGoal, deleteGoal };
};
