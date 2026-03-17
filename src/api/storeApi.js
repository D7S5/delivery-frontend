import api from "./axios";

export const getStores = async () => {
  const response = await api.get("/api/stores");
  return response.data;
};

export const getStoreDetail = async (storeId) => {
  const response = await api.get(`/api/stores/${storeId}`);
  return response.data;
};

export const createStore = async (payload) => {
  const response = await api.post("/api/stores", payload);
  return response.data;
};

export const createMenu = async (storeId, payload) => {
  const response = await api.post(`/api/stores/${storeId}/menus`, payload);
  return response.data;
};