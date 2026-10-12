import api from './api';

export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/my-orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);
export const getAllOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status, orderStatus: status });
export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);
