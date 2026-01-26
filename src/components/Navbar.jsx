import { useState, useEffect } from "react";
import logo from "../assets/images/Logo Transparent.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#navbar")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header id="header">
      <nav id="navbar">
        <div id="nav-mob-icon">
          {!open ? (
            <i
              className="fa-solid fa-bars"
              style={{ color: "#5c4033", fontSize: "20px" }}
              onClick={() => setOpen(true)}
            ></i>
          ) : (
            <i
              className="fa-solid fa-xmark"
              style={{ color: "#5c4033", fontSize: "23px" }}
              onClick={() => setOpen(false)}
            ></i>
          )}
        </div>

        <div id="logo">
          <img src={logo} alt="Toffee Table Logo" />
        </div>

        <div
          id="nav-links"
          style={{ maxHeight: open ? "280px" : "0px" }}
        >
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Menu</a></li>
            <li><a href="/">Gallery</a></li>
            <li><a href="/">Contact</a></li>
          </ul>
        </div>

        <div id="nav-icons">
          <ul>
            <li>
              <a href="/">
                <i className="fa-solid fa-cart-shopping" style={{ color: "#5c4033" }}></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
