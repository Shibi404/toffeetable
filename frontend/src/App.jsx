import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Profile from "./pages/Profile/Profile";
import CartDrawer from "./components/CartDrawer";

import "./index.css";
import "./styles/home.css";
import "./styles/navbar.css";
import "./styles/loginmodal.css";
import "./styles/cart.css";
import "./styles/profile.css";

function App() {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:category" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
