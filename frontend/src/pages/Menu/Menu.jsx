import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import MenuCard from "../../components/MenuCard"; 
import "../../styles/menu.css";

function Menu() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  const categories = ["all", "cakes", "brownies", "cupcakes", "pastries"];
  const selectedCategory = category || "all";

  useEffect(() => {
    setLoading(true);
    const url = selectedCategory !== "all" 
      ? `http://localhost:5000/api/products?category=${selectedCategory}`
      : `http://localhost:5000/api/products`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCategory]);

  // Sort Logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "priceLow") return a.price - b.price;
    if (sortBy === "priceHigh") return b.price - a.price;
    return 0; // default (newest/database order)
  });

  return (
    <div className="menu-page">
      <section className="menu-header">
        <section className="site-container">
        <h3 className="heading">Our Delicious Menu</h3>
        <p>Handcrafted sweets delivered to your doorstep</p>
        </section>
      </section>

      <div className="menu-controls site-container">
        {/* Category Filters */}
        <div className="menu-tabs">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={cat === "all" ? "/menu" : `/menu/${cat}`}
              className={`tab-btn ${selectedCategory === cat ? "active" : ""}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="sort-container">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="product-container site-container">
        {loading ? (
          <div className="loader">Baking your results...</div>
        ) : sortedProducts.length === 0 ? (
          <p className="no-results">No treats found in this category.</p>
        ) : (
          sortedProducts.map((product) => (
            <MenuCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default Menu;