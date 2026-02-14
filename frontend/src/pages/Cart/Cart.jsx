import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/cart.css";

const API = "http://localhost:5000/api/cart";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Fetch cart
  const fetchCart = async () => {
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
    if (token) fetchCart();
    else setLoading(false);
  }, []);

  // Update quantity
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

  // Remove item
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

  // Compute totals
  const items = cart?.items || [];
  const validItems = items.filter((i) => i.productId);
  const subtotal = validItems.reduce(
    (sum, i) => sum + i.productId.price * i.quantity,
    0
  );
  const totalQty = validItems.reduce((sum, i) => sum + i.quantity, 0);

  // ─── NOT LOGGED IN ────────────────────────────────────────────
  if (!token) {
    return (
      <div className="cart-page">
        <section className="cart-header">
          <div className="site-container">
            <h3 className="heading">Your Cart</h3>
            <p>Review your selected treats before ordering</p>
          </div>
        </section>
        <div className="cart-empty site-container">
          <div className="cart-empty-icon">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h4>Please log in</h4>
          <p>You need to be logged in to view your cart.</p>
        </div>
      </div>
    );
  }

  // ─── LOADING ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="cart-page">
        <section className="cart-header">
          <div className="site-container">
            <h3 className="heading">Your Cart</h3>
            <p>Review your selected treats before ordering</p>
          </div>
        </section>
        <div className="cart-loader site-container">
          <div className="cart-spinner"></div>
          <p>Loading your cart…</p>
        </div>
      </div>
    );
  }

  // ─── EMPTY CART ───────────────────────────────────────────────
  if (validItems.length === 0) {
    return (
      <div className="cart-page">
        <section className="cart-header">
          <div className="site-container">
            <h3 className="heading">Your Cart</h3>
            <p>Review your selected treats before ordering</p>
          </div>
        </section>
        <div className="cart-empty site-container">
          <div className="cart-empty-icon">
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
          <h4>Your cart is empty</h4>
          <p>Looks like you haven't added any treats yet!</p>
          <Link to="/menu" className="cart-browse-btn">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  // ─── CART WITH ITEMS ──────────────────────────────────────────
  return (
    <div className="cart-page">
      <section className="cart-header">
        <div className="site-container">
          <h3 className="heading">Your Cart</h3>
          <p>
            {totalQty} {totalQty === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </section>

      <div className="cart-content site-container">
        {/* ── Items Column ── */}
        <div className="cart-items">
          {validItems.map((item) => {
            const product = item.productId;
            return (
              <div className="cart-item-card" key={product._id}>
                <div className="cart-item-img">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <h4 className="cart-item-name">{product.name}</h4>
                      <span className="cart-item-category">
                        {product.category}
                      </span>
                    </div>
                    <button
                      className="cart-remove-btn"
                      onClick={() => removeItem(product._id)}
                      title="Remove item"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-qty-control">
                      <button
                        onClick={() =>
                          updateQty(product._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQty(product._id, item.quantity + 1)
                        }
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>

                    <span className="cart-item-price">
                      ₹{product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Summary Column ── */}
        <div className="cart-summary">
          <div className="cart-summary-card">
            <h4>Order Summary</h4>

            <div className="cart-summary-row">
              <span>Subtotal ({totalQty} items)</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="cart-summary-row">
              <span>Delivery</span>
              <span className="cart-free">Free</span>
            </div>

            <hr />

            <div className="cart-summary-row cart-total-row">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>

            <button className="cart-checkout-btn" disabled>
              <i className="fa-solid fa-bag-shopping"></i>
              Proceed to Checkout
            </button>

            <Link to="/menu" className="cart-continue-link">
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
