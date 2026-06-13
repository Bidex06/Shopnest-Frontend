import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // Change to 5000 if your backend runs there
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('shopnest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shopnest_token');
      localStorage.removeItem('shopnest_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.patch('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

export const productsApi = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.patch(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  uploadImage: (id, formData) => api.post(`/products/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
};

export const cartApi = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (productId, data) => api.patch(`/cart/items/${productId}`, data),
  removeItem: (productId) => api.delete(`/cart/items/${productId}`),
};

export const ordersApi = {
  getMyOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  placeOrder: (data) => api.post('/orders', data),
};

export default api;