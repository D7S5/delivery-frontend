import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../../src/api/paymentApi";
import PageLayout from "../components/layout/PageLayout";

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
    <PageLayout
      eyebrow="Payment"
      title="결제 수단 선택"
      description="생성된 주문에 대해 결제 방식을 선택하고 바로 상태를 갱신할 수 있습니다."
      narrow
    >
      <section className="surface-card stack-md">
        <div>
          <span className="tag">Order Reference</span>
          <h2>주문번호 {orderId || "없음"}</h2>
          <p>결제 완료 후 주문 상세 화면으로 돌아갑니다.</p>
        </div>
        <div className="button-group">
          <button onClick={() => handlePayment("CARD")}>카드 결제</button>
          <button className="secondary" onClick={() => handlePayment("KAKAO_PAY")}>
            카카오페이
          </button>
          <button className="ghost" onClick={() => handlePayment("CASH")}>
            현장 결제
          </button>
        </div>
      </section>
    </PageLayout>
  );
}

export default PaymentPage;
