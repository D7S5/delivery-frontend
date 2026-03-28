import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeAccessToken } from "../../utils/token";
import { clearCart } from "../../utils/cartStorage";

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeAccessToken();
    clearCart();
    navigate("/login");
  };

  return (
    <header>
      <nav>
        <Link to="/stores">가게 목록</Link>
        <Link to="/stores/new">가게 등록</Link>
        <Link to="/orders">내 주문</Link>
        <Link to="/payment">결제</Link>
        {/* <Link to="/store/orders">가게 주문 관리</Link> */}
        <Link to="/store/riderOrders">가게 주문 관리</Link>
        <Link to="/rider/orders">라이더 주문 관리</Link>
        
        {!isLoggedIn() ? (
          <>
            <Link to="/signup">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        ) : (
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;