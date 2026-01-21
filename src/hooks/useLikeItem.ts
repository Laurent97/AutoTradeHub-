import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LikedItemsService } from '@/lib/supabase/liked-items-service';
import { LikeResponse, LikeStatus, LikedItemData } from '@/lib/types/liked-items';
import { toast } from '@/hooks/use-toast';

interface UseLikeItemOptions {
  onSuccess?: (response: LikeResponse) => void;
  onError?: (error: Error) => void;
  showToasts?: boolean;
}

export function useLikeItem(options: UseLikeItemOptions = {}) {
  const { onSuccess, onError, showToasts = true } = options;
  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<Set<string>>(new Set());

  // Like/Unlike mutation
  const mutation = useMutation({
    mutationFn: ({ itemType, itemId, itemData }: { itemType: string; itemId: string; itemData: LikedItemData }) =>
      LikedItemsService.likeItem(itemType, itemId, itemData),
    onMutate: async ({ itemType, itemId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['like-status', itemType, itemId] });
      await queryClient.cancelQueries({ queryKey: ['liked-items'] });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(['like-status', itemType, itemId]);

      // Optimistically update
      setOptimisticUpdates(prev => new Set(prev).add(`${itemType}-${itemId}`));
      
      queryClient.setQueryData(['like-status', itemType, itemId], (old: LikeStatus | undefined) => ({
        isLiked: !old?.isLiked,
        totalLikes: (old?.totalLikes || 0) + (old?.isLiked ? -1 : 1),
      }));

      return { previousStatus };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousStatus) {
        queryClient.setQueryData(['like-status', variables.itemType, variables.itemId], context.previousStatus);
      }
      
      if (showToasts) {
        toast({
          title: 'Error',
          description: 'Failed to update like status',
          variant: 'destructive',
        });
      }
      
      onError?.(error as Error);
    },
    onSuccess: (response, variables) => {
      // Update with actual server response
      queryClient.setQueryData(['like-status', variables.itemType, variables.itemId], {
        isLiked: response.isLiked,
        totalLikes: response.totalLikes,
      });

      // Invalidate liked items list
      queryClient.invalidateQueries({ queryKey: ['liked-items'] });

      if (showToasts) {
        toast({
          title: response.isLiked ? 'Item liked!' : 'Item unliked',
          description: response.isLiked 
            ? 'Added to your liked items' 
            : 'Removed from your liked items',
        });
      }

      onSuccess?.(response);
    },
    onSettled: () => {
      // Remove from optimistic updates
      setOptimisticUpdates(new Set());
    },
  });

  // Toggle like status
  const toggleLike = useCallback((itemType: string, itemId: string, itemData: LikedItemData) => {
    mutation.mutate({ itemType, itemId, itemData });
  }, [mutation]);

  // Check if currently being updated optimistically
  const isOptimistic = useCallback((itemType: string, itemId: string) => {
    return optimisticUpdates.has(`${itemType}-${itemId}`);
  }, [optimisticUpdates]);

  return {
    toggleLike,
    isLoading: mutation.isPending,
    isOptimistic,
    error: mutation.error,
  };
}

// Hook for getting like status of a specific item
export function useLikeStatus(itemType: string, itemId: string) {
  return useQuery({
    queryKey: ['like-status', itemType, itemId],
    queryFn: () => LikedItemsService.getLikeStatus(itemType, itemId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (replaced cacheTime)
  });
}

// Hook for offline support - queue likes when offline
export function useOfflineLikes() {
  const [queuedLikes, setQueuedLikes] = useState<Array<{
    itemType: string;
    itemId: string;
    itemData: LikedItemData;
    action: 'like' | 'unlike';
  }>>([]);

  const isOnline = navigator.onLine;

  // Process queued likes when coming back online
  const processQueuedLikes = useCallback(async () => {
    if (!isOnline || queuedLikes.length === 0) return;

    const promises = queuedLikes.map(async (queuedLike) => {
      try {
        if (queuedLike.action === 'like') {
          await LikedItemsService.likeItem(queuedLike.itemType, queuedLike.itemId, queuedLike.itemData);
        } else {
          await LikedItemsService.unlikeItem(queuedLike.itemType, queuedLike.itemId);
        }
      } catch (error) {
        console.error('Failed to process queued like:', error);
      }
    });

    await Promise.all(promises);
    setQueuedLikes([]);
  }, [isOnline, queuedLikes]);

  // Queue a like action for when offline
  const queueLike = useCallback((itemType: string, itemId: string, itemData: LikedItemData, action: 'like' | 'unlike' = 'like') => {
    setQueuedLikes(prev => [...prev, { itemType, itemId, itemData, action }]);
  }, []);

  return {
    queuedLikes,
    queueLike,
    processQueuedLikes,
    isOnline,
  };
}
