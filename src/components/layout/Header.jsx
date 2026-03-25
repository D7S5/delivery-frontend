import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeAccessToken } from "../../utils/token";
import { clearCart } from "../../utils/cartStorage";
import { logout } from "../../api/authApi";

function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("로그아웃 요청 실패:", error);
    } finally {
      removeAccessToken();
      clearCart();
      navigate("/login");
    }
  };


  return (
    <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
      <nav style={{ display: "flex", gap: "12px" }}>
        <Link to="/stores">가게 목록</Link>
        <Link to="/stores/new">가게 등록</Link>
        <Link to="/orders">내 주문</Link>
        <Link to="/payments">결제</Link>
        <Link to="/store/orders">가게 주문 관리</Link>

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