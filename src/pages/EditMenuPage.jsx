import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoreDetail, updateMenu } from "../api/storeApi";

function EditMenuPage() {
  const { storeId, menuId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    soldOut: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const result = await getStoreDetail(storeId);
        const menus = result.data?.menus || [];

        const targetMenu = menus.find(
          (menu) => String(menu.id) === String(menuId)
        );

        if (!targetMenu) {
          alert("수정할 메뉴를 찾을 수 없습니다.");
          navigate(`/stores/${storeId}`);
          return;
        }

        setForm({
          name: targetMenu.name || "",
          price: targetMenu.price || "",
          description: targetMenu.description || "",
          soldOut: targetMenu.soldOut ?? false,
        });
      } catch (error) {
        alert(error.response?.data?.message || "메뉴 정보 조회 실패");
        navigate(`/stores/${storeId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [storeId, menuId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        soldOut: form.soldOut,
      };

      await updateMenu(storeId, menuId, payload);
      alert("메뉴 수정이 완료되었습니다.");
      navigate(`/stores/${storeId}`);
    } catch (error) {
      alert(error.response?.data?.message || "메뉴 수정 실패");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="page-container">
      <h1>메뉴 수정</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>메뉴 이름</label>
          <br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="메뉴 이름"
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>가격</label>
          <br />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="가격"
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>메뉴 설명</label>
          <br />  
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="메뉴 설명"
            rows={4}
            cols={40}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>
            <input
              type="checkbox"
              name="soldOut"
              checked={form.soldOut}
              onChange={handleChange}
            />
            품절 여부
          </label>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit">수정 완료</button>
          <button
            type="button"
            onClick={() => navigate(`/stores/${storeId}`)}
            style={{ marginLeft: "8px" }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditMenuPage;