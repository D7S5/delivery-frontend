import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreDetail } from "../../src/api/storeApi";
import { createOrder } from "../../src/api/orderApi";

function StoreDetailPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await getStoreDetail(storeId);
        setDetail(result.data);
      } catch (error) {
        alert(error.response?.data?.message || "가게 상세 조회 실패");
      }
    };

    fetchDetail();
  }, [storeId]);

  const handleOrder = async (menu) => {
    try {
      const payload = {
        storeId: detail.store.id,
        storeName: detail.store.name,
        deliveryAddress: address,
        requestMessage: message,
        items: [
          {
            menuId: menu.id,
            menuName: menu.name,
            menuPrice: menu.price,
            quantity: 1,
          },
        ],
      };

      const result = await createOrder(payload);
      alert("주문 생성 완료");
      navigate(`/orders/${result.data.orderId}`);
    } catch (error) {
      alert(error.response?.data?.message || "주문 생성 실패");
    }
  };

  if (!detail) return <div style={{ padding: "24px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>{detail.store.name}</h1>
      <p>주소: {detail.store.address}</p>
      <p>최소주문금액: {detail.store.minOrderAmount}원</p>

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

      <h2>메뉴</h2>
      <ul>
        {detail.menus.map((menu) => (
          <li key={menu.id} style={{ marginBottom: "12px" }}>
            {menu.name} / {menu.price}원 / {menu.description}
            <button onClick={() => handleOrder(menu)} style={{ marginLeft: "8px" }}>
              주문하기
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoreDetailPage;