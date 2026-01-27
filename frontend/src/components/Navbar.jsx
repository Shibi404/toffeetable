import { useState, useEffect } from "react";
import logo from "../assets/images/Logo Transparent.png";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile Hamburger
  const [isSubOpen, setIsSubOpen] = useState(false); // Menu Dropdown

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#navbar")) {
        setIsOpen(false);
        setIsSubOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <nav id="navbar">
      {/* 1. Hamburger Icon */}
      <div id="nav-mob-icon" onClick={() => setIsOpen(!isOpen)}>
        <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </div>

      {/* 2. Logo */}
      <div id="logo">
        <img src={logo} alt="Toffee Table Logo" />
      </div>

      {/* 3. Links Container - MUST HAVE THE CLASS "open" */}
      <div id="nav-links" className={isOpen ? "open" : ""}>
        <ul className="nav-main-links">
          <li><a href="/">Home</a></li>

          {/* Submenu Trigger - MUST HAVE THE CLASS "active" */}
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
              Menu <i className="fa-solid fa-chevron-down"></i>
            </span>

            <ul className="dropdown">
              <li><a href="/menu/cakes">Cakes</a></li>
              <li><a href="/menu/brownies">Brownies</a></li>
              <li><a href="/menu/cupcakes">Cupcakes</a></li>
              <li><a href="/menu/pastries">Pastries</a></li>
            </ul>
          </li>

          <li><a href="/">Gallery</a></li>
          <li><a href="/">Contact</a></li>
        </ul>
      </div>

      {/* 4. Cart */}
      <div id="nav-icons">
        <i className="fa-solid fa-cart-shopping"></i>
      </div>
    </nav>
  );
}

export default Navbar;