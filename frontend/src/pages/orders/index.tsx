import React, { useState, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  PlusIcon, 
  ShoppingBagIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { useForm, useFieldArray } from 'react-hook-form';
import { useOrders, useCreateOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useItems } from '@/hooks/useItems';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Loading from '@/components/UI/Loading';
import type { Order, CreateOrderRequest, OrderItem } from '@/types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateOrderModal({ isOpen, onClose }: OrderModalProps) {
  const { data: items } = useItems();
  const createOrderMutation = useCreateOrder();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<CreateOrderRequest>({
    defaultValues: {
      items: [{ item: '', quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const onSubmit = async (data: CreateOrderRequest) => {
    try {
      await createOrderMutation.mutateAsync(data);
      onClose();
      reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const addOrderItem = () => {
    append({ item: '', quantity: 1 });
  };

  const removeOrderItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Create New Order
                </Dialog.Title>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="label">Order Items</label>
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex space-x-2">
                          <div className="flex-1">
                            <select
                              className="input"
                              {...register(`items.${index}.item`, {
                                required: 'Please select an item'
                              })}
                            >
                              <option value="">Select an item</option>
                              {items?.map(item => (
                                <option key={item._id} value={item.itemId}>
                                  {item.name} - Stock: {item.stockQuantity} - ${item.price}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-24">
                            <Input
                              type="number"
                              min="1"
                              placeholder="Qty"
                              {...register(`items.${index}.quantity`, {
                                required: 'Quantity is required',
                                min: { value: 1, message: 'Minimum quantity is 1' }
                              })}
                            />
                          </div>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => removeOrderItem(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {(errors.items as any) && (
                      <p className="text-red-600 text-sm mt-1">Please fix the item errors above</p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOrderItem}
                      className="mt-3"
                    >
                      Add Item
                    </Button>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={createOrderMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={createOrderMutation.isPending}
                    >
                      Create Order
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  const { data: items } = useItems();
  const { role } = useAuthStore();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const itemsMap = useMemo(() => {
    const map = new Map();
    items?.forEach(item => {
      map.set(item.itemId.toString(), item);  // Use itemId as string key
      map.set(item._id, item);  // Also keep _id for compatibility
    });
    return map;
  }, [items]);

  const handleStatusUpdate = async (status: 'waiting' | 'sent' | 'canceled') => {
    if (order) {
      try {
        await updateOrderStatusMutation.mutateAsync({ 
          id: order._id, 
          data: { status } 
        });
        onClose();
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const badges = {
      waiting: 'badge-warning',
      sent: 'badge-success',
      canceled: 'badge-danger',
    };
    return badges[status as keyof typeof badges] || 'badge-gray';
  };

  const calculateTotal = () => {
    return order.items.reduce((total, orderItem) => {
      // Try to get item by itemId (as string) or _id
      const item = itemsMap.get(orderItem.item.toString()) || itemsMap.get(orderItem.item);
      return total + (item ? item.price * orderItem.quantity : 0);
    }, 0);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900">
                    Order #{order.orderId}
                  </Dialog.Title>
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Created</p>
                      <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-medium">${calculateTotal().toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-medium">#{order.userId}</p>
                    </div>
                    {role === 'admin' && order.username && (
                      <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p className="font-medium">{order.username}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Items</h3>
                    <div className="space-y-2">
                      {order.items.map((orderItem, index) => {
                        const item = itemsMap.get(orderItem.item.toString()) || itemsMap.get(orderItem.item);
                        return (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-medium">{item?.name || 'Unknown Item'}</p>
                              <p className="text-sm text-gray-600">
                                ${item?.price || 0} × {orderItem.quantity}
                              </p>
                            </div>
                            <p className="font-medium">
                              ${((item?.price || 0) * orderItem.quantity).toFixed(2)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status Update Actions */}
                  {role === 'admin' && order.status !== 'canceled' && (
                    <div className="border-t pt-4">
                      <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                      <div className="flex space-x-2">
                        {order.status !== 'sent' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusUpdate('sent')}
                            loading={updateOrderStatusMutation.isPending}
                          >
                            Mark as Sent
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusUpdate('canceled')}
                          loading={updateOrderStatusMutation.isPending}
                        >
                          Cancel Order
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      variant="secondary"
                      onClick={onClose}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function OrdersPage() {
  const { role } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const { data: orders, isLoading } = useOrders({
    status: statusFilter as "waiting" | "sent" | "canceled" | undefined,
  });

  const filteredOrders = orders || [];

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      waiting: 'badge-warning',
      sent: 'badge-success',
      canceled: 'badge-danger',
    };
    return badges[status as keyof typeof badges] || 'badge-gray';
  };

  if (isLoading) {
    return <Loading text="Loading orders..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and track inventory</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          icon={PlusIcon}
        >
          Create Order
        </Button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-48"
          >
            <option value="">All Orders</option>
            <option value="waiting">Waiting</option>
            <option value="sent">Sent</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {orders?.length === 0 
                ? "Start by creating your first order."
                : "Try adjusting your filter criteria."
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  {role === 'admin' && <th>Customer</th>}
                  <th>Items</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="font-medium">#{order.orderId}</td>
                    <td>#{order.userId}</td>
                    {role === 'admin' && (
                      <td>{order.username || `User #${order.userId}`}</td>
                    )}
                    <td>{order.items.length} items</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                          icon={EyeIcon}
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

OrdersPage.title = 'Orders';