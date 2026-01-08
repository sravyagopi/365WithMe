import apiService from './api';
import { API_ENDPOINTS } from '../config/api';

export const checkinService = {
  getToday: async () => {
    return apiService.get(`${API_ENDPOINTS.CHECKINS}/today`);
  },

  getByDate: async (date) => {
    return apiService.get(`${API_ENDPOINTS.CHECKINS}/date/${date}`);
  },

  getByGoal: async (goalId, startDate = null, endDate = null) => {
    let url = `${API_ENDPOINTS.CHECKINS}/goal/${goalId}`;
    const params = [];
    if (startDate) params.push(`start_date=${startDate}`);
    if (endDate) params.push(`end_date=${endDate}`);
    if (params.length) url += `?${params.join('&')}`;
    return apiService.get(url);
  },

  // ALWAYS creates a new check-in event (no update logic)
  create: async (goalId, value = 1, note = null, date = null) => {
    const checkInDate = date || getESTDate();
    return apiService.post(API_ENDPOINTS.CHECKINS, {
      goal_id: goalId,
      date: checkInDate,
      value: value,
      note: note
    });
  },

  delete: async (id) => {
    return apiService.delete(`${API_ENDPOINTS.CHECKINS}/${id}`);
  },
};

export function getESTDate() {
  const now = new Date();

  const estString = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);

  // Convert MM/DD/YYYY → YYYY-MM-DD
  const [month, day, year] = estString.split("/");
  return `${year}-${month}-${day}`;
}
