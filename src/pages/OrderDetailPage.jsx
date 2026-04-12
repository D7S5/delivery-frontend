import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderDetail } from "../../src/api/orderApi";
import PageLayout from "../components/layout/PageLayout";

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const result = await getOrderDetail(orderId);
      setOrder(result);
    } catch (error) {
      alert(error.response?.data?.message || "주문 상세 조회 실패");
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const result = await getOrderDetail(orderId);
        setOrder(result);
      } catch (error) {
        alert(error.response?.data?.message || "주문 상세 조회 실패");
      }
    };

    loadOrder();
  }, [orderId]);

  const handleCancel = async () => {
    try {
      await cancelOrder(orderId);
      alert("주문 취소 완료");
      fetchOrder();
    } catch (error) {
      alert(error.response?.data?.message || "주문 취소 실패");
    }
  };

  const handleGoPayment = () => {
    navigate("/payments", { state: { orderId: Number(orderId) } });
  };

  if (!order) return <div className="loading-box">주문 상세를 불러오는 중입니다.</div>;

  return (
    <PageLayout
      eyebrow="Order Detail"
      title={`주문 #${order.orderId}`}
      description="주문 상태와 배달 정보를 확인하고, 생성 직후라면 결제 또는 취소를 진행할 수 있습니다."
      actions={
        order.status === "CREATED" ? (
          <>
            <button className="danger" onClick={handleCancel}>
              주문 취소
            </button>
            <button className="secondary" onClick={handleGoPayment}>
              결제하기
            </button>
          </>
        ) : null
      }
    >
      <section className="detail-grid">
        <article className="surface-card">
          <span className="status-chip">{order.status}</span>
          <h2>{order.storeName}</h2>
          <dl className="meta-list">
            <div>
              <dt>배달 주소</dt>
              <dd>{order.deliveryAddress}</dd>
            </div>
            <div>
              <dt>총 금액</dt>
              <dd>{Number(order.totalAmount).toLocaleString()}원</dd>
            </div>
          </dl>
        </article>

        <aside className="surface-card">
          <span className="tag">Items</span>
          <h2>주문 상품</h2>
          <ul className="simple-list">
            {order.items.map((item) => (
              <li className="summary-box" key={item.id}>
                <div className="summary-row">
                  <strong>{item.menuName}</strong>
                  <span>{item.quantity}개</span>
                </div>
                <div className="summary-row">
                  <span>합계</span>
                  <strong>{Number(item.itemTotalPrice).toLocaleString()}원</strong>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </PageLayout>
  );
}

export default OrderDetailPage;
