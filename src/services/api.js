import axios from 'axios';
import { clearToken, getToken } from './tokenStorage';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';
export const isMockApi = USE_MOCK_API;
export const UNAUTHORIZED_EVENT = 'finora:unauthorized';

/** Error shape every component can rely on, regardless of what the server returned. */
export class ApiError extends Error {
  constructor(message, { status = 0, errors = {} } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors; // field -> message, e.g. Laravel validation errors
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// During development without a backend, requests are answered by the in-browser mock API.
// The mock is code-split, so it is never loaded when VITE_USE_MOCK_API=false.
if (USE_MOCK_API) {
  api.defaults.adapter = (config) => import('./mock/mockAdapter').then((module) => module.mockAdapter(config));
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Laravel returns `errors: { field: ['message'] }`; flatten to `{ field: 'message' }`. */
function flattenFieldErrors(errors = {}) {
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, Array.isArray(messages) ? messages[0] : messages]),
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config?.skipAuthRedirect) {
      clearToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    const message = response
      ? response.data?.message || 'Something went wrong. Please try again.'
      : error.code === 'ECONNABORTED'
        ? 'The request timed out. Please try again.'
        : 'Unable to reach the server. Check your connection and try again.';
    return Promise.reject(
      new ApiError(message, { status: response?.status || 0, errors: flattenFieldErrors(response?.data?.errors) }),
    );
  },
);

/** Resolves with `response.data` so services return plain payloads. */
export const unwrap = (request) => request.then((response) => response.data);

export default api;
