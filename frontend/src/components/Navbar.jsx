import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo Transparent.png";
import LoginModal from "./LoginModal";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showDropdown, setShowDropdown] = useState(false);
  const { totalItems, fetchCart } = useCart();

  // Sync token state on auth-change
  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("auth-change", syncToken);
    window.addEventListener("open-login", () => setShowLogin(true));
    return () => {
      window.removeEventListener("auth-change", syncToken);
      window.removeEventListener("open-login", () => setShowLogin(true));
    };
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#navbar")) {
        setIsOpen(false);
        setIsSubOpen(false);
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setShowDropdown(false);
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <>
      <nav id="navbar">
        {/* 1. Hamburger */}
        <div id="nav-mob-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </div>

        {/* 2. Logo */}
        <Link to="/">
        <div id="logo">
          <img src={logo} alt="Toffee Table Logo" />
        </div></Link>

        {/* 3. Links (Drawer) */}
        <div id="nav-links" className={isOpen ? "open" : ""}>
          <ul className="nav-main-links">
            {/* Mobile Profile Section moved to bottom as per user request */}

            <hr className="mobile-only drawer-divider" />

            <li>
              <Link to="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-house"></i>
                Home
              </Link>
            </li>

            <li
              className={`menu-item ${isSubOpen ? "active" : ""}`}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  e.stopPropagation();
                  setIsSubOpen(!isSubOpen);
                }
              }}
            >
              <span className="menu-title no-underline">
                <i className="fa-solid fa-utensils"></i>
                <Link to="/menu" onClick={(e) => { if(window.innerWidth > 768) setIsOpen(false); else e.preventDefault(); }}>Menu</Link>
                <i className="fa-solid fa-chevron-down"></i>
              </span>

              <ul className="dropdown">
                <div className="dropdown-content">
                  <li>
                    <Link to="/menu/cakes" onClick={() => setIsOpen(false)}>
                      <i className="fa-solid fa-cake-candles"></i>
                      Cakes
                    </Link>
                  </li>
                  <li>
                    <Link to="/menu/brownies" onClick={() => setIsOpen(false)}>
                      <i className="fa-solid fa-cookie"></i>
                      Brownies
                    </Link>
                  </li>
                  <li>
                    <Link to="/menu/cupcakes" onClick={() => setIsOpen(false)}>
                      <i className="fa-solid fa-ice-cream"></i>
                      Cupcakes
                    </Link>
                  </li>
                  <li>
                    <Link to="/menu/pastries" onClick={() => setIsOpen(false)}>
                      <i className="fa-solid fa-bread-slice"></i>
                      Pastries
                    </Link>
                  </li>
                </div>
              </ul>
            </li>

            <li>
              <Link to="/" className="mobile-nav-link" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-image"></i>
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/" className="mobile-nav-link contact-finish" onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-envelope"></i>
                Contact
              </Link>
            </li>

            {/* Bottom Mobile Account Buttons */}
            <li className="mobile-only mobile-account-section">
              <hr className="mobile-account-divider" />
              {!token ? (
                <button className="mobile-account-btn login-full" onClick={() => { setShowLogin(true); setIsOpen(false); }}>
                  <i className="fa-solid fa-user-plus"></i>
                  Login / Sign Up
                </button>
              ) : (
                <div className="mobile-account-row">
                  <button className="mobile-account-btn profile" onClick={() => { navigate("/profile"); setIsOpen(false); }}>
                    <i className="fa-solid fa-circle-user"></i>
                    Profile
                  </button>
                  <button className="mobile-account-btn logout-small" onClick={() => { handleLogout(); setIsOpen(false); }}>
                    <i className="fa-solid fa-power-off"></i>
                    Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* 4. Icons */}
        <div id="nav-icons">
          {/* User Icon - Desktop Only */}
          <div className="user-wrapper desktop-only">
            <i
              className="fa-solid fa-user user-icon"
              onClick={() => {
                if (!token) {
                  setShowLogin(true);
                } else {
                  setShowDropdown((prev) => !prev);
                }
              }}
            ></i>

            {token && showDropdown && (
              <div className="user-dropdown">
                <div className="user-dropdown-content">
                  <div className="dropdown-arrow"></div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowDropdown(false);
                    }}
                  >
                    <i className="fa-solid fa-user"></i>
                    My Profile
                  </button>


                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon - Always visible, right side on mobile */}
          <i
            className="fa-solid fa-cart-shopping cart-icon"
            onClick={() => window.dispatchEvent(new Event("open-cart"))}
          ></i>
        </div>
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <LoginModal
          closeModal={() => setShowLogin(false)}
          setToken={setToken}
        />
      )}
    </>
  );
}

export default Navbar;
