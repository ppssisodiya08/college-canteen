import api from './api';

export const getStats = () => api.get('/dashboard/stats');
export const getRecentOrders = () => api.get('/dashboard/recent-orders');
export const getSalesData = () => api.get('/dashboard/sales');
export const getPopularFoods = () => api.get('/dashboard/popular-foods');
export const getOrderStatusBreakdown = () => api.get('/dashboard/order-status-breakdown');
