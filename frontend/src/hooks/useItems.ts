import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '@/lib/api';
import type { Item, CreateItemRequest, UpdateItemRequest, ItemFilters } from '@/types';
import { useUIStore } from '@/store/ui';

export const useItems = (filters: ItemFilters = {}) => {
  return useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useItem = (id: string) => {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (data: CreateItemRequest) => itemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showNotification('Item created successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create item';
      showNotification(message, 'error');
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRequest }) => 
      itemsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
      showNotification('Item updated successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update item';
      showNotification(message, 'error');
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => itemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showNotification('Item deleted successfully', 'success');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to delete item';
      showNotification(message, 'error');
    },
  });
};