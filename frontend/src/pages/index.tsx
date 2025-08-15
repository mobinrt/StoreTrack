import React from 'react';
import { 
  CubeIcon, 
  ShoppingBagIcon, 
  ExclamationTriangleIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useItems } from '@/hooks/useItems';
import { useOrders } from '@/hooks/useOrders';
import { useLowStockReport, useSalesReport } from '@/hooks/useReports';
import { useAuthStore } from '@/store/auth';
import Loading from '@/components/UI/Loading';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: 'primary' | 'success' | 'warning' | 'danger';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${
                !trend.isPositive ? 'transform rotate-180' : ''
              }`} />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { role } = useAuthStore();
  const { data: items, isLoading: itemsLoading } = useItems();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: lowStockReport, isLoading: lowStockLoading } = useLowStockReport();
  const { data: salesReport, isLoading: salesLoading } = useSalesReport();

  const isLoading = itemsLoading || ordersLoading || lowStockLoading || (role === 'admin' && salesLoading);

  if (isLoading) {
    return <Loading text="Loading dashboard..." />;
  }

  // Calculate stats
  const totalItems = items?.length || 0;
  const lowStockCount = lowStockReport?.count || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'waiting').length || 0;
  const totalRevenue = salesReport?.totalRevenue || 0;

  // Recent orders (last 5)
  const recentOrders = orders?.slice(0, 5) || [];

  const getStatusBadge = (status: string) => {
    const badges = {
      waiting: 'badge-warning',
      sent: 'badge-success',
      canceled: 'badge-danger',
    };
    return badges[status as keyof typeof badges] || 'badge-gray';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl text-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-white">
          Welcome back, {role === 'admin' ? 'Administrator' : 'Staff Member'}!
        </h1>
        <p className="text-blue-50 opacity-90">
          Here's an overview of your inventory management system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={CubeIcon}
          color="primary"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={ExclamationTriangleIcon}
          color="warning"
        />
        <StatCard
          title="Total Orders"
          value={totalOrders}
          icon={ShoppingBagIcon}
          color="success"
        />
        {role === 'admin' && (
          <StatCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={ChartBarIcon}
            color="primary"
          />
        )}
        {role === 'staff' && (
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={ClockIcon}
            color="warning"
          />
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Recent Orders
            </h2>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent orders</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.orderId}</p>
                    <p className="text-sm text-gray-600">{order.items.length} items</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Low Stock Alert
            </h2>
          </div>
          <div className="space-y-4">
            {lowStockReport?.items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">All items are well stocked</p>
            ) : (
              lowStockReport?.items.slice(0, 5).map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-xs text-gray-500">${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-600">{item.stockQuantity}</p>
                    <p className="text-xs text-gray-500">in stock</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Admin-only Sales Report */}
      {role === 'admin' && salesReport && (
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="w-5 h-5 mr-2" />
              Top Selling Items
            </h2>
          </div>
          <div className="space-y-4">
            {salesReport.topSelling.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No sales data available</p>
            ) : (
              salesReport.topSelling.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.sold} units sold</p>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ 
                        width: `${(item.sold / (salesReport.topSelling[0]?.sold || 1)) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Set page title for layout
Dashboard.title = 'Dashboard';