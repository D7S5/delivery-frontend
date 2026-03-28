import { useEffect, useState } from "react";
import {
  getMyStoreOrders,
  startPreparingOrder,
  markReadyForDelivery,
  cancelStoreOrder,
} from "../api/storeOrderApi";
import "../css/StoreOrderListPage.css";

function RiderStoreListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getMyStoreOrders();
      setOrders(result.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "주문 목록 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePreparing = async (orderReceiveId) => {
    try {
      await startPreparingOrder(orderReceiveId);
      alert("주문이 준비중으로 변경되었습니다.");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "주문 준비 상태 변경 실패");
    }
  };

  const handleReady = async (orderReceiveId) => {
    try {
      await markReadyForDelivery(orderReceiveId);
      alert("배달 준비 완료 상태로 변경되었습니다.");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "배달 준비 완료 상태 변경 실패");
    }
  };

  const handleCancel = async (orderReceiveId) => {
    const ok = window.confirm("정말 주문을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await cancelStoreOrder(orderReceiveId);
      alert("주문이 취소되었습니다.");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "주문 취소 실패");
    }
  };

  if (loading) {
    return <div className="store-order-page">로딩 중...</div>;
  }

  return (
    <div className="store-order-page">
      <h1 className="store-order-title">가게 주문 관리</h1>

      {orders.length === 0 ? (
        <div className="empty-box">들어온 주문이 없습니다.</div>
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
                  <>
                    <button
                      className="action-btn preparing"
                      onClick={() => handlePreparing(order.id)}
                    >
                      주문을 준비합니다
                    </button>

                    <button
                      className="action-btn cancel"
                      onClick={() => handleCancel(order.id)}
                    >
                      주문 취소
                    </button>
                  </>
                )}

                {order.status === "PREPARING" && (
                  <button
                    className="action-btn ready"
                    onClick={() => handleReady(order.id)}
                  >
                    조리 완료 / 라이더 배차 요청
                  </button>
                )}

                {order.status === "READY_FOR_DELIVERY" && (
                  <button className="action-btn done" disabled>
                    라이더 배차 중입니다
                  </button>
                )}

                {order.status === "DELIVERY" && (
                  <button className="action-btn done" disabled>
                    라이더가 배달 중입니다
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

export default RiderStoreListPage;