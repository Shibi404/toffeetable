import { Routes, Route } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";

import "./index.css";
import "./styles/home.css";
import "./styles/navbar.css";
import "./styles/loginmodal.css";
import "./styles/cart.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:category" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
