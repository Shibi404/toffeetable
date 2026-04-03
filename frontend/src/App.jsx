import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Profile from "./pages/Profile/Profile";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/Checkout/OrderSuccess";
import CartDrawer from "./components/CartDrawer";

import { CartProvider } from "./context/CartContext";

import "./index.css";
import "./styles/home.css";
import "./styles/navbar.css";
import "./styles/loginmodal.css";
import "./styles/cart.css";
import "./styles/profile.css";
import "./styles/checkout.css";

function App() {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:category" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}

export default App;
