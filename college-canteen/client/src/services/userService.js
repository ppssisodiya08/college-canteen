import api from './api';

export const getAllUsers = (params) => api.get('/users', { params });
export const getUserById = (id) => api.get(`/users/${id}`);
export const toggleUserStatus = (id) => api.patch(`/users/${id}/status`);
