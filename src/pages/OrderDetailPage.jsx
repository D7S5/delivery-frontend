import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { cancelOrder, getOrderDetail } from "../../src/api/orderApi";

function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const result = await getOrderDetail(orderId);
      setOrder(result.data);
    } catch (error) {
      alert(error.response?.data?.message || "주문 상세 조회 실패");
    }
  };

  useEffect(() => {
    fetchOrder();
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

  if (!order) return <div style={{ padding: "24px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>주문 상세</h1>
      <p>주문번호: {order.orderId}</p>
      <p>가게명: {order.storeName}</p>
      <p>배달주소: {order.deliveryAddress}</p>
      <p>총금액: {order.totalAmount}원</p>
      <p>상태: {order.status}</p>

      <h2>주문 상품</h2>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.menuName} / {item.quantity}개 / {item.itemTotalPrice}원
          </li>
        ))}
      </ul>

      {order.status === "CREATED" && (
        <div style={{ marginTop: "16px" }}>
          <button onClick={handleCancel}>주문 취소</button>
          <button onClick={handleGoPayment} style={{ marginLeft: "8px" }}>
            결제하기
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetailPage;