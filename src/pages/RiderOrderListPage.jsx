import { useEffect, useRef, useState } from "react";
import {
  getAvailableRiderOrders,
  acceptRiderOrder,
  getMyRiderOrders,
  completeRiderOrder,
  setRiderOnline,
  setRiderOffline,
  getRiderMyStatus,
  updateRiderLocation,
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

  const watchIdRef = useRef(null);

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

  // 온라인 상태일 때 위치 추적 시작
  useEffect(() => {
    if (!riderOnline || !navigator.geolocation) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          await updateRiderLocation(lat, lng);
          console.log("위치 업데이트 성공", lat, lng);
        } catch (error) {
          console.error("위치 업데이트 실패", error);
        }
      },
      (error) => {
        console.error("위치 추적 실패", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [riderOnline]);

  const handleOnline = async () => {
    try {
      setStatusChanging(true);

      if (!navigator.geolocation) {
        alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            console.log("실제 위치 전송", lat, lng);

            await setRiderOnline(lat, lng);
            await fetchRiderStatus();
            alert("라이더가 온라인 상태로 전환되었습니다.");
          } catch (error) {
            alert(error.response?.data?.message || "온라인 전환 실패");
          } finally {
            setStatusChanging(false);
          }
        },
        (error) => {
          console.error("위치 조회 실패", error);
          alert("위치 권한을 허용해야 온라인 전환이 가능합니다.");
          setStatusChanging(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error(error);
      alert("온라인 전환 실패");
      setStatusChanging(false);
    }
  };

  const handleOffline = async () => {
    try {
      setStatusChanging(true);

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

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

      setMyOrders((prev) => prev.filter((order) => order.id !== orderReceiveId));

      alert("배달 완료 처리되었습니다.");
      await fetchAll();
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
                    disabled={acceptingId === order.id || riderStatus !== "ONLINE"}
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
              const isCompleted =
                completedOrderIds.includes(order.id) || order.status === "COMPLETED";

              const statusLabel =
                order.status === "COMPLETED"
                  ? "배달 완료"
                  : order.status === "DELIVERING"
                  ? "배달 중"
                  : order.status === "DELIVERY"
                  ? "배달 중"
                  : order.status;

              return (
                <div className="order-card" key={order.id}>
                  <div className="order-header">
                    <div>
                      <h3>주문번호 #{order.orderId}</h3>
                      <p className={`status ${isCompleted ? "done" : "delivering"}`}>
                        상태: {statusLabel || "배달 중"}
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
                        {completingId === order.id ? "처리 중..." : "배달 완료"}
                      </button>
                    ) : (
                      <button className="action-btn done" disabled>
                        {statusLabel}
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