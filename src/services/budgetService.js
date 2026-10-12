import api, { unwrap } from './api';

export const budgetService = {
  getAll: () => unwrap(api.get('/budgets')),
  create: (payload) => unwrap(api.post('/budgets', payload)),
  update: (id, payload) => unwrap(api.put(`/budgets/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/budgets/${id}`)),
};
