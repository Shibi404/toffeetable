import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const { cart, subtotal, clearCartLocally } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // New Address State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", house: "", street: "", city: "", state: "", pincode: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.dispatchEvent(new Event("open-login"));
      navigate("/");
    } else if (cart.items.length === 0 && step === 1) {
      // Don't stay on checkout if cart is empty
      // navigate("/menu");
    }
  }, [token, cart.items.length, navigate, step]);

  useEffect(() => {
    if (step === 2) {
      fetchAddresses();
    }
  }, [step]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/address", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses(data);
        if (data.length > 0 && !selectedAddress) {
          setSelectedAddress(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch addresses");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAddress)
      });
      const data = await res.json();
      if (res.ok) {
        setAddresses([data, ...addresses]);
        setSelectedAddress(data);
        setShowAddForm(false);
        setNewAddress({ name: "", phone: "", house: "", street: "", city: "", state: "", pincode: "" });
      }
    } catch (err) {
      console.error("Failed to add address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;
    
    // items must match the backend snapshot shape
    const orderItems = cart.items.map(item => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      quantity: item.quantity,
      image: item.productId.image
    }));

    try {
      const res = await fetch("http://localhost:5000/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          address: selectedAddress,
          totalAmount: subtotal,
          paymentMethod: "COD"
        })
      });

      if (res.ok) {
        clearCartLocally();
        navigate("/order-success");
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  if (!token) return null;

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span className="step-num">1</span>
            Cart
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span className="step-num">2</span>
            Address
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-num">3</span>
            Payment
          </div>
        </div>
      </div>

      <div className="checkout-content">
        {step === 1 && (
          <div className="checkout-box fade-in">
            <h2>Review Your Cart</h2>
            {cart.items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="checkout-items">
                {cart.items.map(item => {
                  const product = item.productId;
                  return (
                    <div className="checkout-item" key={product._id}>
                      <img src={product.image} alt={product.name} />
                      <div className="c-item-info">
                        <h4>{product.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <div className="c-item-price">
                        ₹{product.price * item.quantity}
                      </div>
                    </div>
                  );
                })}
                <div className="checkout-total">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <button 
                  className="btn-primary checkout-next-btn"
                  onClick={() => setStep(2)}
                >
                  Continue to Address
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="checkout-box fade-in">
            <h2>Shipping Address</h2>
            
            {addresses.length > 0 && !showAddForm ? (
              <div className="address-list">
                {addresses.map(addr => (
                  <div 
                    key={addr._id} 
                    className={`address-card ${selectedAddress?._id === addr._id ? "selected" : ""}`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <div className="addr-label">{addr.name}</div>
                    <p>Phone: {addr.phone}</p>
                    <p>{addr.house}, {addr.street}</p>
                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                ))}
                <button className="btn-secondary add-new-btn" onClick={() => setShowAddForm(true)}>
                  + Add New Address
                </button>
              </div>
            ) : (
              <form className="address-form" onSubmit={handleAddAddress}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={newAddress.name}
                      onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="text" 
                      required
                      value={newAddress.phone}
                      onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Flat, House no., Building, Company, Apartment</label>
                  <input 
                    type="text" 
                    required
                    value={newAddress.house}
                    onChange={e => setNewAddress({...newAddress, house: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Area, Street, Sector, Village</label>
                  <input 
                    type="text" 
                    required
                    value={newAddress.street}
                    onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Town/City</label>
                    <input 
                      type="text" 
                      required
                      value={newAddress.city}
                      onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input 
                      type="text" 
                      required
                      value={newAddress.state}
                      onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>PIN Code</label>
                    <input 
                      type="text" 
                      required
                      value={newAddress.pincode}
                      onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  {addresses.length > 0 && (
                    <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="btn-primary">Save Address</button>
                </div>
              </form>
            )}

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(1)}>Back</button>
              <button 
                className="btn-primary" 
                disabled={!selectedAddress || showAddForm}
                onClick={() => setStep(3)}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-box fade-in">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <div className="payment-card selected">
                <i className="fa-solid fa-money-bill-wave"></i>
                <div className="pay-info">
                  <h4>Cash on Delivery</h4>
                  <p>Pay when you receive your dark temptations.</p>
                </div>
                <div className="radio-circle active"></div>
              </div>
            </div>

            <div className="order-summary-box">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Deliver to:</span>
                <span>{selectedAddress?.house}, {selectedAddress?.city} - {selectedAddress?.pincode}</span>
              </div>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{cart.items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            <div className="step-actions">
              <button className="btn-secondary" onClick={() => setStep(2)}>Back</button>
              <button className="btn-primary place-order-btn" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
