import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer style={S.footer}>
      {/* Newsletter */}
      <div style={S.newsletter}>
        <div className="container" style={S.newsletterInner}>
          <div>
            <p style={S.newsletterLabel}>Stay in the Loop</p>
            <h3 style={S.newsletterTitle}>Subscribe to Our Newsletter</h3>
            <p style={S.newsletterSub}>Get exclusive offers, new arrivals, and style tips delivered to your inbox.</p>
          </div>
          <div style={S.newsletterForm}>
            <input className="form-input" placeholder="Enter your email address" value={email}
              onChange={e => setEmail(e.target.value)} style={{ flex: 1, borderRadius: 2 }} />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Main footer */}
      <div className="container" style={S.grid}>
        <div style={S.brand}>
          <div style={S.logo}>
            <span style={S.logoTop}>MODERN</span>
            <span style={S.logoBottom}>ABODE</span>
          </div>
          <p style={S.tagline}>Your one-stop household store for premium shoes, oral care, fragrances & clothing. Quality delivered fast.</p>
          <div style={S.socials}>
            {['Instagram', 'Twitter', 'Facebook'].map(s => (
              <a key={s} href="#" style={S.social}>{s[0]}</a>
            ))}
          </div>
        </div>

        {[
          { title: 'Shop', links: [['Shoes', '/shop?category=1'], ['Oral Care', '/shop?category=2'], ['Perfumes', '/shop?category=3'], ['Clothing', '/shop?category=4'], ['New Arrivals', '/shop']] },
          { title: 'Account', links: [['Login', '/login'], ['Register', '/register'], ['My Orders', '/orders'], ['My Profile', '/profile'], ['Cart', '/cart']] },
          { title: 'Support', links: [['Contact Us', '#'], ['FAQs', '#'], ['Shipping Policy', '#'], ['Returns', '#'], ['Privacy Policy', '#']] },
        ].map(col => (
          <div key={col.title} style={S.col}>
            <h4 style={S.colTitle}>{col.title}</h4>
            {col.links.map(([label, path]) => (
              <Link key={label} to={path} style={S.colLink}>{label}</Link>
            ))}
          </div>
        ))}
      </div>

      <hr className="divider" />
      <div style={S.bottom}>
        <p>© {new Date().getFullYear()} Modern Abode / ShopNest. All rights reserved.</p>
        <p>Made with ♥ for quality living</p>
      </div>
    </footer>
  );
}

const S = {
  footer: { background: '#1a1814', color: '#a89f94', marginTop: 'auto' },
  newsletter: { padding: '56px 0' },
  newsletterInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' },
  newsletterLabel: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#c17f3e', marginBottom: 8 },
  newsletterTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'white', marginBottom: 8, fontWeight: 500 },
  newsletterSub: { fontSize: 13, color: '#7a7468', lineHeight: 1.7 },
  newsletterForm: { display: 'flex', gap: 12 },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, padding: '48px 32px 40px' },
  brand: {},
  logo: { marginBottom: 16 },
  logoTop: { display: 'block', fontSize: 10, letterSpacing: '3px', color: '#7a7468', fontWeight: 500 },
  logoBottom: { display: 'block', fontFamily: "'Cormorant Garamond', serif", fontSize: 20, letterSpacing: '5px', color: 'white', fontWeight: 400, marginTop: -2 },
  tagline: { fontSize: 13, lineHeight: 1.8, color: '#7a7468', maxWidth: 260, marginBottom: 20 },
  socials: { display: 'flex', gap: 10 },
  social: { width: 32, height: 32, background: '#2d2a25', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#a89f94', textDecoration: 'none', fontWeight: 600 },
  col: { display: 'flex', flexDirection: 'column', gap: 10 },
  colTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: 'white', marginBottom: 6, fontWeight: 500, letterSpacing: '1px' },
  colLink: { fontSize: 13, color: '#7a7468', textDecoration: 'none', transition: 'color 0.2s' },
  bottom: { display: 'flex', justifyContent: 'space-between', padding: '20px 32px', fontSize: 12, color: '#4a4640' },
};
