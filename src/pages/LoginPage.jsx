import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../src/api/authApi";
import { saveAccessToken } from "../utils/token";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login(form);
      saveAccessToken(result.data.accessToken);
      alert("로그인 성공");
      navigate("/stores");
    } catch (error) {
      alert(error.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px" }}>
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;