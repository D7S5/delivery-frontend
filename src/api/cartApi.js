import api from "./axios";

export const getCart = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};

export const addCartItem = async (payload) => {
  const response = await api.post("/api/cart/items", payload);
  return response.data;
};

export const updateCartItemQuantity = async (cartItemId, payload) => {
  const response = await api.patch(`/api/cart/items/${cartItemId}`, payload);
  return response.data;
};

export const removeCartItem = async (cartItemId) => {
  const response = await api.delete(`/api/cart/items/${cartItemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/api/cart");
  return response.data;
};