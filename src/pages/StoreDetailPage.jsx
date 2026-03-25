import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreDetail, deleteMenu } from "../api/storeApi";
import { addCartItem } from "../api/cartApi";

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

  const moveToEditMenuPage = (menuId) => {
    navigate(`/stores/${storeId}/menus/${menuId}/edit`);
  };

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

  useEffect(() => {
    fetchDetail();
  }, [storeId]);

  const handleQuantityChange = (menuId, value) => {
    const numericValue = Number(value);
    setQuantities((prev) => ({
      ...prev,
      [menuId]: numericValue < 1 || isNaN(numericValue) ? 1 : numericValue,
    }));
  };

  const handleAddToCart = async (menu) => {
    if (!detail || !detail.store) {
      alert("가게 정보가 없습니다.");
      return;
    }

    try {
      const quantity = quantities[menu.id] || 1;

      const payload = {
        storeId: detail.store.id,
        storeName: detail.store.name,
        menuId: menu.id,
        menuName: menu.name,
        menuPrice: menu.price,
        quantity,
        replace: false,
      };

      await addCartItem(payload);
      alert("장바구니에 담았습니다.");
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        const ok = window.confirm(
          "이미 다른 가게 상품이 장바구니에 있습니다.\n기존 장바구니를 비우고 새로 담으시겠습니까?"
        );
        if (!ok) return;

        try {
          const quantity = quantities[menu.id] || 1;

          const payload = {
            storeId: detail.store.id,
            storeName: detail.store.name,
            menuId: menu.id,
            menuName: menu.name,
            menuPrice: menu.price,
            quantity,
            replace: true,
          };

          await addCartItem(payload);
          alert("기존 장바구니를 비우고 새로 담았습니다.");
        } catch (retryError) {
          alert(retryError.response?.data?.message || "장바구니 담기 실패");
        }
        return;
      }

      alert(message || "장바구니 담기 실패");
    }
  };

  const handleDeleteMenu = async (menuId) => {
    const ok = window.confirm("정말 이 메뉴를 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deleteMenu(storeId, menuId);
      alert("메뉴가 삭제되었습니다.");
      fetchDetail();
    } catch (error) {
      alert(error.response?.data?.message || "메뉴 삭제 실패");
    }
  };

  if (!detail) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <h1>{detail.store.name}</h1>

      <button onClick={moveToCreateMenuPage}>메뉴 등록하러 가기</button>
      <button onClick={moveToCartPage} style={{ marginLeft: "8px" }}>
        장바구니 보기
      </button>

      <p>주소: {detail.store.address}</p>
      <p>최소주문금액: {detail.store.minOrderAmount}원</p>

      <h2>메뉴</h2>

      <ul>
        {detail.menus.map((menu) => (
          <li key={menu.id} style={{ marginBottom: "16px" }}>
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

              <button
                onClick={() => moveToEditMenuPage(menu.id)}
                style={{ marginLeft: "8px" }}
              >
                수정
              </button>

              <button
                onClick={() => handleDeleteMenu(menu.id)}
                style={{ marginLeft: "8px" }}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoreDetailPage;