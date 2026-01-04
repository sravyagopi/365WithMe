import apiService from './api';
import { API_ENDPOINTS } from '../config/api';

export const categoryService = {
  getAll: async () => {
    return apiService.get(API_ENDPOINTS.CATEGORIES);
  },

  getById: async (id) => {
    return apiService.get(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },

  create: async (categoryData) => {
    return apiService.post(API_ENDPOINTS.CATEGORIES, categoryData);
  },

  update: async (id, categoryData) => {
    return apiService.put(`${API_ENDPOINTS.CATEGORIES}/${id}`, categoryData);
  },

  delete: async (id) => {
    return apiService.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
  },
};
