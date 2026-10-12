import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('canteen_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('canteen_cart', JSON.stringify(cartItems));
    } catch {
      // Handle storage quota issues if any
    }
  }, [cartItems]);

  const itemCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const addToCart = (food, quantity = 1) => {
    if (!food) return false;
    if (food.isAvailable === false || food.stock === 0) return false;

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item._id === food._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        // Cap to available stock if specified
        if (food.stock && newQty > food.stock) {
          updated[existingIndex].quantity = food.stock;
        } else {
          updated[existingIndex].quantity = newQty;
        }
        return updated;
      }

      const newItem = {
        _id: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        category: food.category,
        stock: food.stock,
        quantity: Math.min(quantity, food.stock || quantity),
      };
      return [...prevItems, newItem];
    });
    return true;
  };

  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  };

  const updateQty = (foodId, qty) => {
    if (qty <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === foodId) {
          const clampedQty = item.stock && qty > item.stock ? item.stock : qty;
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside a CartProvider');
  }
  return context;
};

export default CartContext;
