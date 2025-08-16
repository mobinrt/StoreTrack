import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '@/lib/api';
import type { Item, CreateItemRequest, UpdateItemRequest, ItemFilters } from '@/types';

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

  return useMutation({
    mutationFn: (data: CreateItemRequest) => itemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error: any) => {
      console.error('Failed to create item:', error);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItemRequest }) => 
      itemsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
    onError: (error: any) => {
      console.error('Failed to update item:', error);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => itemsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete item:', error);
    },
  });
};