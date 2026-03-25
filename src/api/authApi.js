import api from "./axios";

export const signUp = async (payload) => {
  const response = await api.post("/api/users/signup", payload);
  return response.data;
};

export const login = async (payload) => {
  const response = await api.post("/api/users/login", payload);
  return response.data;
};

export const logout = async (payload) => {
  const response = await api.post("/api/users/logout", payload)
  return response.data;
}