import ferrero from "../../assets/images/ferrero-rocher-dream-cake.webp";
import nutella from "../../assets/images/nutella-hazelnut-brownie.webp";
import lotus from "../../assets/images/lotus-biscoff-dream-cake.webp";
import blackForest from "../../assets/images/black-forest-chocolate-mini-dream-cake.webp";

const products = [
  { img: ferrero, name: "Ferrero Rocher Dream Cake" },
  { img: nutella, name: "Nutella Hazelnut Brownie" },
  { img: lotus, name: "Lotus Biscoff Dream Cake" },
  { img: blackForest, name: "Black Forest Chocolate Mini Dream Cake" },
];

function BestSellers() {
  return (
    <section id="best-sellers">
      <section className="site-container">
        <h3 className="heading">BEST SELLERS</h3>
        <div className="product-container">
          {products.map((item, index) => (
            <div className="product-element" key={index}>
              <img src={item.img} alt={item.name} />
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

export default BestSellers;
