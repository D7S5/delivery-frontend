import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../api/cartApi";
import PageLayout from "../components/layout/PageLayout";

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    try {
      const result = await getCart();
      setCart(result);
    } catch (error) {
      alert(error.response?.data?.message || "장바구니 조회 실패");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (cartItemId, value) => {
    try {
      const quantity = Number(value);

      await updateCartItemQuantity(cartItemId, {
        quantity: quantity < 1 || isNaN(quantity) ? 1 : quantity,
      });

      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "수량 변경 실패");
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "항목 삭제 실패");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "장바구니 비우기 실패");
    }
  };

  const handleOrder = async () => {
    try {
      if (!cart || !cart.items || cart.items.length === 0) {
        alert("장바구니가 비어 있습니다.");
        return;
      }

      if (!address.trim()) {
        alert("배달 주소를 입력해주세요.");
        return;
      }

      const payload = {
        storeId: cart.storeId,
        storeName: cart.storeName,
        deliveryAddress: address,
        requestMessage: message,
        items: cart.items.map((item) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          menuPrice: item.menuPrice,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(payload);
      await clearCart();

      alert("주문 생성 완료");
      navigate(`/orders/${result.orderId}`);
    } catch (error) {
      alert(error.response?.data?.message || "주문 생성 실패");
    }
  };

  if (!cart) {
    return <div className="loading-box">장바구니를 불러오는 중입니다.</div>;
  }

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <PageLayout
      eyebrow="Cart"
      title="주문 전 마지막 확인"
      description="장바구니 수량을 조정하고 배달 주소와 요청사항을 입력한 뒤 주문을 생성할 수 있습니다."
    >
      {isEmpty ? (
        <section className="empty-state">
          <strong>장바구니가 비어 있습니다.</strong>
          <p>매장 상세 화면에서 메뉴를 담으면 이곳에서 주문을 이어갈 수 있습니다.</p>
        </section>
      ) : (
        <section className="detail-grid">
          <article className="surface-card">
            <span className="tag">{cart.storeName}</span>
            <h2>담아둔 메뉴</h2>
            <ul className="cart-list">
              {cart.items.map((item) => (
                <li className="menu-card" key={item.cartItemId}>
                  <div className="menu-header">
                    <div>
                      <h3>{item.menuName}</h3>
                      <p className="menu-meta">개당 {Number(item.menuPrice).toLocaleString()}원</p>
                    </div>
                    <strong className="menu-price">{Number(item.subTotal).toLocaleString()}원</strong>
                  </div>

                  <div className="inline-row">
                    <input
                      className="qty-input"
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.cartItemId, e.target.value)}
                    />
                    <button className="danger" onClick={() => handleRemove(item.cartItemId)}>
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <aside className="surface-card stack-md">
            <div>
              <span className="tag">Order Summary</span>
              <h2>주문 정보</h2>
            </div>

            <div className="summary-box">
              <div className="summary-row">
                <span>총 금액</span>
                <strong>{Number(cart.totalPrice).toLocaleString()}원</strong>
              </div>
            </div>

            <div className="field-row">
              <label htmlFor="delivery-address">배달 주소</label>
              <input
                id="delivery-address"
                placeholder="배달 주소를 입력하세요"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="field-row">
              <label htmlFor="delivery-message">요청사항</label>
              <input
                id="delivery-message"
                placeholder="예: 문 앞에 두고 가주세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="button-group">
              <button onClick={handleOrder}>전체 주문하기</button>
              <button className="ghost" onClick={handleClearCart}>
                장바구니 비우기
              </button>
            </div>
          </aside>
        </section>
      )}
    </PageLayout>
  );
}

export default CartPage;
