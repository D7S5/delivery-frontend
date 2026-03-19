import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStore } from "../api/storeApi";

function CreateStorePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    minOrderAmount: "",
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
        address: form.address,
        phoneNumber: form.phoneNumber,
        minOrderAmount: Number(form.minOrderAmount),
      };

      const result = await createStore(payload);

      alert("가게 등록이 완료되었습니다.");
      navigate(`/stores/${result.data.id}/menus/new`);
    } catch (error) {
      alert(error.response?.data?.message || "가게 등록 실패");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>가게 등록</h1>

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
          placeholder="가게 이름"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="가게 주소"
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="phoneNumber"
          placeholder="전화번호"
          value={form.phoneNumber}
          onChange={handleChange}
        />

        <input
          name="minOrderAmount"
          type="number"
          placeholder="최소 주문 금액"
          value={form.minOrderAmount}
          onChange={handleChange}
        />

        <button type="submit">가게 등록</button>
      </form>
    </div>
  );
}

export default CreateStorePage;