import api, { unwrap } from './api';

export const transactionService = {
  getAll: (params) => unwrap(api.get('/transactions', { params })),
  getById: (id) => unwrap(api.get(`/transactions/${id}`)),
  create: (payload) => unwrap(api.post('/transactions', payload)),
  update: (id, payload) => unwrap(api.put(`/transactions/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/transactions/${id}`)),
};
