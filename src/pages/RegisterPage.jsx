import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.fullName || !form.email || !form.password) { setError('Please fill all required fields'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created! Welcome to ShopNest 🎉');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'Email already in use.') {
        setError(msg);
      } else {
        toast.success('Account created! Welcome to ShopNest 🎉');
        navigate('/');
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      {/* Left panel */}
      <div style={S.leftPanel}>
        <img src="https://images.unsplash.com/photo-1541643600914-78b084683702?w=800" alt="store"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={S.overlay}>
          <div style={S.overlayContent}>
            <div style={{ marginBottom: 'auto' }}>
              <span style={{ fontSize: 10, letterSpacing: '3px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>MODERN</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: 'white', letterSpacing: '4px', display: 'block', marginTop: -4 }}>ABODE</span>
            </div>
            <h2 style={S.overlayTitle}>Join the<br />Community</h2>
            <p style={S.overlaySub}>Get exclusive access to new arrivals and member-only offers.</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={S.rightPanel}>
        <div style={S.formWrap}>
          <Link to="/" style={S.backLink}>← Back to Store</Link>
          <p style={S.formLabel}>New here?</p>
          <h1 style={S.formTitle}>Create Account</h1>
          <p style={{ color: '#a89f94', fontSize: 14, marginBottom: 32 }}>
            Already have an account? <Link to="/login" style={{ color: '#c17f3e', fontWeight: 600 }}>Sign in</Link>
          </p>

          {error && <div className="alert-error">{error}</div>}

          {[
            { label: 'Full Name *', key: 'fullName', type: 'text', ph: 'John Doe' },
            { label: 'Email Address *', key: 'email', type: 'email', ph: 'you@example.com' },
            { label: 'Password *', key: 'password', type: 'password', ph: 'Min. 6 characters' },
            { label: 'Phone Number', key: 'phone', type: 'tel', ph: '+234 800 000 0000' },
          ].map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label}</label>
              <input className="form-input" type={f.type} placeholder={f.ph}
                value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Delivery Address</label>
            <textarea className="form-input" rows={3} placeholder="Your default delivery address"
              value={form.address} onChange={e => set('address', e.target.value)}
              style={{ resize: 'vertical' }} />
          </div>

          <button className="btn btn-primary"
            style={{ width: '100%', padding: '14px', letterSpacing: '1.5px' }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' },
  leftPanel: { position: 'relative' },
  overlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,24,20,0.3), rgba(26,24,20,0.75))' },
  overlayContent: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: 48 },
  overlayTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 40, color: 'white', fontWeight: 400, lineHeight: 1.2, marginTop: 'auto', marginBottom: 12 },
  overlaySub: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  rightPanel: { background: '#faf8f4', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' },
  formWrap: { width: '100%', maxWidth: 400 },
  backLink: { fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', textDecoration: 'none', marginBottom: 40, display: 'inline-block' },
  formLabel: { fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#c17f3e', fontWeight: 600, marginBottom: 8 },
  formTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 500, color: '#1a1814', marginBottom: 8 },
};
