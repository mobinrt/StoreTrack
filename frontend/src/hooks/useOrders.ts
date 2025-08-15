import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '@/lib/api';
import type { Order, CreateOrderRequest, UpdateOrderStatusRequest, OrderFilters } from '@/types';
import { useUIStore } from '@/store/ui';

export const useOrders = (filters: OrderFilters = {}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => {
      // Convert item IDs to numbers
      const formattedData = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          item: typeof item.item === 'string' ? parseInt(item.item) : item.item,
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity
        }))
      };
      return ordersApi.create(formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['items'] }); // Refresh items to show updated stock
      queryClient.invalidateQueries({ queryKey: ['stock-history'] });
      showNotification('Order created successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create order';
      showNotification(message, 'error');
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderStatusRequest }) => 
      ordersApi.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['items'] }); // Refresh items for stock updates
      queryClient.invalidateQueries({ queryKey: ['stock-history'] });
      showNotification('Order status updated successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update order status';
      showNotification(message, 'error');
    },
  });
};