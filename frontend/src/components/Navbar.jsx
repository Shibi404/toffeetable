import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/Logo Transparent.png";
import LoginModal from "./LoginModal";

function Navbar() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubOpen, setIsSubOpen] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showDropdown, setShowDropdown] = useState(false);

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
  };

  return (
    <>
      <nav id="navbar">
        {/* 1. Hamburger */}
        <div id="nav-mob-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </div>

        {/* 2. Logo */}
        <div id="logo">
          <img src={logo} alt="Toffee Table Logo" />
        </div>

        {/* 3. Links */}
        <div id="nav-links" className={isOpen ? "open" : ""}>
          <ul className="nav-main-links">
            <li><Link to="/">Home</Link></li>

            <li
              className={`menu-item ${isSubOpen ? "active" : ""}`}
              onClick={(e) => {
                if (window.innerWidth <= 768) {
                  e.stopPropagation();
                  setIsSubOpen(!isSubOpen);
                }
              }}
            >
              <span className="menu-title">
                <Link to="/menu">Menu</Link>
                <i className="fa-solid fa-chevron-down"></i>
              </span>

              <ul className="dropdown">
                <li><Link to="/menu/cakes">Cakes</Link></li>
                <li><Link to="/menu/brownies">Brownies</Link></li>
                <li><Link to="/menu/cupcakes">Cupcakes</Link></li>
                <li><Link to="/menu/pastries">Pastries</Link></li>
              </ul>
            </li>

            <li><Link to="/">Gallery</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </div>

        {/* 4. Cart + User */}
        <div id="nav-icons">
          {/* ✅ SAME USER ICON ALWAYS */}
          <div className="user-wrapper">
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

            {/* ✅ DROPDOWN AFTER LOGIN */}
            {token && showDropdown && (
              <div className="user-dropdown">
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

                <hr className="dropdown-divider" />

                <button className="logout-btn" onClick={handleLogout}>
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Logout
                </button>
              </div>
            )}
          </div>
          <i
            className="fa-solid fa-cart-shopping cart-icon"
            onClick={() => navigate("/cart")}
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
