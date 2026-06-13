import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage, { RegisterPage } from './pages/LoginPage';
import { ForgotPasswordPage, ResetPasswordPage, ProfilePage } from './pages/AccountPages';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function NotFound() {
  return (
    <div style={{ background: '#faf8f4', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 520 }}>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(80px,15vw,140px)', fontWeight: 300, color: '#e8e2d6', lineHeight: 1 }}>
          404
        </p>
        <p style={{ fontSize: 10, letterSpacing: '3px', textTransform: 'uppercase', color: '#c17f3e', fontWeight: 600, marginBottom: 16 }}>
          Page Not Found
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 500, color: '#1a1814', marginBottom: 16, lineHeight: 1.2 }}>
          Oops! This page doesn't exist.
        </h2>
        <p style={{ color: '#a89f94', fontSize: 14, lineHeight: 1.8, marginBottom: 36 }}>
          The page you're looking for may have been moved or never existed. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
          <Link to="/" className="btn btn-primary" style={{ letterSpacing: '1.5px' }}>Go Home</Link>
          <Link to="/shop" className="btn btn-outline" style={{ letterSpacing: '1.5px' }}>Browse Shop</Link>
        </div>
        <div style={{ borderTop: '1px solid #e8e2d6', paddingTop: 32 }}>
          <p style={{ fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#a89f94', marginBottom: 16 }}>
            You might be looking for
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['👟 Shoes', '/shop?category=1'], ['🦷 Oral Care', '/shop?category=2'], ['🌸 Perfumes', '/shop?category=3'], ['👗 Clothing', '/shop?category=4']].map(([label, path]) => (
              <Link key={label} to={path} className="btn btn-sand btn-sm">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" toastOptions={{
            duration: 3500,
            style: { fontFamily: "'Inter', sans-serif", fontSize: 13, background: 'white', color: '#1a1814', border: '1px solid #e8e2d6', borderRadius: '2px' },
            success: { iconTheme: { primary: '#c17f3e', secondary: 'white' } },
          }} />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
