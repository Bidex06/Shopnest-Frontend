import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data)).catch(() => {});
    productsApi.getAll({ pageSize: 8, sortBy: 'created_at', sortDesc: true })
      .then(r => { setFeatured(r.data.items || []); setNewArrivals((r.data.items || []).slice(0, 4)); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const catIcons = { 'Shoes': '👟', 'Oral Care': '🦷', 'Perfumes': '🌸', 'Clothing': '👗' };

  return (
    <div>
      {/* ── HERO ── */}
      <section style={S.hero}>
        <div className="container" style={S.heroInner}>
          <div style={S.heroLeft}>
            <p style={S.heroLabel}>Guided Discovery</p>
            <h1 style={S.heroTitle}>
              Discover Your<br />
              Personal <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Curation.</em>
            </h1>
            <p style={S.heroSub}>
              Take our quick quiz to find perfectly matched shoes, oral care, fragrances, and clothing tailored to your lifestyle.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 36, flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-accent btn-lg">Shop All Products</Link>
              <Link to="/shop?category=4" className="btn btn-outline btn-lg">View Clothing</Link>
            </div>
            {/* Stats */}
            <div style={S.stats}>
              {[['500+', 'Products'], ['4.8★', 'Rating'], ['Free', 'Delivery $50+']].map(([val, label]) => (
                <div key={label} style={S.stat}>
                  <span style={S.statVal}>{val}</span>
                  <span style={S.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={S.heroRight}>
            <div style={S.heroImgGrid}>
              <div style={S.heroImgMain}>
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500" alt="clothing"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={S.heroImgSm1}>
                <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" alt="shoes"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={S.heroImgSm2}>
                <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=300" alt="perfume"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <section style={{ background: 'white', padding: '24px 0', borderBottom: '1px solid #e8e2d6' }}>
        <div className="container" style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
          {categories.map((cat, i) => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`}
              style={{ ...S.catStrip, borderRight: i < categories.length - 1 ? '1px solid #e8e2d6' : 'none' }}>
              <span style={{ fontSize: 22 }}>{catIcons[cat.name] || '🏷'}</span>
              <div>
                <div style={S.catStripName}>{cat.name}</div>
                <div style={S.catStripCount}>{cat.productCount} products</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── RECOMMENDED / FEATURED ── */}
      <section style={{ padding: '72px 0', background: '#faf8f4' }}>
        <div className="container">
          <div style={S.sectionHead}>
            <div>
              <p className="section-label">Handpicked For You</p>
              <h2 className="section-title">Recommended For You</h2>
              <p className="section-subtitle">Shoes &amp; Clothing</p>
            </div>
            <Link to="/shop" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── BANNER ── */}
      <section style={S.banner}>
        <div className="container" style={S.bannerInner}>
          <div style={S.bannerLeft}>
            <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500" alt="oral care"
              style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 4 }} />
          </div>
          <div style={S.bannerRight}>
            <p className="section-label">Daily Essentials</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 500, color: '#1a1814', marginBottom: 16 }}>
              Oral Care &<br />Grooming
            </h2>
            <p style={{ color: '#7a7468', fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
              Premium oral care products trusted by dentists. From soft-bristle brushes to whitening toothpaste — everything for a confident smile.
            </p>
            <Link to="/shop?category=2" className="btn btn-primary">Shop Oral Care</Link>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section style={{ padding: '72px 0', background: 'white' }}>
        <div className="container">
          <div style={S.sectionHead}>
            <div>
              <p className="section-label">Just Dropped</p>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">Fresh additions to our collection</p>
            </div>
            <Link to="/shop?sortBy=created_at&sortDesc=true" className="btn btn-outline btn-sm">See All New</Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── PERFUMES BANNER ── */}
      <section style={S.perfumeBanner}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>Exclusive Fragrances</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,5vw,56px)', fontWeight: 400, color: 'white', marginBottom: 16 }}>
            Define Your Signature Scent
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
            From romantic florals to deep oriental ouds — find the fragrance that tells your story.
          </p>
          <Link to="/shop?category=3" className="btn" style={{ background: 'white', color: '#1a1814', letterSpacing: '1.5px' }}>
            Explore Perfumes
          </Link>
        </div>
      </section>

      {/* ── USP STRIP ── */}
      <section style={{ background: '#faf8f4', padding: '40px 0', borderTop: '1px solid #e8e2d6' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0 }}>
          {[
            ['🚚', 'Free Delivery', 'On orders over $50'],
            ['🔒', 'Secure Payment', 'SSL encrypted checkout'],
            ['↩️', 'Easy Returns', '30-day return policy'],
            ['⭐', 'Quality Products', 'Curated for your home'],
          ].map(([icon, title, sub]) => (
            <div key={title} style={S.uspItem}>
              <span style={{ fontSize: 28 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1814' }}>{title}</div>
                <div style={{ fontSize: 12, color: '#a89f94', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const S = {
  hero: { background: '#f5f0e8', padding: '80px 0 60px', minHeight: 520, display: 'flex', alignItems: 'center' },
  heroInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' },
  heroLeft: {},
  heroLabel: { fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#c17f3e', fontWeight: 600, marginBottom: 16 },
  heroTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,5vw,64px)', fontWeight: 500, color: '#1a1814', lineHeight: 1.1, marginBottom: 20 },
  heroSub: { color: '#7a7468', fontSize: 15, lineHeight: 1.8, maxWidth: 420 },
  stats: { display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: '1px solid #e0d5c0' },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statVal: { fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 600, color: '#1a1814' },
  statLabel: { fontSize: 11, color: '#a89f94', letterSpacing: '0.5px' },
  heroRight: {},
  heroImgGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 10, height: 420 },
  heroImgMain: { gridRow: '1 / 3', borderRadius: 4, overflow: 'hidden' },
  heroImgSm1: { borderRadius: 4, overflow: 'hidden' },
  heroImgSm2: { borderRadius: 4, overflow: 'hidden' },
  catStrip: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 32px', textDecoration: 'none', flex: 1, minWidth: 160, whiteSpace: 'nowrap' },
  catStripName: { fontSize: 13, fontWeight: 600, color: '#1a1814', letterSpacing: '0.3px' },
  catStripCount: { fontSize: 11, color: '#a89f94', marginTop: 2 },
  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 16 },
  banner: { background: 'white', padding: '72px 0' },
  bannerInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' },
  bannerLeft: {},
  bannerRight: {},
  perfumeBanner: { background: 'linear-gradient(135deg, #1a1814 0%, #3a2a1a 60%, #2a1a0a 100%)', padding: '96px 24px', position: 'relative', overflow: 'hidden' },
  uspItem: { display: 'flex', alignItems: 'center', gap: 16, padding: '20px 40px', flex: '1 1 200px', borderRight: '1px solid #e8e2d6' },
};
