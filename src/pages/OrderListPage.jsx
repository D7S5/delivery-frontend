import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../src/api/orderApi";
import PageLayout from "../components/layout/PageLayout";

function OrderListPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getMyOrders();
        setOrders(result || []);
      } catch (error) {
        alert(error.response?.data?.message || "주문 목록 조회 실패");
      }
    };

    fetchOrders();
  }, []);

  return (
    <PageLayout
      eyebrow="Orders"
      title="내 주문 목록"
      description="생성된 주문의 상태를 확인하고, 상세 페이지에서 결제나 취소를 이어갈 수 있습니다."
    >
      {orders.length === 0 ? (
        <section className="empty-state">
          <strong>아직 생성된 주문이 없습니다.</strong>
          <p>매장 상세 화면에서 메뉴를 담고 장바구니에서 주문을 생성해보세요.</p>
        </section>
      ) : (
        <section className="order-grid">
          {orders.map((order) => (
            <Link className="order-card-clean" key={order.orderId} to={`/orders/${order.orderId}`}>
              <div className="order-head">
                <div>
                  <span className="tag">Order #{order.orderId}</span>
                  <h3>{order.storeName}</h3>
                </div>
                <span className="status-chip">{order.status}</span>
              </div>
              <p className="amount-text">{Number(order.totalAmount).toLocaleString()}원</p>
            </Link>
          ))}
        </section>
      )}
    </PageLayout>
  );
}

export default OrderListPage;
