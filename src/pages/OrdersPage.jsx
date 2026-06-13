import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../services/api';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    ordersApi.getMyOrders().then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#faf8f4', minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ background: '#f5f0e8', padding: '40px 0', borderBottom: '1px solid #e8e2d6' }}>
        <div className="container">
          <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#c17f3e', fontWeight: 600, marginBottom: 8 }}>Account</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 500 }}>My Orders</h1>
          <p style={{ color: '#a89f94', fontSize: 13, marginTop: 6 }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 32px', maxWidth: 900 }}>
        {loading ? (
          <div>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 4, marginBottom: 16, border: '1px solid #e8e2d6', overflow: 'hidden' }}>
                <div style={{ padding: '24px' }}>
                  <div className="skeleton" style={{ height: 16, width: '30%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 12, width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, marginBottom: 10 }}>No orders yet</h3>
            <p style={{ color: '#a89f94', marginBottom: 24, fontSize: 14 }}>Your order history will appear here</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} style={S.card}>
              {/* Header row */}
              <div style={S.cardHeader} onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', marginBottom: 4 }}>Order</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, color: '#1a1814' }}>#{order.id}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', marginBottom: 4 }}>Date</p>
                    <p style={{ fontSize: 13, color: '#2d2a25' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', marginBottom: 4 }}>Total</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#1a1814' }}>${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', marginBottom: 4 }}>Status</p>
                    <span className={`badge badge-${order.status}`} style={{ textTransform: 'capitalize', letterSpacing: '0.5px' }}>{order.status}</span>
                  </div>
                </div>
                <span style={{ color: '#a89f94', fontSize: 16 }}>{expanded === order.id ? '▲' : '▼'}</span>
              </div>

              {/* Progress tracker */}
              {order.status !== 'cancelled' && (
                <div style={S.tracker}>
                  {STEPS.map((step, i) => {
                    const currentIdx = STEPS.indexOf(order.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {i < STEPS.length - 1 && (
                          <div style={{ position: 'absolute', top: 10, left: '50%', width: '100%', height: 1, background: done && i < currentIdx ? '#c17f3e' : '#e8e2d6', zIndex: 0 }} />
                        )}
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: done ? '#c17f3e' : '#e8e2d6', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
                          {done ? '✓' : ''}
                        </div>
                        <span style={{ fontSize: 10, marginTop: 6, color: done ? '#c17f3e' : '#a89f94', fontWeight: done ? 600 : 400, textTransform: 'capitalize', letterSpacing: '0.5px' }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Expanded details */}
              {expanded === order.id && (
                <div style={{ padding: '20px 24px', borderTop: '1px solid #f5f0e8' }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f5f0e8' }}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.productName} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 2 }} />}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: '#1a1814' }}>{item.productName}</p>
                        <p style={{ fontSize: 12, color: '#a89f94', marginTop: 2 }}>Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}</p>
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1814' }}>${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                  {order.shippingAddress && (
                    <div style={{ marginTop: 16, padding: '12px 16px', background: '#f5f0e8', borderRadius: 2, fontSize: 13, color: '#7a7468' }}>
                      <strong style={{ color: '#1a1814' }}>Shipped to:</strong> {order.shippingAddress}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const S = {
  card: { background: 'white', borderRadius: 4, marginBottom: 16, border: '1px solid #e8e2d6', overflow: 'hidden' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', cursor: 'pointer' },
  tracker: { display: 'flex', padding: '16px 48px', background: '#faf8f4', borderTop: '1px solid #f0ebe0' },
};
