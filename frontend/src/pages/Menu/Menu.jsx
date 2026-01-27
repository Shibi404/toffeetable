import { useEffect, useState } from "react";

function Menu() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("cakes");

  useEffect(() => {
    fetch(`http://localhost:5000/api/products?category=${category}`)
      .then(res => res.json())
      .then(data => setProducts(data));
  }, [category]);

  return (
    <section id="menu">
      <h2>Our Menu</h2>

      {/* Category Tabs */}
      <div className="menu-tabs">
        {["cakes", "brownies", "cupcakes", "pastries"].map(cat => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="menu-grid">
        {products.map(product => (
          <div className="menu-card" key={product._id}>
            <img src={product.image} alt={product.name} />
            <h4>{product.name}</h4>
            <p>{product.description}</p>
            <span>₹{product.price}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Menu;
