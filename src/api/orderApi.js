import api from "./axios";

export const createOrder = async (payload) => {
  const response = await api.post("/api/orders", payload);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/api/orders/my");
  return response.data;
};

export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/api/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.post(`/api/orders/${orderId}/cancel`);
  return response.data;
};