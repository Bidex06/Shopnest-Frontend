import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();

  if (!cart || cart.items.length === 0) return (
    <div style={{ background: '#faf8f4', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🛍</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 500, marginBottom: 12 }}>Your Cart is Empty</h2>
        <p style={{ color: '#a89f94', marginBottom: 28, fontSize: 14 }}>Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    </div>
  );

  const shipping = cart.total >= 50 ? 0 : 5.99;
  const grandTotal = cart.total + shipping;

  return (
    <div style={{ background: '#faf8f4', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#f5f0e8', padding: '32px 0', borderBottom: '1px solid #e8e2d6' }}>
        <div className="container">
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 500 }}>Shopping Cart</h1>
          <p style={{ color: '#a89f94', fontSize: 13, marginTop: 4 }}>{cart.items.reduce((s, i) => s + i.quantity, 0)} items</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'flex-start' }}>
          {/* Items */}
          <div>
            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, padding: '0 0 12px', borderBottom: '1px solid #e8e2d6', marginBottom: 8 }}>
              {['Product', 'Price', 'Quantity', 'Total'].map(h => (
                <span key={h} style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', fontWeight: 600 }}>{h}</span>
              ))}
            </div>

            {cart.items.map(item => (
              <div key={item.id} style={S.cartRow}>
                {/* Product */}
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Link to={`/product/${item.productId}`}>
                    <img src={item.imageUrl || `https://via.placeholder.com/80x80/f5f0e8/7a7468?text=IMG`}
                      alt={item.productName} style={S.itemImg} />
                  </Link>
                  <div>
                    <Link to={`/product/${item.productId}`} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 500, color: '#1a1814', textDecoration: 'none', display: 'block', marginBottom: 4 }}>
                      {item.productName}
                    </Link>
                    <button onClick={() => removeItem(item.productId)}
                      style={{ background: 'none', border: 'none', color: '#a89f94', fontSize: 11, cursor: 'pointer', letterSpacing: '0.5px', padding: 0, textDecoration: 'underline' }}>
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div style={{ fontSize: 14, color: '#2d2a25', fontWeight: 500 }}>${item.price.toFixed(2)}</div>

                {/* Qty */}
                <div style={S.qtyWrap}>
                  <button style={S.qtyBtn} onClick={() => updateQuantity(item.productId, item.quantity - 1)}>−</button>
                  <span style={S.qtyNum}>{item.quantity}</span>
                  <button style={S.qtyBtn} onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </div>

                {/* Subtotal */}
                <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1814' }}>${item.subtotal.toFixed(2)}</div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Link to="/shop" style={{ fontSize: 12, color: '#a89f94', letterSpacing: '0.5px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div style={S.summary}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Order Summary</h3>

            {[['Subtotal', `$${cart.total.toFixed(2)}`], ['Shipping', shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13, color: '#7a7468' }}>
                <span>{label}</span>
                <span style={{ color: label === 'Shipping' && shipping === 0 ? '#5a7a5a' : 'inherit' }}>{val}</span>
              </div>
            ))}

            {shipping > 0 && (
              <p style={{ fontSize: 12, color: '#c17f3e', marginBottom: 12, background: '#f5ede0', padding: '8px 12px', borderRadius: 2 }}>
                Add ${(50 - cart.total).toFixed(2)} more for free delivery!
              </p>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #e8e2d6', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif" }}>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', letterSpacing: '1.5px' }}>
              Proceed to Checkout
            </Link>

            {/* Trust badges */}
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['🔒 Secure SSL Checkout', '↩️ Free 30-day returns', '🚚 Fast delivery'].map(b => (
                <p key={b} style={{ fontSize: 12, color: '#a89f94', textAlign: 'center' }}>{b}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  cartRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #f0ebe0' },
  itemImg: { width: 72, height: 72, objectFit: 'cover', borderRadius: 2, background: '#f5f0e8', flexShrink: 0 },
  qtyWrap: { display: 'flex', alignItems: 'center', border: '1px solid #e8e2d6', borderRadius: 2, width: 'fit-content' },
  qtyBtn: { width: 32, height: 32, background: 'transparent', border: 'none', fontSize: 16, cursor: 'pointer', color: '#1a1814' },
  qtyNum: { width: 36, textAlign: 'center', fontWeight: 600, fontSize: 13, borderLeft: '1px solid #e8e2d6', borderRight: '1px solid #e8e2d6', lineHeight: '32px' },
  summary: { background: 'white', padding: '28px', borderRadius: 4, border: '1px solid #e8e2d6', position: 'sticky', top: 88 },
};
