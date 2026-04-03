import React, { useState, useEffect } from 'react';
import '../../styles/profile.css';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [addresses, setAddresses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: "", phone: "", house: "", street: "", city: "", state: "", pincode: ""
    });

    useEffect(() => {
        if (activeTab === 'addresses') {
            fetchAddresses();
        }
    }, [activeTab]);

    const fetchAddresses = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch("http://localhost:5000/api/address", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAddresses(data);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
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
                setIsModalOpen(false);
                setNewAddress({ name: "", phone: "", house: "", street: "", city: "", state: "", pincode: "" });
            }
        } catch (err) {
            console.error("Failed to add address");
        }
    };

    // Mock data for demonstration
    const orders = [
        { id: '#ORD-7829', date: 'Oct 12, 2023', total: '$42.50', status: 'Delivered' },
        { id: '#ORD-8102', date: 'Nov 05, 2023', total: '$18.00', status: 'Delivered' },
        { id: '#ORD-9441', date: 'Dec 20, 2023', total: '$25.99', status: 'Processing' },
    ];

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h3>My Profile</h3>
                <p>Manage your orders and saved addresses</p>
            </header>

            <div className="profile-tabs-container">
                <button 
                    className={`profile-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <i className="fas fa-shopping-bag"></i> Orders
                </button>
                <button 
                    className={`profile-tab ${activeTab === 'addresses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('addresses')}
                >
                    <i className="fas fa-map-marker-alt"></i> Addresses
                </button>
            </div>

            <main className="profile-content">
                {activeTab === 'orders' ? (
                    <div className="orders-section fade-in">
                        {orders.length > 0 ? (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-info">
                                            <h4>Order {order.id}</h4>
                                            <p>{order.date} • {order.total}</p>
                                        </div>
                                        <div className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <i className="fas fa-box-open"></i>
                                <h4>No orders yet</h4>
                                <p>You haven't placed any orders yet. Start exploring our menu!</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="addresses-section fade-in">
                        <div className="addresses-grid">
                            {addresses.map(addr => (
                                <div key={addr._id} className="address-card">
                                    <h4>
                                        <span className="address-tag">{addr.name}</span>
                                    </h4>
                                    <p>Phone: {addr.phone}</p>
                                    <p>{addr.house}, {addr.street}</p>
                                    <p>{addr.city}, {addr.state} - {addr.pincode}</p>
                                </div>
                            ))}
                            {/* Add Address Placeholder */}
                            <div 
                                className="address-card add-new-address" 
                                style={{ border: '2px dashed #e0cfc0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                onClick={() => setIsModalOpen(true)}
                            >
                                <div style={{ textAlign: 'center', color: '#8B6D5C' }}>
                                    <i className="fas fa-plus" style={{ fontSize: '24px', margin: '0 0 10px 0' }}></i>
                                    <p>Add New Address</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Address Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <h2 className="modal-title">New Address</h2>
                        <form onSubmit={handleAddAddress}>
                            <div className="modal-form-row">
                                <div className="modal-form-group">
                                    <label>Full Name</label>
                                    <input 
                                        type="text" required value={newAddress.name}
                                        onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="text" required value={newAddress.phone}
                                        onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="modal-form-group">
                                <label>Flat, House no., Building, Company, Apartment</label>
                                <input 
                                    type="text" required value={newAddress.house}
                                    onChange={e => setNewAddress({...newAddress, house: e.target.value})}
                                />
                            </div>
                            <div className="modal-form-group">
                                <label>Area, Street, Sector, Village</label>
                                <input 
                                    type="text" required value={newAddress.street}
                                    onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                                />
                            </div>
                            <div className="modal-form-row">
                                <div className="modal-form-group">
                                    <label>Town/City</label>
                                    <input 
                                        type="text" required value={newAddress.city}
                                        onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label>State</label>
                                    <input 
                                        type="text" required value={newAddress.state}
                                        onChange={e => setNewAddress({...newAddress, state: e.target.value})}
                                    />
                                </div>
                                <div className="modal-form-group">
                                    <label>PIN Code</label>
                                    <input 
                                        type="text" required value={newAddress.pincode}
                                        onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="modal-submit-btn">Save Address</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
