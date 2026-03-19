import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createMenu } from "../api/storeApi";

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
    <div style={{ padding: "24px" }}>
      <h1>메뉴 등록</h1>
      <p>가게 ID: {storeId}</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "400px",
        }}
      >
        <input
          name="name"
          placeholder="메뉴 이름"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="price"
          type="number"
          placeholder="가격"
          value={form.price}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="메뉴 설명"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">메뉴 등록</button>
      </form>
    </div>
  );
}

export default CreateMenuPage;