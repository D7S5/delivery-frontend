import api from "./axios";

export const getRiderOrders = async () => {
  const response = await api.get("/api/rider/orders");
  return response.data;
};

export const startDeliveryByRider = async (orderReceiveId) => {
  const response = await api.patch(`/api/rider/orders/${orderReceiveId}/delivery`);
  return response.data;
};

export const completeDeliveryByRider = async (orderReceiveId) => {
  const response = await api.patch(`/api/rider/orders/${orderReceiveId}/complete`);
  return response.data;
};

export const acceptDispatch = async (assignmentId) => {
  const response = await api.patch(`/api/rider/dispatch/${assignmentId}/accept`);
  return response.data;
};

export const rejectDispatch = async (assignmentId) => {
  const response = await api.patch(`/api/rider/dispatch/${assignmentId}/reject`);
  return response.data;
};