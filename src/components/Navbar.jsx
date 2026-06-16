import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const navMobileStyles = `
  @media (max-width: 768px) {
    .nav-links { display: none !important; }
    .nav-login-signup { display: none !important; }
    .nav-hamburger { display: flex !important; }
    .nav-inner { padding: 0 16px !important; }
  }
`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => { logout(); setMenuOpen(false); navigate('/'); };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/shop?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); setSearchQuery(''); }
  };
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{navMobileStyles}</style>
      <nav style={S.nav}>
        {/* Top bar */}
        <div style={S.topBar}>
          <p style={S.topBarText}>Free delivery on orders over $50 — Shop Now</p>
        </div>

        {/* Main navbar */}
        <div style={S.main}>
          <div className="container nav-inner" style={S.inner}>
            {/* Left links */}
            <div className="nav-links" style={S.navLinks}>
              <Link to="/shop" style={{ ...S.link, ...(isActive('/shop') ? S.linkActive : {}) }}>Shop</Link>
              <Link to="/shop?sortBy=created_at&sortDesc=true" style={S.link}>New Arrivals</Link>
              <Link to="/shop?category=4" style={S.link}>Clothing</Link>
            </div>

            {/* Logo */}
            <Link to="/" style={S.logo}>
              <span style={S.logoTop}>MODERN</span>
              <span style={S.logoBottom}>ABODE</span>
            </Link>

            {/* Right actions */}
            <div style={S.actions}>
              <button onClick={() => setSearchOpen(!searchOpen)} style={S.iconBtn} title="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>

              {user ? (
                <>
                  <Link to="/profile" style={S.iconBtn} title="Account">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </Link>
                  <Link to="/cart" style={{ ...S.iconBtn, position: 'relative' }} title="Cart">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    {cartCount > 0 && <span style={S.cartBadge}>{cartCount}</span>}
                  </Link>
                  <button onClick={handleLogout} style={{ ...S.link, background: 'none', border: 'none', fontSize: 12 }}>Logout</button>
                </>
              ) : (
                <div className="nav-login-signup" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Link to="/login" style={S.link}>Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={S.hamburger}>
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={S.searchBar}>
            <form onSubmit={handleSearch} style={S.searchForm}>
              <input autoFocus className="form-input" placeholder="Search products, brands..." value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)} style={{ maxWidth: 500, flex: 1 }} />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
              <button type="button" onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, color: '#999', cursor: 'pointer' }}>✕</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={S.mobileMenu}>
          {[['/', 'Home'], ['/shop', 'Shop'], ['/shop?sortBy=created_at', 'New Arrivals'], ['/shop?category=4', 'Clothing']].map(([path, label]) => (
            <Link key={path} to={path} style={S.mobileLink} onClick={() => setMenuOpen(false)}>{label}</Link>
          ))}
          {user && <Link to="/orders" style={S.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {user && <Link to="/profile" style={S.mobileLink} onClick={() => setMenuOpen(false)}>My Profile</Link>}
          {user && <Link to="/cart" style={S.mobileLink} onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>}
          {!user && <Link to="/login" style={S.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>}
          {!user && <Link to="/register" style={S.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>}
          {user && <button onClick={handleLogout} style={{ ...S.mobileLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', color: '#c0392b', width: '100%' }}>Logout</button>}
        </div>
      )}
    </>
  );
}

const S = {
  nav: { background: 'white', borderBottom: '1px solid #e8e2d6', position: 'sticky', top: 0, zIndex: 100 },
  topBar: { background: '#1a1814', padding: '8px 24px', textAlign: 'center' },
  topBarText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase' },
  main: { padding: '0' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  navLinks: { display: 'flex', gap: 32, flex: 1 },
  logo: { textAlign: 'center', textDecoration: 'none', flexShrink: 0 },
  logoTop: { display: 'block', fontSize: 11, letterSpacing: '4px', color: '#7a7468', fontWeight: 500 },
  logoBottom: { display: 'block', fontFamily: "'Cormorant Garamond', serif", fontSize: 22, letterSpacing: '6px', color: '#1a1814', fontWeight: 500, marginTop: -2 },
  actions: { display: 'flex', alignItems: 'center', gap: 18, flex: 1, justifyContent: 'flex-end' },
  link: { fontSize: 12, fontWeight: 500, color: '#2d2a25', textDecoration: 'none', letterSpacing: '0.5px', transition: 'color 0.2s' },
  linkActive: { color: '#c17f3e' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#2d2a25', display: 'flex', alignItems: 'center', padding: '4px', textDecoration: 'none' },
  cartBadge: { position: 'absolute', top: -4, right: -6, background: '#c17f3e', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  hamburger: { display: 'none', background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', padding: '4px 8px', color: '#1a1814' },
  searchBar: { background: 'white', borderTop: '1px solid #e8e2d6', padding: '12px 32px' },
  searchForm: { display: 'flex', gap: 12, alignItems: 'center', maxWidth: 600, margin: '0 auto' },
  mobileMenu: { background: 'white', borderBottom: '1px solid #e8e2d6', display: 'flex', flexDirection: 'column' },
  mobileLink: { padding: '14px 24px', fontSize: 13, color: '#1a1814', textDecoration: 'none', fontWeight: 500, borderBottom: '1px solid #f5f0e8' },
};
