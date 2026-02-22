import { useState } from "react";
import { useCart } from "../context/CartContext";

function MenuCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addToCart(product._id);
    if (success) {
      setAdded(true);
      window.dispatchEvent(new Event("open-cart"));
      setTimeout(() => setAdded(false), 1500);
    }
    setAdding(false);
  };

  const hasDiscount = product.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div className={`product-element menu-card ${!product.isAvailable ? "sold-out" : ""}`}>
      <div className="image-wrapper">
        <img src={product.image} alt={product.name} />
        {!product.isAvailable && <span className="sold-out-overlay">Sold Out</span>}
        {hasDiscount && product.isAvailable && (
          <span className="discount-badge">-{product.discount}%</span>
        )}
      </div>
      
      <div className="menu-card-info">
        <h4>{product.name}</h4>
        <p className="description">{product.description}</p>
        <div className="menu-card-footer">
          <div className="price-container">
            {hasDiscount ? (
              <>
                <span className="discounted-price">₹{discountedPrice}</span>
                <span className="original-price">₹{product.price}</span>
              </>
            ) : (
              <span className="price">₹{product.price}</span>
            )}
          </div>
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