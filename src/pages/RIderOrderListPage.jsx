import { useEffect, useState } from "react";
import {
  getRiderOrders,
  startDeliveryByRider,
  completeDeliveryByRider,
} from "../api/riderOrderApi";
import "../css/StoreOrderListPage.css";

function RiderOrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getRiderOrders();
      setOrders(result.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "라이더 주문 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStartDelivery = async (orderReceiveId) => {
    try {
      await startDeliveryByRider(orderReceiveId);
      alert("배달이 시작되었습니다.");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "배달 시작 실패");
    }
  };

  const handleCompleteDelivery = async (orderReceiveId) => {
    try {
      await completeDeliveryByRider(orderReceiveId);
      alert("배달이 완료되었습니다.");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "배달 완료 실패");
    }
  };

  if (loading) {
    return <div className="store-order-page">로딩 중...</div>;
  }

  return (
    <div className="store-order-page">
      <h1 className="store-order-title">라이더 주문 관리</h1>

      {orders.length === 0 ? (
        <div className="empty-box">배달할 주문이 없습니다.</div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div>
                  <h2>주문번호 #{order.orderId}</h2>
                  <p className="status">상태: {order.status}</p>
                </div>
              </div>

              <div className="order-body">
                <p><strong>주문자 이메일:</strong> {order.customerEmail}</p>
                <p><strong>가게명:</strong> {order.storeName}</p>
                <p><strong>배달주소:</strong> {order.deliveryAddress}</p>
                <p><strong>요청사항:</strong> {order.requestMessage || "-"}</p>
                <p><strong>총 금액:</strong> {order.totalAmount?.toLocaleString()}원</p>

                <div className="item-box">
                  <strong>주문 메뉴</strong>
                  <ul>
                    {order.items?.map((item, index) => (
                      <li key={index}>
                        {item.menuName} / {item.quantity}개 / {item.menuPrice?.toLocaleString()}원
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="order-footer">
                {order.status === "RECEIVE_ORDER" && (
                  <button className="action-btn done" disabled>
                    아직 가게가 주문을 준비하지 않았습니다
                  </button>
                )}

                {order.status === "PREPARING" && (
                  <button className="action-btn done" disabled>
                    가게가 준비 중입니다
                  </button>
                )}

                {order.status === "READY_FOR_DELIVERY" && (
                  <button
                    className="action-btn delivery"
                    onClick={() => handleStartDelivery(order.id)}
                  >
                    배달 시작
                  </button>
                )}

                {order.status === "DELIVERY" && (
                  <button
                    className="action-btn complete"
                    onClick={() => handleCompleteDelivery(order.id)}
                  >
                    배달 완료
                  </button>
                )}

                {order.status === "COMPLETED" && (
                  <button className="action-btn done" disabled>
                    완료된 주문
                  </button>
                )}

                {order.status === "CANCELED" && (
                  <button className="action-btn canceled" disabled>
                    취소된 주문
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RiderOrderListPage;