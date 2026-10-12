import api from './api';

export const getFoods = (params) => api.get('/foods', { params });
export const getFoodById = (id) => api.get(`/foods/${id}`);
export const createFood = (data) =>
  api.post('/foods', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateFood = (id, data) =>
  api.put(`/foods/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteFood = (id) => api.delete(`/foods/${id}`);
export const toggleAvailability = (id) => api.patch(`/foods/${id}/availability`);
