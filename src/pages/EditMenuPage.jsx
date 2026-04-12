import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStoreDetail, updateMenu } from "../api/storeApi";
import PageLayout from "../components/layout/PageLayout";

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
        const menus = result?.menus || [];

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
    return <div className="loading-box">메뉴 정보를 불러오는 중입니다.</div>;
  }

  return (
    <PageLayout
      eyebrow="Owner Tools"
      title="메뉴 수정"
      description="메뉴 정보와 품절 상태를 함께 관리할 수 있습니다."
      narrow
    >
      <section className="surface-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label htmlFor="edit-menu-name">메뉴 이름</label>
            <input
              id="edit-menu-name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="메뉴 이름"
            />
          </div>

          <div className="field-row">
            <label htmlFor="edit-menu-price">가격</label>
            <input
              id="edit-menu-price"
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="가격"
            />
          </div>

          <div className="field-row">
            <label htmlFor="edit-menu-description">메뉴 설명</label>
            <textarea
              id="edit-menu-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="메뉴 설명"
              rows={4}
            />
          </div>

          <label className="checkbox-row" htmlFor="edit-menu-sold-out">
            <input
              id="edit-menu-sold-out"
              type="checkbox"
              name="soldOut"
              checked={form.soldOut}
              onChange={handleChange}
            />
            품절 여부
          </label>

          <div className="button-group">
            <button type="submit">수정 완료</button>
            <button
              className="ghost"
              type="button"
              onClick={() => navigate(`/stores/${storeId}`)}
            >
              취소
            </button>
          </div>
        </form>
      </section>
    </PageLayout>
  );
}

export default EditMenuPage;
