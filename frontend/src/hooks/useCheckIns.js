import { useState, useEffect } from 'react';
import { checkinService } from '../services/checkinService';

export const useCheckIns = (date = null) => {
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckIns = async () => {
    try {
      setLoading(true);
      const data = date 
        ? await checkinService.getByDate(date)
        : await checkinService.getToday();
      setCheckIns(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCheckIns([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheckIn = async (goalId, currentStatus) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await checkinService.createOrUpdate({
        goal_id: goalId,
        date: today,
        completed: !currentStatus,
      });
      await fetchCheckIns();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, [date]);

  return { checkIns, loading, error, fetchCheckIns, toggleCheckIn };
};

