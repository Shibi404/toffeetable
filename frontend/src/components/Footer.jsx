import { Link } from "react-router-dom";
import logo from "../assets/images/Logo Transparent.png";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="site-container footer-content">
        <div className="footer-section about">
          <img src={logo} alt="Toffee Table Logo" className="footer-logo" />
          <p>
            Handcrafted sweets and treats delivered straight to your door. 
            Quality ingredients, baked with love.
          </p>
          <div className="social-links">
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>

        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h4>Visit Us</h4>
          <p><i className="fa-solid fa-location-dot"></i> 123 Baker Street, Sweet City</p>
          <p><i className="fa-solid fa-phone"></i> +91 98765 43210</p>
          <p><i className="fa-solid fa-envelope"></i> hello@toffeetable.com</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="site-container">
          <p>&copy; {new Date().getFullYear()} Toffee Table. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
