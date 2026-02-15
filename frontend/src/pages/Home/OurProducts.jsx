import { Link } from "react-router-dom";
import cakes from "../../assets/images/cakes.webp";
import brownies from "../../assets/images/brownies.webp";
import cupcakes from "../../assets/images/cupcakes.webp";
import pastries from "../../assets/images/pastries.webp";

const products = [
  { img: cakes, name: "Cakes", path: "/menu/cakes" },
  { img: brownies, name: "Brownies", path: "/menu/brownies" },
  { img: cupcakes, name: "Cupcakes", path: "/menu/cupcakes" },
  { img: pastries, name: "Pastries", path: "/menu/pastries" },
];

function OurProducts() {
  return (
    <section id="our-products">
      <section className="site-container">
        <h3 className="heading">OUR PRODUCTS</h3>

        <div className="product-container">
          {products.map((item, index) => (
            <Link to={item.path} className="product-element" key={index}>
              <img src={item.img} alt={item.name} />
              <h4>{item.name}</h4>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

export default OurProducts;
