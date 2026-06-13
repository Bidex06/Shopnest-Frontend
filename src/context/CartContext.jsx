import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    if (!user) { setCart(null); setCartCount(0); return; }
    try {
      const { data } = await cartApi.get();
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch { /* silent */ }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      const { data } = await cartApi.addItem({ productId, quantity });
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await cartApi.updateItem(productId, { quantity });
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
    } catch { toast.error('Failed to update cart'); }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await cartApi.removeItem(productId);
      setCart(data);
      setCartCount(data.items.reduce((sum, i) => sum + i.quantity, 0));
      toast.success('Removed from cart');
    } catch { toast.error('Failed to remove item'); }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateQuantity, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
