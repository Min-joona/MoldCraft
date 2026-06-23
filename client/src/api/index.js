import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Typed API helpers
export const quotesApi = {
  submit: (data) => api.post('/quotes', data),
  getAll: (params) => api.get('/quotes', { params }),
  getOne: (id) => api.get(`/quotes/${id}`),
  update: (id, data) => api.patch(`/quotes/${id}`, data),
  delete: (id) => api.delete(`/quotes/${id}`),
};

export const galleryApi = {
  getAll: (params) => api.get('/gallery', { params }),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.patch(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const blogApi = {
  getAll: (params) => api.get('/blog', { params }),
  getOne: (slug) => api.get(`/blog/${slug}`),
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.patch(`/blog/${id}`, data),
  delete: (id) => api.delete(`/blog/${id}`),
};

export const materialsApi = {
  getAll: () => api.get('/materials'),
  getOne: (id) => api.get(`/materials/${id}`),
};

export const contactApi = {
  send: (data) => api.post('/contact', data),
};

export const analyticsApi = {
  trackView: (data) => api.post('/analytics/track', data),
  trackEvent: (data) => api.post('/analytics/event', data),
  getStats: () => api.get('/analytics/stats').then(r => r.data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard').then(r => r.data),
};

export const contentApi = {
  getAll: () => api.get('/content').then(r => r.data),
  getOne: (key) => api.get(`/content/${key}`).then(r => r.data),
  update: (key, data) => api.patch(`/content/${key}`, data).then(r => r.data),
};

export const heroApi = {
  getAll: () => api.get('/hero').then(r => r.data),
  getAllAdmin: () => api.get('/hero/all').then(r => r.data),
  create: (data) => api.post('/hero', data).then(r => r.data),
  update: (id, data) => api.patch(`/hero/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/hero/${id}`).then(r => r.data),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  updatePassword: (data) => api.patch('/auth/password', data).then(r => r.data),
  updateProfile: (data) => api.patch('/auth/profile', data).then(r => r.data),
  getUsers: () => api.get('/auth/users').then(r => r.data),
  createUser: (data) => api.post('/auth/users', data).then(r => r.data),
  updateUser: (id, data) => api.patch(`/auth/users/${id}`, data).then(r => r.data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`).then(r => r.data),
};
