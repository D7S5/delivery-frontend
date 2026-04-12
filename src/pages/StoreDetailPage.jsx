import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoreDetail, deleteMenu } from "../api/storeApi";
import { addCartItem } from "../api/cartApi";
import PageLayout from "../components/layout/PageLayout";

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

  const applyDetail = (storeDetail) => {
    setDetail(storeDetail);

    const initialQuantities = {};
    storeDetail.menus.forEach((menu) => {
      initialQuantities[menu.id] = 1;
    });
    setQuantities(initialQuantities);
  };

  const fetchDetail = async () => {
    try {
      const result = await getStoreDetail(storeId);
      applyDetail(result);
    } catch (error) {
      alert(error.response?.data?.message || "가게 상세 조회 실패");
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const result = await getStoreDetail(storeId);
        applyDetail(result);
      } catch (error) {
        alert(error.response?.data?.message || "가게 상세 조회 실패");
      }
    };

    loadDetail();
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
    return <div className="loading-box">가게 정보를 불러오는 중입니다.</div>;
  }

  return (
    <PageLayout
      eyebrow="Store Detail"
      title={detail.store.name}
      description="메뉴 구성과 최소 주문 조건을 확인하고 바로 장바구니에 담을 수 있습니다."
      actions={
        <>
          <button className="secondary" onClick={moveToCreateMenuPage}>
            메뉴 등록
          </button>
          <button className="ghost" onClick={moveToCartPage}>
            장바구니 보기
          </button>
        </>
      }
    >
      <section className="detail-grid">
        <article className="surface-card">
          <span className="tag">Store Overview</span>
          <h2>{detail.store.name}</h2>
          <dl className="meta-list">
            <div>
              <dt>주소</dt>
              <dd>{detail.store.address}</dd>
            </div>
            <div>
              <dt>최소 주문 금액</dt>
              <dd>{Number(detail.store.minOrderAmount).toLocaleString()}원</dd>
            </div>
          </dl>
        </article>

        <aside className="surface-card">
          <span className="tag">Menus</span>
          <h2>{detail.menus.length}개 메뉴</h2>
          <p>수량을 지정해 바로 담을 수 있고, 매장 관리 용도로 수정과 삭제도 지원합니다.</p>
        </aside>
      </section>

      <section className="stack-lg">
        <div className="page-hero">
          <div>
            <p className="page-eyebrow">Menu Items</p>
            <h2>주문 가능한 메뉴</h2>
          </div>
        </div>

        {detail.menus.length === 0 ? (
          <div className="empty-state">
            <strong>등록된 메뉴가 없습니다.</strong>
            <p>상단의 메뉴 등록 버튼으로 첫 메뉴를 추가할 수 있습니다.</p>
          </div>
        ) : (
          <ul className="menu-list">
            {detail.menus.map((menu) => (
              <li className="menu-card" key={menu.id}>
                <div className="menu-header">
                  <div>
                    <div className="inline-row">
                      <h3>{menu.name}</h3>
                      {menu.soldOut ? <span className="sold-out">품절</span> : null}
                    </div>
                    <p className="menu-meta">{menu.description || "메뉴 설명이 아직 등록되지 않았습니다."}</p>
                  </div>
                  <strong className="menu-price">{Number(menu.price).toLocaleString()}원</strong>
                </div>

                <div className="inline-row">
                  <input
                    className="qty-input"
                    type="number"
                    min="1"
                    value={quantities[menu.id] || 1}
                    onChange={(e) => handleQuantityChange(menu.id, e.target.value)}
                  />

                  <button onClick={() => handleAddToCart(menu)} disabled={menu.soldOut}>
                    장바구니 담기
                  </button>
                  <button className="ghost" onClick={() => moveToEditMenuPage(menu.id)}>
                    수정
                  </button>
                  <button className="danger" onClick={() => handleDeleteMenu(menu.id)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageLayout>
  );
}

export default StoreDetailPage;
