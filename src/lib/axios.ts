import { store } from '@/store';
import { logout } from '@/store/slices/auth.slice';
import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Refresh queue to prevent concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === '/v1/auth/refresh'
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => apiClient(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/auth/refresh`, null, {
        withCredentials: true,
      });
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      const wasAuthenticated = store.getState().auth.isAuthenticated;
      // Dispatch logout so AuthGuard redirects to /login.
      store.dispatch(logout());
      // Only toast if the user had an active session — not on initial page load with no cookies.
      if (wasAuthenticated) {
        toast.error('Session expired. Please log in again.');
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
