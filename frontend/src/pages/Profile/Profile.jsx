import React, { useState } from 'react';
import '../../styles/profile.css';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('orders');

    // Mock data for demonstration
    const orders = [
        { id: '#ORD-7829', date: 'Oct 12, 2023', total: '$42.50', status: 'Delivered' },
        { id: '#ORD-8102', date: 'Nov 05, 2023', total: '$18.00', status: 'Delivered' },
        { id: '#ORD-9441', date: 'Dec 20, 2023', total: '$25.99', status: 'Processing' },
    ];

    const addresses = [
        { id: 1, type: 'Home', name: 'John Doe', address: '123 Bakery Lane, Sweet Town, NY 10001', phone: '+1 234 567 8900', isDefault: true },
        { id: 2, type: 'Office', name: 'John Doe', address: '456 Coffee St, Downtown, NY 10002', phone: '+1 234 567 8900', isDefault: false },
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
                                <div key={addr.id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                                    <h4>
                                        <span className="address-tag">{addr.type}</span>
                                        {addr.isDefault && <span className="default-badge">(Default)</span>}
                                    </h4>
                                    <p><strong>{addr.name}</strong></p>
                                    <p>{addr.address}</p>
                                    <p>{addr.phone}</p>
                                </div>
                            ))}
                            {/* Add Address Placeholder */}
                            <div className="address-card add-new-address" style={{ border: '2px dashed #e0cfc0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <div style={{ textAlign: 'center', color: '#8B6D5C' }}>
                                    <i className="fas fa-plus" style={{ fontSize: '24px', marginBottom: '10px' }}></i>
                                    <p>Add New Address</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Profile;
