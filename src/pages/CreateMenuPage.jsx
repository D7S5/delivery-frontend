import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createMenu } from "../api/storeApi";
import PageLayout from "../components/layout/PageLayout";

function CreateMenuPage() {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
      };

      await createMenu(storeId, payload);

      alert("메뉴 등록이 완료되었습니다.");
      navigate(`/stores/${storeId}`);
    } catch (error) {
      alert(error.response?.data?.message || "메뉴 등록 실패");
    }
  };

  return (
    <PageLayout
      eyebrow="Owner Tools"
      title="새 메뉴 등록"
      description={`가게 ID ${storeId}에 연결될 메뉴 정보를 입력합니다.`}
      narrow
    >
      <section className="surface-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label htmlFor="menu-name">메뉴 이름</label>
            <input
              id="menu-name"
              name="name"
              placeholder="메뉴 이름"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="field-row">
            <label htmlFor="menu-price">가격</label>
            <input
              id="menu-price"
              name="price"
              type="number"
              placeholder="가격"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div className="field-row">
            <label htmlFor="menu-description">메뉴 설명</label>
            <input
              id="menu-description"
              name="description"
              placeholder="메뉴 설명"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit">메뉴 등록</button>
        </form>
      </section>
    </PageLayout>
  );
}

export default CreateMenuPage;
