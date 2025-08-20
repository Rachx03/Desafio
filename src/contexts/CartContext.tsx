// src/context/CartContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "../types/Product";

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.product.id === item.product.id);
      if (existingIndex >= 0) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += item.quantity;
        return newCart;
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(ci => ci.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
