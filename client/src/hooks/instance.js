import axios from 'axios';
import { getAuthHeader } from '../services/Authentication.service';
import toast from 'react-hot-toast';
import { getDeviceId } from '../component/commonComponent/common';

console.log('import.meta.env.VITE_SERVER_URL', import.meta.env.VITE_SERVER_URL);

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'https://taskium-mu.vercel.app/',
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor

axiosInstance.interceptors.request.use(
  (config) => {
    const authHeader = getAuthHeader();
    const deviceId = getDeviceId();
    config.headers = { ...config.headers, ...authHeader,'X-Device-Id': deviceId };
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("persistantState");
      if(window.location.pathname!=='/login')
        window.location.href = '/login';
    }
    const errorResponse = {
      status: error.response?.status || 500,
      message: error.message || 'An unexpected error occurred',
      details: error.response?.data,
    };
    return Promise.reject(errorResponse);
  }
)

//create request function

function createRequest (method, baseUrl, responseType = 'json') {
  return async (url, data = {}, options = {}) => {

    const isParamsMethod = method == 'get' || method == 'delete';
    const { status, error, ...configOptions } = options;
    const requestConfig = {
      url: `${baseUrl}${url}`,
      method,
      responseType,
      ...configOptions,
    };
    if (isParamsMethod) {
      requestConfig.params = data;
    } else {
      requestConfig.data = data;
    }
    try {
      const response = await axiosInstance.request(requestConfig);
      if (status) {
        return {
          data: response.data,
          status: response.status,
          headers: response.headers,
        };
      }
      return response.data;
    }
    catch (error) {
      const errorResponse = {
        status: error.status || 500,
        message: error.message || 'Request failed',
        details: error.details,
      };
      throw errorResponse;
    }
  }
}

export default function useApi(baseUrl = '/api') {
  return {
    get: createRequest('get', baseUrl),
    post: createRequest('post', baseUrl),
    put: createRequest('put', baseUrl),
    patch: createRequest('patch', baseUrl),
    delete: createRequest('delete', baseUrl),
    download: createRequest('get', baseUrl, 'blob'),
  };
}