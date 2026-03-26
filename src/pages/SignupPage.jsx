import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "CUSTOMER",
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
      await signUp(form);
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px" }}>
        <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} />
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="CUSTOMER">CUSTOMER</option>
          <option value="OWNER">OWNER</option>
          <option value="RIDER">RIDER</option>
        </select>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupPage;