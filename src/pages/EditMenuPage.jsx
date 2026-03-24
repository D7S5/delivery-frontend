// src/pages/EditMenuPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoreDetail, updateMenu } from "../api/storeApi";

function EditMenuPage() {
  const { storeId, menuId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [soldOut, setSoldOut] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await getStoreDetail(storeId);

        // 가게 상세 응답 안에 menus가 있다고 가정
        const menus = result.data.menus || [];
        const targetMenu = menus.find((menu) => String(menu.id) === String(menuId));

        if (!targetMenu) {
          alert("메뉴를 찾을 수 없습니다.");
          navigate(`/stores/${storeId}`);
          return;
        }

        setName(targetMenu.name || "");
        setDescription(targetMenu.description || "");
        setPrice(targetMenu.price || "");
        setSoldOut(targetMenu.soldOut || false);
      } catch (error) {
        alert(error.response?.data?.message || "메뉴 정보 조회 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [storeId, menuId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name,
        description,
        price: Number(price),
        soldOut,
      };

      await updateMenu(storeId, menuId, payload);

      alert("메뉴 수정 완료");
      navigate(`/stores/${storeId}`);
    } catch (error) {
      alert(error.response?.data?.message || "메뉴 수정 실패");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div style={{ padding: "24px" }}>
      <h2>메뉴 수정</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px" }}>
        <input
          type="text"
          placeholder="메뉴명"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>
          <input
            type="checkbox"
            checked={soldOut}
            onChange={(e) => setSoldOut(e.target.checked)}
          />
          품절 여부
        </label>

        <button type="submit">수정하기</button>
      </form>
    </div>
  );
}

export default EditMenuPage;