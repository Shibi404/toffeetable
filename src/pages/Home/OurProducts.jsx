import cakes from "../../assets/images/cakes.webp";
import brownies from "../../assets/images/brownies.webp";
import cupcakes from "../../assets/images/cupcakes.webp";
import pastries from "../../assets/images/pastries.webp";

const products = [
  { img: cakes, name: "Cakes" },
  { img: brownies, name: "Brownies" },
  { img: cupcakes, name: "Cupcakes" },
  { img: pastries, name: "Pastries" },
];

function OurProducts() {
  return (
    <section id="our-products">
      <h3>OUR PRODUCTS</h3>
      <div className="product-container">
        {products.map((item, index) => (
          <div className="product-element" key={index}>
            <img src={item.img} alt={item.name} />
            <h4>{item.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}

export default OurProducts;
