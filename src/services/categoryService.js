import api, { unwrap } from './api';

export const categoryService = {
  getAll: () => unwrap(api.get('/categories')),
  create: (payload) => unwrap(api.post('/categories', payload)),
  update: (id, payload) => unwrap(api.put(`/categories/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/categories/${id}`)),
};
