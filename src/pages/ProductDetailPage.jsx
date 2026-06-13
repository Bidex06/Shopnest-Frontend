import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    productsApi.getById(id).then(r => setProduct(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container" style={{ padding: '48px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
        <div className="skeleton" style={{ height: 520, borderRadius: 4 }} />
        <div>
          <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 40, marginBottom: 16 }} />
          <div className="skeleton" style={{ height: 28, width: '25%', marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 80, marginBottom: 32 }} />
          <div className="skeleton" style={{ height: 48, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="empty-state">
      <h3>Product not found</h3>
      <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  return (
    <div style={{ background: '#faf8f4' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid #e8e2d6', padding: '12px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 8, fontSize: 12, color: '#a89f94', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#a89f94', textDecoration: 'none' }}>Home</Link>
          <span>›</span>
          <Link to="/shop" style={{ color: '#a89f94', textDecoration: 'none' }}>Shop</Link>
          {product.categoryName && <><span>›</span><Link to={`/shop?category=${product.categoryId}`} style={{ color: '#a89f94', textDecoration: 'none' }}>{product.categoryName}</Link></>}
          <span>›</span>
          <span style={{ color: '#1a1814' }}>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'flex-start' }}>
          {/* Image */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: '#f5f0e8', borderRadius: 4, overflow: 'hidden', aspectRatio: '4/5' }}>
              <img src={product.imageUrl || `https://via.placeholder.com/600x750/f5f0e8/7a7468?text=${encodeURIComponent(product.name)}`}
                alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {product.categoryName && (
                <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#c17f3e', fontWeight: 600 }}>
                  {product.categoryName}
                </span>
              )}
              {product.brand && (
                <span style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: '#a89f94' }}>
                  / {product.brand}
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 500, color: '#1a1814', marginBottom: 16, lineHeight: 1.15 }}>
              {product.name}
            </h1>

            <div style={{ fontSize: 28, fontWeight: 600, color: '#1a1814', marginBottom: 24 }}>
              ${product.price.toFixed(2)}
            </div>

            {/* Stock status */}
            <div style={{ marginBottom: 28 }}>
              {product.stockQuantity > 10
                ? <span style={S.stockGood}>✓ In Stock</span>
                : product.stockQuantity > 0
                ? <span style={S.stockLow}>⚠ Only {product.stockQuantity} left</span>
                : <span style={S.stockOut}>✗ Out of Stock</span>}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e8e2d6', marginBottom: 28 }} />

            {/* Qty + Add to cart */}
            {product.stockQuantity > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#a89f94', marginBottom: 10, fontWeight: 600 }}>Quantity</p>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={S.qtyControl}>
                    <button style={S.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                    <span style={S.qtyNum}>{qty}</span>
                    <button style={S.qtyBtn} onClick={() => setQty(q => Math.min(product.stockQuantity, q + 1))}>+</button>
                  </div>
                  <button className="btn btn-primary" style={{ flex: 1, letterSpacing: '1.5px' }}
                    onClick={() => addToCart(product.id, qty)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            )}

            <Link to="/cart" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              View Cart
            </Link>

            <hr style={{ border: 'none', borderTop: '1px solid #e8e2d6', margin: '28px 0' }} />

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #e8e2d6', marginBottom: 20 }}>
              {['description', 'details'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '10px 20px', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', color: activeTab === tab ? '#1a1814' : '#a89f94', borderBottom: activeTab === tab ? '2px solid #1a1814' : '2px solid transparent', marginBottom: -1 }}>
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <p style={{ color: '#7a7468', lineHeight: 1.85, fontSize: 14 }}>
                {product.description || 'Premium quality product from our curated collection. Designed for everyday use with attention to detail and comfort.'}
              </p>
            )}

            {activeTab === 'details' && (
              <div>
                {[['Category', product.categoryName], ['Brand', product.brand], ['SKU', `PRD-${String(product.id).padStart(4, '0')}`], ['Availability', product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock']]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f5f0e8', fontSize: 13 }}>
                      <span style={{ color: '#a89f94', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: 11 }}>{label}</span>
                      <span style={{ color: '#1a1814', fontWeight: 500 }}>{value}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Shipping info */}
            <div style={S.shippingBox}>
              {[['🚚', 'Free delivery on orders over $50'], ['↩️', '30-day easy returns'], ['🔒', 'Secure checkout']].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#7a7468' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  stockGood: { fontSize: 13, color: '#5a7a5a', fontWeight: 600, background: '#e8f5e8', padding: '6px 14px', borderRadius: 2 },
  stockLow: { fontSize: 13, color: '#c17f3e', fontWeight: 600, background: '#f5ede0', padding: '6px 14px', borderRadius: 2 },
  stockOut: { fontSize: 13, color: '#c0392b', fontWeight: 600, background: '#fde8e8', padding: '6px 14px', borderRadius: 2 },
  qtyControl: { display: 'flex', alignItems: 'center', border: '1px solid #e8e2d6', borderRadius: 2, overflow: 'hidden' },
  qtyBtn: { width: 40, height: 44, background: 'transparent', border: 'none', fontSize: 18, cursor: 'pointer', color: '#1a1814' },
  qtyNum: { width: 44, textAlign: 'center', fontWeight: 600, fontSize: 15, borderLeft: '1px solid #e8e2d6', borderRight: '1px solid #e8e2d6' },
  shippingBox: { marginTop: 24, padding: '16px', background: '#f5f0e8', borderRadius: 4, display: 'flex', flexDirection: 'column', gap: 10 },
};
