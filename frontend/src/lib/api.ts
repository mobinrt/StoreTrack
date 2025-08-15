import axios from 'axios';
import Cookies from 'js-cookie';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Item,
  CreateItemRequest,
  UpdateItemRequest,
  ItemFilters,
  Order,
  CreateOrderRequest,
  UpdateOrderStatusRequest,
  OrderFilters,
  StockHistory,
  StockHistoryFilters,
  LowStockReport,
  SalesReport,
  SalesReportFilters,
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      Cookies.remove('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<{ message: string; id: string }> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

// Items API
export const itemsApi = {
  getAll: async (filters: ItemFilters = {}): Promise<Item[]> => {
    const response = await api.get('/items', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  create: async (data: CreateItemRequest): Promise<Item> => {
    const response = await api.post('/items', data);
    return response.data;
  },

  update: async (id: string, data: UpdateItemRequest): Promise<Item> => {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  getAll: async (filters: OrderFilters = {}): Promise<Order[]> => {
    const response = await api.get('/orders', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id: string, data: UpdateOrderStatusRequest): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },
};

// Stock History API
export const stockHistoryApi = {
  getAll: async (filters: StockHistoryFilters = {}): Promise<StockHistory[]> => {
    const response = await api.get('/stock-history', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<StockHistory> => {
    const response = await api.get(`/stock-history/${id}`);
    return response.data;
  },
};

// Reports API
export const reportsApi = {
  lowStock: async (threshold: number = 5): Promise<LowStockReport> => {
    const response = await api.get(`/reports/low-stock?threshold=${threshold}`);
    return response.data;
  },

  sales: async (filters: SalesReportFilters = {}): Promise<SalesReport> => {
    const response = await api.get('/reports/sales', { params: filters });
    return response.data;
  },
};

export default api;