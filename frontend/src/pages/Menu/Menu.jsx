import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Menu() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ["all", "cakes", "brownies", "cupcakes", "pastries"];

  // If no category in URL → show all
  const selectedCategory = category || "all";

  useEffect(() => {
    // Validate category
    if (!categories.includes(selectedCategory)) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(
      `http://localhost:5000/api/products${
        selectedCategory !== "all"
          ? `?category=${selectedCategory}`
          : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <section className="menu-section">
      <h2 className="menu-title">Our Menu</h2>

      {/* Category Navigation */}
      <div className="menu-tabs">
        {categories.map((cat) => (
          <Link
            key={cat}
            to={cat === "all" ? "/menu" : `/menu/${cat}`}
            className={`tab-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
          >
            {cat.toUpperCase()}
          </Link>
        ))}
      </div>

      {/* Invalid Category */}
      {!categories.includes(selectedCategory) ? (
        <p>Category not found.</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : (
        <div className="menu-grid">
          {products.length === 0 ? (
            <p>No items found.</p>
          ) : (
            products.map((product) => (
              <div
                className={`menu-card ${
                  !product.isAvailable ? "unavailable" : ""
                }`}
                key={product._id}
              >
                {!product.isAvailable && (
                  <span className="badge">Sold Out</span>
                )}

                <img src={product.image} alt={product.name} />

                <div className="card-content">
                  <h4>{product.name}</h4>
                  <p>{product.description || "Freshly baked with love."}</p>

                  <div className="card-footer">
                    <span className="price">₹{product.price}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default Menu;
