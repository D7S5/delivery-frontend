import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../../src/api/paymentApi";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const handlePayment = async (paymentMethod) => {
    if (!orderId) {
      alert("결제할 주문이 없습니다.");
      return;
    }

    try {
      await createPayment({
        orderId,
        paymentMethod,
      });
      alert("결제 완료");
      navigate(`/orders/${orderId}`);
    } catch (error) {
      alert(error.response?.data?.message || "결제 실패");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>결제 페이지</h1>
      <p>주문번호: {orderId || "없음"}</p>

      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={() => handlePayment("CARD")}>카드 결제</button>
        <button onClick={() => handlePayment("KAKAO_PAY")}>카카오페이</button>
        <button onClick={() => handlePayment("CASH")}>현장 결제</button>
      </div>
    </div>
  );
}

export default PaymentPage;