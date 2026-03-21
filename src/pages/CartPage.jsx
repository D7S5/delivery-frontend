import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "../api/cartApi";

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
      navigate(`/orders/${result.data.orderId}`);
    } catch (error) {
      alert(error.response?.data?.message || "주문 생성 실패");
    }
  };

  if (!cart) {
    return <div style={{ padding: "24px" }}>로딩 중...</div>;
  }

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <div style={{ padding: "24px" }}>
      <h1>장바구니</h1>

      {isEmpty ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <h3>가게: {cart.storeName}</h3>

          <ul>
            {cart.items.map((item) => (
              <li key={item.cartItemId} style={{ marginBottom: "16px" }}>
                <div>
                  {item.menuName} / {item.menuPrice}원
                </div>

                <div style={{ marginTop: "8px" }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.cartItemId, e.target.value)
                    }
                    style={{ width: "60px", marginRight: "8px" }}
                  />

                  <span style={{ marginRight: "8px" }}>
                    소계: {item.subTotal}원
                  </span>

                  <button onClick={() => handleRemove(item.cartItemId)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <hr />

          <h3>총 금액: {cart.totalPrice}원</h3>

          <div style={{ marginTop: "16px", marginBottom: "16px" }}>
            <input
              placeholder="배달 주소"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ display: "block", marginBottom: "8px", width: "320px" }}
            />
            <input
              placeholder="요청사항"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ display: "block", width: "320px" }}
            />
          </div>

          <button onClick={handleOrder} style={{ marginRight: "8px" }}>
            전체 주문하기
          </button>

          <button onClick={handleClearCart}>장바구니 비우기</button>
        </>
      )}
    </div>
  );
}

export default CartPage;