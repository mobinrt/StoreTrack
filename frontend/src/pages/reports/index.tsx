import React, { useState } from 'react';
import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { useLowStockReport, useSalesReport } from '@/hooks/useReports';
import Loading from '@/components/UI/Loading';

export default function ReportsPage() {
  const [lowStockThreshold, setLowStockThreshold] = useState(5);
  const [salesStartDate, setSalesStartDate] = useState('');
  const [salesEndDate, setSalesEndDate] = useState('');

  const { data: lowStockReport, isLoading: lowStockLoading } = useLowStockReport(lowStockThreshold);
  const { data: salesReport, isLoading: salesLoading } = useSalesReport({
    start: salesStartDate || undefined,
    end: salesEndDate || undefined,
  });

  const isLoading = lowStockLoading || salesLoading;

  if (isLoading) {
    return <Loading text="Loading reports..." />;
  }

  const resetSalesFilter = () => {
    setSalesStartDate('');
    setSalesEndDate('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600">Analytics and insights for your inventory</p>
      </div>

      {/* Low Stock Report */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-yellow-500" />
              Low Stock Report
            </h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Threshold:</label>
              <select
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(Number(e.target.value))}
                className="input w-20"
              >
                {[1, 2, 3, 4, 5, 10, 15, 20].map(value => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">Low Stock Items</p>
                  <p className="text-2xl font-bold text-yellow-800">{lowStockReport?.count || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <ChartBarIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-blue-700">Threshold</p>
                  <p className="text-2xl font-bold text-blue-800">{lowStockThreshold}</p>
                </div>
              </div>
            </div>
          </div>

          {lowStockReport && lowStockReport.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockReport.items.map((item) => (
                    <tr key={item._id}>
                      <td className="font-medium">{item.name}</td>
                      <td>{item.category}</td>
                      <td>
                        <span className={`font-bold ${
                          item.stockQuantity === 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {item.stockQuantity}
                        </span>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <span className={`badge ${
                          item.stockQuantity === 0 ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {item.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">All items are above the stock threshold</p>
            </div>
          )}
        </div>
      </div>

      {/* Sales Report */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
            Sales Report
          </h2>
          
          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                placeholder="Start date"
                value={salesStartDate}
                onChange={(e) => setSalesStartDate(e.target.value)}
                className="input w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">to</span>
              <input
                type="date"
                placeholder="End date"
                value={salesEndDate}
                onChange={(e) => setSalesEndDate(e.target.value)}
                className="input w-40"
              />
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={resetSalesFilter}
            >
              Clear Dates
            </button>
          </div>
        </div>

        {salesReport ? (
          <div className="space-y-6">
            {/* Sales Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-800">
                      ${salesReport.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <ChartBarIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-800">{salesReport.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-700">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-purple-800">
                      ${salesReport.totalOrders > 0 
                        ? (salesReport.totalRevenue / salesReport.totalOrders).toFixed(2)
                        : '0.00'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Selling Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Top Selling Items</h3>
              {salesReport.topSelling.length > 0 ? (
                <div className="space-y-3">
                  {salesReport.topSelling.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.sold} units sold</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ 
                              width: `${(item.sold / (salesReport.topSelling[0]?.sold || 1)) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-12 text-right">
                          {item.sold}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No sales data available for the selected period</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading sales data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

ReportsPage.title = 'Reports';