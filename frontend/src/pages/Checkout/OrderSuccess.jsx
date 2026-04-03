import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="order-success-container fade-in">
      <div className="success-card">
        <div className="success-icon">
          <i className="fa-solid fa-check"></i>
        </div>
        <h1>Order Placed Successfully!</h1>
        <p>Your sweet treats are on their way. You have selected Cash on Delivery.</p>
        <div className="success-actions">
          <Link to="/menu" className="btn-secondary">Back to Menu</Link>
          <Link to="/profile" className="btn-primary">View Orders</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
