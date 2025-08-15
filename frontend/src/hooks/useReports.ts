import { useQuery } from '@tanstack/react-query';
import { reportsApi, stockHistoryApi } from '@/lib/api';
import type { LowStockReport, SalesReport, SalesReportFilters, StockHistoryFilters } from '@/types';

export const useLowStockReport = (threshold: number = 5) => {
  return useQuery({
    queryKey: ['reports', 'low-stock', threshold],
    queryFn: () => reportsApi.lowStock(threshold),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSalesReport = (filters: SalesReportFilters = {}) => {
  return useQuery({
    queryKey: ['reports', 'sales', filters],
    queryFn: () => reportsApi.sales(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useStockHistory = (filters: StockHistoryFilters = {}) => {
  return useQuery({
    queryKey: ['stock-history', filters],
    queryFn: () => stockHistoryApi.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useStockHistoryItem = (id: string) => {
  return useQuery({
    queryKey: ['stock-history', id],
    queryFn: () => stockHistoryApi.getById(id),
    enabled: !!id,
  });
};