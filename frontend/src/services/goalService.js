import apiService from './api';
import { API_ENDPOINTS } from '../config/api';

export const goalService = {
  getAll: async (includeInactive = false) => {
    const query = includeInactive ? '?include_inactive=true' : '';
    return apiService.get(`${API_ENDPOINTS.GOALS}${query}`);
  },

  getById: async (id) => {
    return apiService.get(`${API_ENDPOINTS.GOALS}/${id}`);
  },

  getByCategory: async (categoryId) => {
    return apiService.get(`${API_ENDPOINTS.GOALS}/category/${categoryId}`);
  },

  create: async (goalData) => {
    return apiService.post(API_ENDPOINTS.GOALS, goalData);
  },

  update: async (id, goalData) => {
    return apiService.put(`${API_ENDPOINTS.GOALS}/${id}`, goalData);
  },

  delete: async (id) => {
    return apiService.delete(`${API_ENDPOINTS.GOALS}/${id}`);
  },
};