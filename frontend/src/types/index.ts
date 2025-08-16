// API Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface User {
  _id: string;
  userId: number;
  username: string;
  role: 'admin' | 'staff';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  role: 'admin' | 'staff';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  role: 'admin' | 'staff';
}

// Item Types
export interface Item {
  _id: string;
  itemId: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemRequest {
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
}

export interface UpdateItemRequest {
  name?: string;
  category?: string;
  price?: number;
  stockQuantity?: number;
}

export interface ItemFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  limit?: number;
  page?: number;
}

// Order Types
export interface OrderItem {
  item: number | string; // itemId - number for API, string from form
  quantity: number;
}

export interface Order {
  _id: string;
  orderId: number;
  userId: number;
  username?: string; // Only available for admin
  items: OrderItem[];
  status: 'waiting' | 'sent' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
}

export interface UpdateOrderStatusRequest {
  status: 'waiting' | 'sent' | 'canceled';
}

export interface OrderFilters {
  status?: 'waiting' | 'sent' | 'canceled';
}

// Stock History Types
export interface StockHistory {
  _id: string;
  stockHistoryId: number;
  item: string; // itemId
  changeType: 'in' | 'out';
  quantity: number;
  orderId?: string;
  createdAt: string;
}

export interface StockHistoryFilters {
  item?: string;
  changeType?: 'in' | 'out';
  limit?: number;
  page?: number;
}

// Report Types
export interface LowStockReport {
  threshold: number;
  count: number;
  items: Item[];
}

export interface SalesReportItem {
  name: string;
  sold: number;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  topSelling: SalesReportItem[];
}

export interface SalesReportFilters {
  start?: string; // date string
  end?: string;   // date string
}

// UI Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

// Dashboard Types
export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  lowStockAlert: Item[];
}

// Chart Types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
      beginAtZero?: boolean;
    };
  };
}