import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../src/api/authApi";
import { saveAccessToken } from "../utils/token";
import PageLayout from "../components/layout/PageLayout";

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
      saveAccessToken(result.accessToken);
      alert("로그인 성공");
      navigate("/stores");
    } catch (error) {
      alert(error.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <PageLayout
      eyebrow="Account"
      title="서비스에 로그인"
      description="주문 내역, 장바구니, 가게 관리 기능을 이용하려면 먼저 로그인해야 합니다."
      narrow
    >
      <section className="auth-card">
        <h2>로그인</h2>
        <p>계정 인증 후 바로 매장 탐색 화면으로 이동합니다.</p>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label htmlFor="email">이메일</label>
            <input id="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="field-row">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">로그인</button>
        </form>
        <p className="auth-switch">
          아직 계정이 없다면 <Link to="/signup">회원가입</Link>으로 이동하세요.
        </p>
      </section>
    </PageLayout>
  );
}

export default LoginPage;
