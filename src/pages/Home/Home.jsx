import BestSellers from "./BestSellers";
import OurProducts from "./OurProducts";
import OurSpeciality from "./OurSpeciality";

import homeImage from "../../assets/images/HomePage.png";

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="homepage">
        <div id="homepage-text">
          <h3>TOFFEE TABLE</h3>
          <p>Sweet Moments Start Here</p>
          <button className="order-now-button">Order Now</button>
        </div>

        <div id="homepage-image-container">
          <img src={homeImage} alt="Toffee Table" />
        </div>
      </section>

      {/* Page Sections */}
      <BestSellers />
      <OurProducts />
      <OurSpeciality />
    </>
  );
}

export default Home;
