import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LikedItemsService } from '@/lib/supabase/liked-items-service';
import { LikedItemsResponse, LikedItem } from '@/lib/types/liked-items';
import { toast } from '@/hooks/use-toast';

interface UseLikedItemsOptions {
  itemType?: string;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useLikedItems(options: UseLikedItemsOptions = {}) {
  const { itemType, page = 1, limit = 20, enabled = true } = options;
  const queryClient = useQueryClient();

  // Fetch liked items
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['liked-items', itemType, page, limit],
    queryFn: () => LikedItemsService.getLikedItems(page, limit, itemType),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Remove multiple items mutation
  const removeMultipleMutation = useMutation({
    mutationFn: LikedItemsService.removeMultipleItems,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['liked-items'] });
      toast({
        title: 'Items removed',
        description: `${result.removed} items removed from your liked items`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to remove items',
        variant: 'destructive',
      });
    },
  });

  // Remove single item
  const removeItem = useCallback((itemId: string) => {
    removeMultipleMutation.mutate([itemId]);
  }, [removeMultipleMutation]);

  // Remove multiple items
  const removeMultiple = useCallback((itemIds: string[]) => {
    removeMultipleMutation.mutate(itemIds);
  }, [removeMultipleMutation]);

  // Get all items
  const items = data?.items || [];
  const totalCount = data?.total || 0;
  const hasMore = data?.hasMore || false;

  return {
    items,
    totalCount,
    isLoading,
    error,
    hasMore,
    page,
    refetch,
    removeItem,
    removeMultiple,
    removeMultipleMutation,
  };
}

// Hook for searching liked items
export function useSearchLikedItems(query: string, options: UseLikedItemsOptions = {}) {
  const { page = 1, limit = 20, enabled = true } = options;

  return useQuery({
    queryKey: ['liked-items-search', query, page, limit],
    queryFn: () => LikedItemsService.searchLikedItems(query, page, limit),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
}

// Hook for getting liked items by type
export function useLikedItemsByType(itemType: string, options: UseLikedItemsOptions = {}) {
  return useLikedItems({ ...options, itemType });
}
