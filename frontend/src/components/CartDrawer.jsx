import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/cart.css";

const API = "http://localhost:5000/api/cart";

function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API, { headers });
      const data = await res.json();
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      fetchCart();
    };
    const handleRefresh = () => fetchCart();

    window.addEventListener("open-cart", handleOpen);
    window.addEventListener("cart-updated", handleRefresh);

    return () => {
      window.removeEventListener("open-cart", handleOpen);
      window.removeEventListener("cart-updated", handleRefresh);
    };
  }, [token]);

  const updateQty = async (productId, quantity) => {
    try {
      const res = await fetch(`${API}/update`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${API}/remove/${productId}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const items = cart?.items || [];
  const validItems = items.filter((i) => i.productId);
  const subtotal = validItems.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );
  const totalQty = validItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-drawer-overlay ${isOpen ? "open" : ""}`} 
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <h3>Your Sweet Cart</h3>
          <button className="close-drawer" onClick={() => setIsOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="drawer-content">
          {!token ? (
            <div className="drawer-empty">
              <i className="fa-solid fa-lock"></i>
              <p>Please log in to see your cart</p>
              <button 
                className="drawer-login-btn"
                onClick={() => {
                  setIsOpen(false);
                  window.dispatchEvent(new Event("open-login"));
                }}
              >
                Log In
              </button>
            </div>
          ) : loading && !cart ? (
            <div className="drawer-loader">
              <div className="cart-spinner"></div>
            </div>
          ) : validItems.length === 0 ? (
            <div className="drawer-empty">
              <i className="fa-solid fa-cart-shopping"></i>
              <p>Your cart is empty</p>
              <Link to="/menu" onClick={() => setIsOpen(false)} className="drawer-browse-btn">
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className="drawer-items">
              {validItems.map((item) => {
                const product = item.productId;
                return (
                  <div className="drawer-item-card" key={product._id}>
                    <img src={product.image} alt={product.name} />
                    <div className="drawer-item-info">
                      <div className="drawer-item-top">
                        <h4>{product.name}</h4>
                        <button onClick={() => removeItem(product._id)}>
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                      <div className="drawer-item-bottom">
                        <div className="drawer-qty">
                          <button 
                            onClick={() => updateQty(product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQty(product._id, item.quantity + 1)}>
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>
                        <span className="drawer-price">₹{product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {token && validItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <p className="drawer-tax-note">Taxes and shipping calculated at checkout</p>
            <button className="drawer-checkout-btn" disabled>
              Checkout • ₹{subtotal}
            </button>
            <button className="drawer-continue" onClick={() => setIsOpen(false)}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
