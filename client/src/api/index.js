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
