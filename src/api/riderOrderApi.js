import api from "./axios";

// 배차 가능한 주문 목록 조회
export const getAvailableRiderOrders = async () => {
  const response = await api.get("/api/rider/orders/available");
  return response.data;
};

// 라이더가 주문 수락
export const acceptRiderOrder = async (orderReceiveId) => {
  const response = await api.patch(`/api/rider/orders/${orderReceiveId}/accept`);
  return response.data;
};

// 내가 수락한 배달 목록 조회 (선택)
export const getMyRiderOrders = async () => {
  const response = await api.get("/api/rider/orders/my");
  return response.data;
};

// 배달 완료 처리 (선택)
export const completeRiderOrder = async (orderReceiveId) => {
  const response = await api.patch(`/api/rider/orders/${orderReceiveId}/complete`);
  return response.data;
};

export const setRiderOnline = async (lat, lng) => {
  const response = await api.post("/api/rider/online", {
    lat,
    lng,
  });
  return response.data;
};

export const setRiderOffline = async () => {
  const response = await api.post("/api/rider/offline");
  return response.data;
};