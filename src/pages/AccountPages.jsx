import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function BrandMark() {
  return (
    <div style={{ marginBottom: 'auto' }}>
      <span style={{ fontSize: 10, letterSpacing: '3px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>MODERN</span>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: 'white', letterSpacing: '4px', display: 'block', marginTop: -4 }}>ABODE</span>
    </div>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { toast.error('Please enter your email'); return; }
    setLoading(true);
    try { await api.post('/auth/forgot-password', { email }); setSent(true); }
    catch { setSent(true); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <div style={S.leftPanel}>
        <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800" alt="store" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={S.overlay}><div style={S.overlayContent}><BrandMark /><h2 style={S.overlayTitle}>Reset Your<br />Password</h2><p style={S.overlaySub}>We will send a secure link to your inbox.</p></div></div>
      </div>
      <div style={S.rightPanel}>
        <div style={S.formWrap}>
          <Link to="/login" style={S.backLink}>Back to Sign In</Link>
          {sent ? (
            <div style={{ textAlign: 'center', paddingTop: 40 }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>📧</div>
              <p style={S.formLabel}>Check your inbox</p>
              <h1 style={S.formTitle}>Email Sent!</h1>
              <p style={{ color: '#a89f94', fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>If that email is registered, a reset link has been sent.</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>Back to Login</Link>
            </div>
          ) : (
            <>
              <p style={S.formLabel}>Account Recovery</p>
              <h1 style={S.formTitle}>Forgot Password?</h1>
              <p style={{ color: '#a89f94', fontSize: 14, marginBottom: 32 }}>Enter your email and we will send you a reset link.</p>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
              <button className="btn btn-primary" style={{ width: '100%', padding: 14, letterSpacing: '1.5px' }} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const handleSubmit = async () => {
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, email, newPassword: password });
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally { setLoading(false); }
  };

  if (!token || !email) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: '#faf8f4' }}>
      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28 }}>Invalid reset link</h3>
      <Link to="/forgot-password" className="btn btn-primary">Request New Link</Link>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.leftPanel}>
        <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800" alt="store" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={S.overlay}><div style={S.overlayContent}><BrandMark /><h2 style={S.overlayTitle}>Set a New<br />Password</h2><p style={S.overlaySub}>Choose a strong password to protect your account.</p></div></div>
      </div>
      <div style={S.rightPanel}>
        <div style={S.formWrap}>
          <Link to="/login" style={S.backLink}>Back to Sign In</Link>
          <p style={S.formLabel}>Security</p>
          <h1 style={S.formTitle}>New Password</h1>
          {error && <div className="alert-error">{error}</div>}
          {[{ label: 'New Password', val: password, set: setPassword }, { label: 'Confirm Password', val: confirm, set: setConfirm }].map(f => (
            <div key={f.label} className="form-group">
              <label className="form-label">{f.label}</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters" value={f.val} onChange={e => f.set(e.target.value)} />
            </div>
          ))}
          <button className="btn btn-primary" style={{ width: '100%', padding: 14, letterSpacing: '1.5px' }} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ fullName: user?.fullName || '', phone: '', address: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async () => {
    setError(''); setSuccess('');
    if (!profile.fullName.trim()) { setError('Full name is required'); return; }
    setLoading(true);
    try { await api.patch('/auth/profile', profile); setSuccess('Profile updated!'); toast.success('Saved'); }
    catch (err) { setError(err.response?.data?.message || 'Failed to update'); }
    finally { setLoading(false); }
  };

  const handlePasswordChange = async () => {
    setError(''); setSuccess('');
    if (!passwords.currentPassword) { setError('Enter your current password'); return; }
    if (passwords.newPassword.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (passwords.newPassword !== passwords.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setSuccess('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { setError(err.response?.data?.message || 'Failed to change password'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ background: '#faf8f4', minHeight: '80vh' }}>
      <div style={{ background: '#f5f0e8', padding: '40px 0', borderBottom: '1px solid #e8e2d6' }}>
        <div className="container">
          <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#c17f3e', fontWeight: 600, marginBottom: 8 }}>Account</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 500 }}>My Profile</h1>
          <p style={{ color: '#a89f94', fontSize: 13, marginTop: 6 }}>{user?.email}</p>
        </div>
      </div>
      <div className="container" style={{ padding: '40px 32px', maxWidth: 760 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e8e2d6', marginBottom: 32 }}>
          {['profile', 'password'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
              style={{ padding: '12px 24px', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', color: tab === t ? '#1a1814' : '#a89f94', borderBottom: tab === t ? '2px solid #1a1814' : '2px solid transparent', marginBottom: -1 }}>
              {t === 'profile' ? 'Profile' : 'Password'}
            </button>
          ))}
          <Link to="/orders" style={{ padding: '12px 24px', fontSize: 12, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: '#a89f94', textDecoration: 'none', borderBottom: '2px solid transparent', marginBottom: -1 }}>
            My Orders
          </Link>
        </div>

        <div style={{ background: 'white', padding: '32px', borderRadius: 4, border: '1px solid #e8e2d6' }}>
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}

          {tab === 'profile' && (
            <>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Personal Information</h3>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={profile.fullName} onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Email Address <span style={{ color: '#a89f94', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(cannot be changed)</span></label><input className="form-input" value={user?.email || ''} disabled /></div>
              <div className="form-group"><label className="form-label">Phone Number</label><input className="form-input" placeholder="+234 800 000 0000" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></div>
              <div className="form-group"><label className="form-label">Default Shipping Address</label><textarea className="form-input" rows={4} placeholder="Your default delivery address" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <button className="btn btn-primary" onClick={handleProfileSave} disabled={loading} style={{ letterSpacing: '1.5px' }}>{loading ? 'Saving...' : 'Save Changes'}</button>
            </>
          )}

          {tab === 'password' && (
            <>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 500, marginBottom: 24 }}>Change Password</h3>
              {[{ label: 'Current Password', key: 'currentPassword' }, { label: 'New Password', key: 'newPassword' }, { label: 'Confirm New Password', key: 'confirm' }].map(f => (
                <div key={f.key} className="form-group"><label className="form-label">{f.label}</label><input className="form-input" type="password" placeholder="••••••••" value={passwords[f.key]} onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))} /></div>
              ))}
              <button className="btn btn-primary" onClick={handlePasswordChange} disabled={loading} style={{ letterSpacing: '1.5px' }}>{loading ? 'Changing...' : 'Change Password'}</button>
            </>
          )}
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

export default ForgotPasswordPage;
