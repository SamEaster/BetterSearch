import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiErrorDetail {
  code?: string;
  message?: string;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorData = error.response?.data?.detail;
    const message =
      typeof errorData === 'string'
        ? errorData
        : errorData?.message || error.message || 'Network request failed';
    const code = errorData?.code || 'UNKNOWN_ERROR';

    return Promise.reject({
      status: error.response?.status || 500,
      code,
      message,
    });
  }
);
