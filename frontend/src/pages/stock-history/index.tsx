import React, { useState } from 'react';
import { ClockIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { useStockHistory } from '@/hooks/useReports';
import { useItems } from '@/hooks/useItems';
import Loading from '@/components/UI/Loading';
import Input from '@/components/UI/Input';

export default function StockHistoryPage() {
  const [itemFilter, setItemFilter] = useState('');
  const [changeTypeFilter, setChangeTypeFilter] = useState('');

  const { data: stockHistory, isLoading } = useStockHistory({
    item: itemFilter || undefined,
    changeType: changeTypeFilter as "in" | "out" | undefined,
  });

  const { data: items } = useItems();

  // Create a map of item IDs to item names for display
  const itemsMap = new Map();
  items?.forEach(item => {
    itemsMap.set(item.itemId.toString(), item); // Map by itemId as string
    itemsMap.set(item._id, item); // Also keep _id for compatibility
  });

  if (isLoading) {
    return <Loading text="Loading stock history..." />;
  }

  const getChangeTypeIcon = (changeType: string) => {
    return changeType === 'in' ? (
      <ArrowUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getChangeTypeBadge = (changeType: string) => {
    return changeType === 'in' ? 'badge-success' : 'badge-danger';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock History</h1>
        <p className="text-gray-600">Track all inventory changes and movements</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <select
              value={itemFilter}
              onChange={(e) => setItemFilter(e.target.value)}
              className="input"
            >
              <option value="">All Items</option>
              {items?.map(item => (
                <option key={item._id} value={item.itemId}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={changeTypeFilter}
              onChange={(e) => setChangeTypeFilter(e.target.value)}
              className="input"
            >
              <option value="">All Changes</option>
              <option value="in">Stock In</option>
              <option value="out">Stock Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stock History Table */}
      <div className="card">
        {!stockHistory || stockHistory.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stock history found</h3>
            <p className="text-gray-600">
              Stock movements will appear here as they occur.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Change Type</th>
                  <th>Quantity</th>
                  <th>Order ID</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory.map((history) => {
                  const item = itemsMap.get(history.item.toString()) || itemsMap.get(history.item);
                  return (
                    <tr key={history._id}>
                      <td className="font-medium">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium">{item?.name || `Item #${history.item}`}</p>
                            <p className="text-sm text-gray-600">{item?.category || 'ID: ' + history.item}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {getChangeTypeIcon(history.changeType)}
                          <span className={`badge ${getChangeTypeBadge(history.changeType)}`}>
                            {history.changeType === 'in' ? 'Stock In' : 'Stock Out'}
                          </span>
                        </div>
                      </td>
                      <td className="font-medium">
                        <span className={history.changeType === 'in' ? 'text-green-600' : 'text-red-600'}>
                          {history.changeType === 'in' ? '+' : '-'}{history.quantity}
                        </span>
                      </td>
                      <td>
                        {history.orderId ? (
                          <span className="badge badge-info">#{history.orderId}</span>
                        ) : (
                          <span className="text-gray-400">Manual</span>
                        )}
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">
                            {new Date(history.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(history.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

StockHistoryPage.title = 'Stock History';