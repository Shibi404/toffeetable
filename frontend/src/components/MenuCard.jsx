function MenuCard({ product }) {
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
          <button className="order-now-button" disabled={!product.isAvailable}>
            {product.isAvailable ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuCard;