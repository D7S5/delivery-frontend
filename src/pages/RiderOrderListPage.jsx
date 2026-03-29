import { useEffect, useState } from "react";
import {
  getAvailableRiderOrders,
  acceptRiderOrder,
  getMyRiderOrders,
  completeRiderOrder,
  setRiderOnline,
  setRiderOffline,
  getRiderMyStatus,
} from "../api/riderOrderApi";
import "../css/RiderOrderListPage.css";

function RiderOrderListPage() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [completingId, setCompletingId] = useState(null);
  const [completedOrderIds, setCompletedOrderIds] = useState([]);
  const [riderOnline, setRiderOnlineState] = useState(false);
  const [riderStatus, setRiderStatus] = useState("OFFLINE");
  const [statusChanging, setStatusChanging] = useState(false);

  const fetchRiderStatus = async () => {
    try {
      const result = await getRiderMyStatus();
      const data = result?.data;

      if (data) {
        setRiderStatus(data.status);
        setRiderOnlineState(data.online);
      }
    } catch (error) {
      console.error("라이더 상태 조회 실패", error);
      setRiderStatus("OFFLINE");
      setRiderOnlineState(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const [availableResult, myResult] = await Promise.allSettled([
        getAvailableRiderOrders(),
        getMyRiderOrders(),
      ]);

      if (availableResult.status === "fulfilled") {
        setAvailableOrders(availableResult.value?.data || []);
      } else {
        setAvailableOrders([]);
      }

      if (myResult.status === "fulfilled") {
        setMyOrders(myResult.value?.data || []);
      } else {
        setMyOrders([]);
      }
    } catch (error) {
      alert(error.response?.data?.message || "라이더 주문 목록 조회 실패");
    }
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchRiderStatus()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    const interval = setInterval(() => {
      fetchOrders();
      fetchRiderStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleOnline = async () => {
    try {
      setStatusChanging(true);

      const success = (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setRiderOnline(lat, lng)
          .then(async () => {
            await fetchRiderStatus();
            alert("라이더가 온라인 상태로 전환되었습니다.");
          })
          .catch((error) => {
            alert(error.response?.data?.message || "온라인 전환 실패");
          })
          .finally(() => {
            setStatusChanging(false);
          });
      };

      const fail = async () => {
        try {
          await setRiderOnline(37.5665, 126.9780);
          await fetchRiderStatus();
          alert("위치 권한이 없어 기본 좌표로 온라인 전환했습니다.");
        } catch (error) {
          alert(error.response?.data?.message || "온라인 전환 실패");
          setStatusChanging(false);
        } finally {
        }
      };

      if (!navigator.geolocation) {
        await fail();
        return;
      }

      navigator.geolocation.getCurrentPosition(success, fail, {
        enableHighAccuracy: true,
        timeout: 5000,
      });
    } catch (error) {
      setStatusChanging(false);
      alert("온라인 전환 실패");
    }
  };

  const handleOffline = async () => {
    try {
      setStatusChanging(true);
      await setRiderOffline();
      await fetchRiderStatus();
      alert("라이더가 오프라인 상태로 전환되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "오프라인 전환 실패");
    } finally {
      setStatusChanging(false);
    }
  };

  const handleAccept = async (orderReceiveId) => {
    const ok = window.confirm("이 주문을 수락하시겠습니까?");
    if (!ok) return;

    try {
      setAcceptingId(orderReceiveId);
      await acceptRiderOrder(orderReceiveId);
      await fetchAll();
      alert("주문을 수락했습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "주문 수락 실패");
    } finally {
      setAcceptingId(null);
    }
  };

  const handleComplete = async (orderReceiveId) => {
    const ok = window.confirm("배달 완료 처리하시겠습니까?");
    if (!ok) return;

    try {
      setCompletingId(orderReceiveId);
      await completeRiderOrder(orderReceiveId);

      setCompletedOrderIds((prev) => [...prev, orderReceiveId]);
      setMyOrders((prev) =>
        prev.map((order) =>
          order.id === orderReceiveId
            ? { ...order, status: "COMPLETED" }
            : order
        )
      );

      await fetchAll();
      alert("배달 완료 처리되었습니다.");
    } catch (error) {
      alert(error.response?.data?.message || "배달 완료 처리 실패");
    } finally {
      setCompletingId(null);
    }
  };

  const renderItems = (items) => {
    if (!items || items.length === 0) {
      return <p className="rider-empty-item">주문 메뉴 정보가 없습니다.</p>;
    }

    return (
      <ul>
        {items.map((item, index) => (
          <li key={`${item.menuName}-${index}`}>
            {item.menuName} / {item.quantity}개 /{" "}
            {item.menuPrice?.toLocaleString?.() ??
              item.itemTotalPrice?.toLocaleString?.() ??
              0}
            원
          </li>
        ))}
      </ul>
    );
  };

  const getStatusLabel = () => {
    if (riderStatus === "DELIVERING") return "배달 중";
    if (riderStatus === "ONLINE") return "온라인";
    return "오프라인";
  };

  if (loading) {
    return <div className="rider-order-page">로딩 중...</div>;
  }

  return (
    <div className="rider-order-page">
      <h1 className="rider-order-title">라이더 주문 관리</h1>

      <section className="rider-status-box">
        <div>
          <h2 className="rider-status-title">라이더 상태</h2>
          <p className={riderOnline ? "rider-on-text" : "rider-off-text"}>
            현재 상태: {getStatusLabel()}
          </p>
        </div>

        <div className="rider-status-actions">
          <button
            className="action-btn online"
            onClick={handleOnline}
            disabled={statusChanging || riderStatus === "ONLINE" || riderStatus === "DELIVERING"}
          >
            {statusChanging && riderStatus !== "ONLINE" ? "변경 중..." : "온라인"}
          </button>

          <button
            className="action-btn offline"
            onClick={handleOffline}
            disabled={statusChanging || riderStatus === "OFFLINE" || riderStatus === "DELIVERING"}
          >
            {statusChanging && riderStatus === "ONLINE" ? "변경 중..." : "오프라인"}
          </button>
        </div>
      </section>

      <section className="rider-section">
        <div className="rider-section-header">
          <h2>배차 가능한 주문</h2>
          <button className="refresh-btn" onClick={fetchAll}>
            새로고침
          </button>
        </div>

        {availableOrders.length === 0 ? (
          <div className="empty-box">현재 수락 가능한 주문이 없습니다.</div>
        ) : (
          <div className="order-list">
            {availableOrders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-header">
                  <div>
                    <h3>주문번호 #{order.orderId}</h3>
                    <p className="status dispatching">
                      상태: {order.status || "DISPATCHING"}
                    </p>
                  </div>
                </div>

                <div className="order-body">
                  <p><strong>가게명:</strong> {order.storeName}</p>
                  <p><strong>배달주소:</strong> {order.deliveryAddress}</p>
                  <p><strong>요청사항:</strong> {order.requestMessage || "-"}</p>
                  <p><strong>총 금액:</strong> {order.totalAmount?.toLocaleString?.() ?? 0}원</p>

                  <div className="item-box">
                    <strong>주문 메뉴</strong>
                    {renderItems(order.items)}
                  </div>
                </div>

                <div className="order-footer">
                  <button
                    className="action-btn accept"
                    onClick={() => handleAccept(order.id)}
                    disabled={
                      acceptingId === order.id ||
                      riderStatus !== "ONLINE"
                    }
                  >
                    {acceptingId === order.id ? "수락 중..." : "주문 수락"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rider-section">
        <div className="rider-section-header">
          <h2>내가 맡은 배달</h2>
        </div>

        {myOrders.length === 0 ? (
          <div className="empty-box">현재 진행 중인 내 배달이 없습니다.</div>
        ) : (
          <div className="order-list">
            {myOrders.map((order) => {
              const isCompleted = completedOrderIds.includes(order.id);

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <div>
                      <h3>주문번호 #{order.orderId}</h3>
                      <p className="status delivering">
                        상태: {order.status || "DELIVERY"}
                      </p>
                    </div>
                  </div>

                  <div className="order-body">
                    <p><strong>가게명:</strong> {order.storeName}</p>
                    <p><strong>배달주소:</strong> {order.deliveryAddress}</p>
                    <p><strong>요청사항:</strong> {order.requestMessage || "-"}</p>
                    <p><strong>총 금액:</strong> {order.totalAmount?.toLocaleString?.() ?? 0}원</p>

                    <div className="item-box">
                      <strong>주문 메뉴</strong>
                      {renderItems(order.items)}
                    </div>
                  </div>

                  <div className="order-footer">
                    {order.status === "DELIVERY" || order.status === "DELIVERING" ? (
                      <button
                        className="action-btn complete"
                        onClick={() => handleComplete(order.id)}
                        disabled={completingId === order.id || isCompleted}
                      >
                        {completingId === order.id
                          ? "처리 중..."
                          : isCompleted
                          ? "배달 완료됨"
                          : "배달 완료"}
                      </button>
                    ) : (
                      <button className="action-btn done" disabled>
                        {order.status}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default RiderOrderListPage;