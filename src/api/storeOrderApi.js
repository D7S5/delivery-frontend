import api from "./axios";

// 내 가게 주문 목록 조회
export const getMyStoreOrders = async () => {
  const response = await api.get("/api/store/orders");
  return response.data;
};

// 내 가게 주문 상세 조회
export const getMyStoreOrderDetail = async (orderReceiveId) => {
  const response = await api.get(`/api/store/orders/${orderReceiveId}`);
  return response.data;
};

// 주문 접수 -> 준비중
export const startPreparingOrder = async (orderReceiveId) => {
  const response = await api.patch(`/api/store/orders/${orderReceiveId}/preparing`);
  return response.data;
};

// 준비중 -> 배달중
export const startDeliveryOrder = async (orderReceiveId) => {
  const response = await api.patch(`/api/store/orders/${orderReceiveId}/delivery`);
  return response.data;
};

// 배달중 -> 완료
export const completeStoreOrder = async (orderReceiveId) => {
  const response = await api.patch(`/api/store/orders/${orderReceiveId}/complete`);
  return response.data;
};

// 주문 취소
export const cancelStoreOrder = async (orderReceiveId) => {
  const response = await api.patch(`/api/store/orders/${orderReceiveId}/cancel`);
  return response.data;
};