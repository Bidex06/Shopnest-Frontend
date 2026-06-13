import { Component } from 'react';
import { Link } from 'react-router-dom';

// ─── ERROR BOUNDARY ───────────────────────────────────────
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', padding: '40px 24px', textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, marginBottom: 12 }}>
              Something went wrong
            </h2>
            <p style={{ color: '#7a7060', marginBottom: 28, maxWidth: 400 }}>
              An unexpected error occurred. Please refresh the page or go back to the home page.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn btn-outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <Link to="/" className="btn btn-primary"
                onClick={() => this.setState({ hasError: false, error: null })}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── SKELETON LOADERS ─────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text-sm" />
      <div className="skeleton skeleton-btn" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div style={{
      background: 'white', padding: '24px', borderRadius: 12,
      marginBottom: 16, border: '1px solid #e8e2d5'
    }}>
      <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 20 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: 8 }} />
        <div className="skeleton" style={{ height: 36, width: 120, borderRadius: 8 }} />
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────
export function EmptyState({ icon = '📦', title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary" style={{ marginTop: 8 }}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

// ─── INLINE ERROR ─────────────────────────────────────────
export function InlineError({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#fde8e8', color: '#c0392b', padding: '12px 16px',
      borderRadius: 8, fontSize: 14, marginBottom: 16,
      border: '1px solid #f5c6c6'
    }}>
      ⚠ {message}
    </div>
  );
}

// ─── SUCCESS BANNER ───────────────────────────────────────
export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: '#d4edda', color: '#155724', padding: '12px 16px',
      borderRadius: 8, fontSize: 14, marginBottom: 16,
      border: '1px solid #c3e6cb'
    }}>
      ✓ {message}
    </div>
  );
}
