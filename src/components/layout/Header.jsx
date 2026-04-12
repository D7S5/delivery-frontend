import { NavLink, useNavigate } from "react-router-dom";
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
    <header className="site-header">
      <div className="site-header-bar">
        <div className="brand-block">
          <NavLink className="brand-title" to="/stores">
            Delivery Frontend
          </NavLink>
          <span className="brand-subtitle">주문, 매장, 라이더 흐름을 한 화면에서 관리합니다.</span>
        </div>

        <nav className="site-nav">
          <NavLink
            to="/stores"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            가게 목록
          </NavLink>
          <NavLink
            to="/stores/new"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            가게 등록
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            내 주문
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            장바구니
          </NavLink>
          <NavLink
            to="/store/riderOrders"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            가게 주문 관리
          </NavLink>
          <NavLink
            to="/rider/orders"
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >
            라이더 주문 관리
          </NavLink>

          {!isLoggedIn() ? (
            <>
              <NavLink
                to="/signup"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                회원가입
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
              >
                로그인
              </NavLink>
            </>
          ) : (
            <button className="nav-link-button" type="button" onClick={handleLogout}>
              로그아웃
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
