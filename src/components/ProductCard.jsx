import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-img-wrap" style={{ display: 'block' }}>
        <img
          src={product.imageUrl || `https://via.placeholder.com/400x280/f5f0e8/7a7468?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
        />
        {/* Hover actions */}
        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1, borderRadius: 2 }}
            onClick={e => { e.preventDefault(); e.stopPropagation(); addToCart(product.id); }}
            disabled={product.stockQuantity === 0}
          >
            {product.stockQuantity === 0 ? 'Sold Out' : '+ Quick Add'}
          </button>
          <Link to={`/product/${product.id}`} className="btn btn-sand btn-sm"
            style={{ borderRadius: 2, whiteSpace: 'nowrap' }}
            onClick={e => e.stopPropagation()}>
            View
          </Link>
        </div>
      </Link>

      <div className="product-card-body">
        {product.categoryName && <div className="product-card-category">{product.categoryName}</div>}
        {product.brand && <div className="product-card-brand">{product.brand}</div>}
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <div className="product-card-name">{product.name}</div>
        </Link>
        <div className="product-card-footer">
          <div className="product-card-price">${product.price.toFixed(2)}</div>
          {product.stockQuantity > 0 && product.stockQuantity <= 5 && (
            <span style={{ fontSize: 11, color: '#c17f3e', fontWeight: 600 }}>Only {product.stockQuantity} left</span>
          )}
        </div>
      </div>
    </div>
  );
}
