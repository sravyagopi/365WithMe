import apiService from './api';
import { API_ENDPOINTS } from '../config/api';

export const progressService = {
  // Get progress grouped by frequency (all or specific)
  getByFrequency: async (frequency = null) => {
    const url = frequency 
      ? `${API_ENDPOINTS.PROGRESS}/by-frequency?frequency=${frequency}`
      : `${API_ENDPOINTS.PROGRESS}/by-frequency`;
    return apiService.get(url);
  },

  // Get progress for a specific goal
  getGoalProgress: async (goalId) => {
    return apiService.get(`${API_ENDPOINTS.PROGRESS}/goal/${goalId}`);
  },

  // Get year calendar data
  getYearCalendar: async (year = null) => {
    const url = year 
      ? `${API_ENDPOINTS.PROGRESS}/calendar/${year}`
      : `${API_ENDPOINTS.PROGRESS}/calendar`;
    return apiService.get(url);
  },

  // Get details for a specific day
  getDayDetails: async (date) => {
    return apiService.get(`${API_ENDPOINTS.PROGRESS}/day/${date}`);
  },
};

