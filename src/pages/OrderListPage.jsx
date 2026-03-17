import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../../src/api/orderApi";

function OrderListPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getMyOrders();
        setOrders(result.data || []);
      } catch (error) {
        alert(error.response?.data?.message || "주문 목록 조회 실패");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "24px" }}>
      <h1>내 주문 목록</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            <Link to={`/orders/${order.orderId}`}>
              주문번호 {order.orderId} / {order.storeName} / {order.totalAmount}원 / {order.status}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderListPage;