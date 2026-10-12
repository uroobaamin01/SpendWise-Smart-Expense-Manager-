import api, { unwrap } from './api';

export const authService = {
  login: (credentials) => unwrap(api.post('/auth/login', credentials, { skipAuthRedirect: true })),
  register: (payload) => unwrap(api.post('/auth/register', payload, { skipAuthRedirect: true })),
  forgotPassword: (email) => unwrap(api.post('/auth/forgot-password', { email }, { skipAuthRedirect: true })),
  getCurrentUser: () => unwrap(api.get('/auth/me')),
  updateProfile: (payload) => unwrap(api.put('/profile', payload)),
  changePassword: (payload) => unwrap(api.put('/profile/password', payload)),
};
