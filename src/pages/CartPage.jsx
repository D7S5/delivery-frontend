import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import {
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getCartTotalPrice,
} from "../utils/cartStorage";

function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const loadCart = () => {
    setCart(getCart());
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleQuantityChange = (menuId, storeId, value) => {
    const quantity = Number(value);
    updateCartItemQuantity(menuId, storeId, quantity < 1 || isNaN(quantity) ? 1 : quantity);
    loadCart();
  };

  const handleRemove = (menuId, storeId) => {
    removeCartItem(menuId, storeId);
    loadCart();
  };

  const handleOrder = async () => {
    try {
      if (cart.length === 0) {
        alert("장바구니가 비어 있습니다.");
        return;
      }

      if (!address.trim()) {
        alert("배달 주소를 입력해주세요.");
        return;
      }

      const firstStoreId = cart[0].storeId;
      const isSameStore = cart.every((item) => item.storeId === firstStoreId);

      if (!isSameStore) {
        alert("한 번에 같은 가게 메뉴만 주문할 수 있습니다.");
        return;
      }

      const payload = {
        storeId: cart[0].storeId,
        storeName: cart[0].storeName,
        deliveryAddress: address,
        requestMessage: message,
        items: cart.map((item) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          menuPrice: item.menuPrice,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(payload);
      clearCart();
      alert("주문 생성 완료");
      navigate(`/orders/${result.data.orderId}`);
    } catch (error) {
      alert(error.response?.data?.message || "주문 생성 실패");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>장바구니</h1>

      {cart.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={`${item.storeId}-${item.menuId}`} style={{ marginBottom: "16px" }}>
                <div>
                  [{item.storeName}] {item.menuName} / {item.menuPrice}원
                </div>

                <div style={{ marginTop: "8px" }}>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.menuId, item.storeId, e.target.value)
                    }
                    style={{ width: "60px", marginRight: "8px" }}
                  />

                  <span style={{ marginRight: "8px" }}>
                    소계: {item.menuPrice * item.quantity}원
                  </span>

                  <button onClick={() => handleRemove(item.menuId, item.storeId)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <hr />

          <h3>총 금액: {getCartTotalPrice()}원</h3>

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
          <button
            onClick={() => {
              clearCart();
              loadCart();
            }}
          >
            장바구니 비우기
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;