import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import PageLayout from "../components/layout/PageLayout";

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
    <PageLayout
      eyebrow="Account"
      title="새 계정을 생성하세요"
      description="고객, 점주, 라이더 역할 중 하나를 선택해 동일한 도메인 안에서 기능을 테스트할 수 있습니다."
      narrow
    >
      <section className="auth-card">
        <h2>회원가입</h2>
        <p>역할에 따라 접근 가능한 주문 흐름이 달라집니다.</p>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label htmlFor="signup-email">이메일</label>
            <input id="signup-email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="field-row">
            <label htmlFor="signup-password">비밀번호</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="field-row">
            <label htmlFor="signup-name">이름</label>
            <input id="signup-name" name="name" placeholder="이름" value={form.name} onChange={handleChange} />
          </div>
          <div className="field-row">
            <label htmlFor="signup-role">역할</label>
            <select id="signup-role" name="role" value={form.role} onChange={handleChange}>
              <option value="CUSTOMER">CUSTOMER</option>
              <option value="OWNER">OWNER</option>
              <option value="RIDER">RIDER</option>
            </select>
          </div>
          <button type="submit">회원가입</button>
        </form>
        <p className="auth-switch">
          이미 계정이 있다면 <Link to="/login">로그인</Link>으로 이동하세요.
        </p>
      </section>
    </PageLayout>
  );
}

export default SignupPage;
