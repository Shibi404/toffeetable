import { useState } from "react";

function MenuCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Dispatch a custom event so Navbar can open the login modal
      window.dispatchEvent(new Event("open-login"));
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id }),
      });

      if (res.ok) {
        setAdded(true);
        // Notify navbar to refresh cart count
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setAdded(false), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={`product-element menu-card ${!product.isAvailable ? "sold-out" : ""}`}>
      <div className="image-wrapper">
        <img src={product.image} alt={product.name} />
        {!product.isAvailable && <span className="sold-out-overlay">Sold Out</span>}
      </div>
      
      <div className="menu-card-info">
        <h4>{product.name}</h4>
        <p className="description">{product.description}</p>
        <div className="menu-card-footer">
          <span className="price">₹{product.price}</span>
          <button
            className={`order-now-button ${added ? "added" : ""}`}
            disabled={!product.isAvailable || adding}
            onClick={handleAddToCart}
          >
            {!product.isAvailable
              ? "Out of Stock"
              : added
              ? "✓ Added!"
              : adding
              ? "Adding…"
              : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;