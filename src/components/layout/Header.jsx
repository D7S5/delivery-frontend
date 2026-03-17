import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeAccessToken } from "../../utils/token";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAccessToken();
    navigate("/login");
  };

  return (
    <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
      <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/stores">가게 목록</Link>
        <Link to="/orders">내 주문</Link>
        <Link to="/payments">결제</Link>
        {!isLoggedIn() ? (
          <>
            <Link to="/signup">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        ) : (
          <button onClick={handleLogout}>로그아웃</button>
        )}
      </nav>
    </header>
  );
}

export default Header;