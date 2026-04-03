import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const API = "http://localhost:5000/api/cart";

  const fetchCart = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setCart({ items: [] });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();
      if (res.status === 401) {
        localStorage.removeItem("token");
        setCart({ items: [] });
        window.dispatchEvent(new Event("auth-change"));
      } else if (res.ok) {
        setCart(data);
      } else {
        setCart({ items: [] });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    
    // Listen for login/logout events if they exist, or just rely on state changes
    const handleLogin = () => fetchCart();
    const handleLogout = () => setCart({ items: [] });
    
    window.addEventListener("auth-change", handleLogin);
    window.addEventListener("cart-updated", fetchCart);

    return () => {
      window.removeEventListener("auth-change", handleLogin);
      window.removeEventListener("cart-updated", fetchCart);
    };
  }, []);

  const addToCart = async (productId) => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      window.dispatchEvent(new Event("open-login"));
      return false;
    }

    try {
      const res = await fetch(`${API}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.status === 401) {
        localStorage.removeItem("token");
        setCart({ items: [] });
        window.dispatchEvent(new Event("auth-change"));
        window.dispatchEvent(new Event("open-login"));
        return false;
      }
      if (res.ok) {
        setCart(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const updateQty = async (productId, quantity) => {
    const currentToken = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (productId) => {
    const currentToken = localStorage.getItem("token");
    try {
      const res = await fetch(`${API}/remove/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((sum, item) => {
    if (item.productId) {
      return sum + item.productId.price * item.quantity;
    }
    return sum;
  }, 0) || 0;

  const clearCartLocally = () => setCart({ items: [] });

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQty,
        removeItem,
        totalItems,
        subtotal,
        fetchCart,
        clearCartLocally
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
