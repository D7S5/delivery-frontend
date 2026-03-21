import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreDetail } from "../../src/api/storeApi";
import { addToCart } from "../../src/utils/cartStorage";

function StoreDetailPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [quantities, setQuantities] = useState({});

  const moveToCreateMenuPage = () => {
    navigate(`/stores/${storeId}/menus/new`);
  };

  const moveToCartPage = () => {
    navigate("/cart");
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await getStoreDetail(storeId);
        setDetail(result.data);

        const initialQuantities = {};
        result.data.menus.forEach((menu) => {
          initialQuantities[menu.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        alert(error.response?.data?.message || "가게 상세 조회 실패");
      }
    };

    fetchDetail();
  }, [storeId]);

  const handleQuantityChange = (menuId, value) => {
    const numericValue = Number(value);

    setQuantities((prev) => ({
      ...prev,
      [menuId]: numericValue < 1 || isNaN(numericValue) ? 1 : numericValue,
    }));
  };

  const handleAddToCart = (menu) => {
    const quantity = quantities[menu.id] || 1;

    addToCart({
      storeId: detail.store.id,
      storeName: detail.store.name,
      menuId: menu.id,
      menuName: menu.name,
      menuPrice: menu.price,
      quantity,
    });

    alert("장바구니에 담았습니다.");
  };

  if (!detail) return <div style={{ padding: "24px" }}>로딩 중...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>{detail.store.name}</h1>

      <button onClick={moveToCreateMenuPage} style={{ marginRight: "8px" }}>
        메뉴 등록하러 가기
      </button>
      <button onClick={moveToCartPage}>장바구니 보기</button>

      <p>주소: {detail.store.address}</p>
      <p>최소주문금액: {detail.store.minOrderAmount}원</p>

      <h2>메뉴</h2>
      <ul>
        {detail.menus.map((menu) => (
          <li key={menu.id} style={{ marginBottom: "12px" }}>
            <div>
              {menu.name} / {menu.price}원 / {menu.description}
            </div>

            <div style={{ marginTop: "8px" }}>
              <input
                type="number"
                min="1"
                value={quantities[menu.id] || 1}
                onChange={(e) => handleQuantityChange(menu.id, e.target.value)}
                style={{ width: "60px", marginRight: "8px" }}
              />

              <button onClick={() => handleAddToCart(menu)}>
                장바구니 담기
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoreDetailPage;