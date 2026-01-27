const speciality = [
  {
    icon: "fa-heart",
    title: "Handcrafted with Love",
    text: "Every dessert is made fresh with the finest ingredients and attention to detail.",
  },
  {
    icon: "fa-star",
    title: "Unique Flavors",
    text: "From classic chocolate to exotic fruit fusions — discover something new in every bite.",
  },
  {
    icon: "fa-wand-magic-sparkles",
    title: "Custom Orders",
    text: "Need something personalized? We create desserts that match your moments.",
  },
  {
    icon: "fa-cookie-bite",
    title: "No Preservatives",
    text: "Just natural goodness — pure, honest, and delicious.",
  },
];

function OurSpeciality() {
  return (
    <section id="our-speciality">
      <section className="site-container">
      <h3 className="heading">OUR SPECIALITY</h3>
      <div id="our-speciality-container">
        {speciality.map((item, index) => (
          <div className="our-speciality-element" key={index}>
            <i className={`fa-solid ${item.icon} our-speciality-icon`}></i>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      </section>
    </section>
  );
}

export default OurSpeciality;
