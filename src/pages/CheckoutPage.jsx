import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ordersApi } from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!cart || cart.items.length === 0) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28 }}>Nothing to checkout</h3>
      <Link to="/shop" className="btn btn-primary">Shop Now</Link>
    </div>
  );

  const shipping = cart.total >= 50 ? 0 : 5.99;
  const grandTotal = cart.total + shipping;

  const handleSubmit = async () => {
    setError('');
    if (!address.trim() || address.trim().length < 10) {
      setError('Please enter a complete shipping address (at least 10 characters)');
      return;
    }
    setSubmitting(true);
    try {
      await ordersApi.placeOrder({ shippingAddress: address });
      await fetchCart();
      toast.success('Order placed! Check your email for confirmation 🎉');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ background: '#faf8f4', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#f5f0e8', padding: '32px 0', borderBottom: '1px solid #e8e2d6' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {[['Cart', '/cart', true], ['Checkout', null, true], ['Confirmation', null, false]].map(([label, path, active], i) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i > 0 && <span style={{ color: '#e8e2d6' }}>›</span>}
                <span style={{ fontSize: 12, letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 600, color: active ? '#1a1814' : '#a89f94' }}>
                  {path ? <Link to={path} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</Link> : label}
                </span>
              </div>
            ))}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 500, marginTop: 12 }}>Checkout</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'flex-start' }}>
          {/* Form */}
          <div>
            {error && <div className="alert-error">{error}</div>}

            <div style={S.section}>
              <h3 style={S.sectionTitle}>📦 Shipping Address</h3>
              <textarea className="form-input" rows={5}
                placeholder={`Enter your full delivery address\ne.g. 7 Adeleke Street, Osun State, Nigeria`}
                value={address} onChange={e => setAddress(e.target.value)}
                style={{ resize: 'vertical', lineHeight: 1.7 }} />
              <p style={{ fontSize: 11, color: '#a89f94', marginTop: 6 }}>
                {address.length} characters {address.length < 10 && '(minimum 10 required)'}
              </p>
            </div>

            <div style={{ ...S.section, marginTop: 20 }}>
              <h3 style={S.sectionTitle}>💳 Payment Method</h3>
              <div style={{ background: '#f5f0e8', padding: '20px', borderRadius: 4, border: '1px solid #e8e2d6' }}>
                <p style={{ fontSize: 13, color: '#7a7468', lineHeight: 1.7 }}>
                  Payment integration (Paystack/Stripe) coming soon. Orders are confirmed on submission for now.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                  {['Visa', 'Mastercard', 'Paystack', 'Bank Transfer'].map(m => (
                    <span key={m} style={{ fontSize: 11, padding: '4px 10px', border: '1px solid #e8e2d6', borderRadius: 2, color: '#a89f94', background: 'white' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={S.summary}>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 500, marginBottom: 20 }}>Your Order</h3>

            <div style={{ maxHeight: 260, overflowY: 'auto', marginBottom: 16 }}>
              {cart.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                  <img src={item.imageUrl || 'https://via.placeholder.com/48x48/f5f0e8/7a7468?text=IMG'}
                    alt={item.productName} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, background: '#f5f0e8', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#1a1814', lineHeight: 1.3 }}>{item.productName}</p>
                    <p style={{ fontSize: 12, color: '#a89f94' }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e8e2d6', margin: '16px 0' }} />

            {[['Subtotal', `$${cart.total.toFixed(2)}`], ['Shipping', shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#7a7468', marginBottom: 8 }}>
                <span>{l}</span><span style={{ color: l === 'Shipping' && shipping === 0 ? '#5a7a5a' : 'inherit' }}>{v}</span>
              </div>
            ))}

            <hr style={{ border: 'none', borderTop: '1px solid #e8e2d6', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif" }}>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: 14, letterSpacing: '1.5px', fontSize: 12 }}
              onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>

            <p style={{ fontSize: 11, color: '#a89f94', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
              🔒 Your order is secured with SSL encryption.<br />A confirmation email will be sent after placing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  section: { background: 'white', padding: '24px', borderRadius: 4, border: '1px solid #e8e2d6' },
  sectionTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 500, marginBottom: 16 },
  summary: { background: 'white', padding: '28px', borderRadius: 4, border: '1px solid #e8e2d6', position: 'sticky', top: 88 },
};
