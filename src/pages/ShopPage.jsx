import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsApi, categoriesApi } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categoryId = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => { categoriesApi.getAll().then(r => setCategories(r.data)).catch(() => {}); }, []);

  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ categoryId: categoryId || undefined, search: search || undefined, sortBy, sortDesc, page, pageSize: 12, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined })
      .then(r => setResult(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [categoryId, search, sortBy, sortDesc, page, minPrice, maxPrice]);

  const setPage = (p) => {
    const params = {};
    if (categoryId) params.category = categoryId;
    if (search) params.search = search;
    if (p > 1) params.page = p;
    setSearchParams(params);
    window.scrollTo(0, 0);
  };

  const activeCategory = categories.find(c => c.id === parseInt(categoryId));

  return (
    <div style={{ background: '#faf8f4', minHeight: '80vh' }}>
      {/* Hero */}
      <div className="page-hero" style={{ background: '#f5f0e8' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,4vw,48px)', fontWeight: 500 }}>
          {activeCategory ? activeCategory.name : 'All Products'}
        </h1>
        <p style={{ color: '#7a7468', fontSize: 14, marginTop: 8 }}>
          {result.total} product{result.total !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="container" style={{ padding: '32px 32px' }}>
        {/* Toolbar */}
        <div style={S.toolbar}>
          {/* Category pills */}
          <div style={S.catPills}>
            <button onClick={() => setSearchParams({})} className={`btn btn-sm ${!categoryId ? 'btn-primary' : 'btn-sand'}`}>All</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSearchParams({ category: cat.id })}
                className={`btn btn-sm ${parseInt(categoryId) === cat.id ? 'btn-primary' : 'btn-sand'}`}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort + Search */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input className="form-input" placeholder="Search..." value={search}
              onChange={e => setSearch(e.target.value)} style={{ width: 200, fontSize: 13 }} />
            <select className="form-input" value={`${sortBy}-${sortDesc}`}
              onChange={e => { const [s, d] = e.target.value.split('-'); setSortBy(s); setSortDesc(d === 'true'); }}
              style={{ width: 'auto', fontSize: 13, cursor: 'pointer' }}>
              <option value="created_at-true">Newest First</option>
              <option value="created_at-false">Oldest First</option>
              <option value="price-false">Price: Low → High</option>
              <option value="price-true">Price: High → Low</option>
              <option value="name-false">Name: A → Z</option>
            </select>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input className="form-input" placeholder="Min $" type="number" value={minPrice}
                onChange={e => setMinPrice(e.target.value)} style={{ width: 80, fontSize: 13 }} />
              <span style={{ color: '#aaa' }}>–</span>
              <input className="form-input" placeholder="Max $" type="number" value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)} style={{ width: 80, fontSize: 13 }} />
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="products-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-img" />
                <div style={{ padding: '16px' }}>
                  <div className="skeleton skeleton-text" style={{ marginLeft: 0 }} />
                  <div className="skeleton skeleton-text-sm" style={{ marginLeft: 0 }} />
                </div>
              </div>
            ))}
          </div>
        ) : result.items.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => { setSearch(''); setMinPrice(''); setMaxPrice(''); setSearchParams({}); }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {result.items.map(p => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div style={S.pagination}>
                <button className="btn btn-sand btn-sm" onClick={() => setPage(page - 1)} disabled={page <= 1}>← Prev</button>
                {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-sand'}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="btn btn-sand btn-sm" onClick={() => setPage(page + 1)} disabled={page >= result.totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #e8e2d6' },
  catPills: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  pagination: { display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 },
};
