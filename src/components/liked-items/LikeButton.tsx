import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LikedItemData } from '@/lib/types/liked-items';
import { useLikeItem, useLikeStatus } from '@/hooks/useLikeItem';

interface LikeButtonProps {
  itemType: string;
  itemId: string;
  itemData: LikedItemData;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
}

export function LikeButton({
  itemType,
  itemId,
  itemData,
  size = 'md',
  showCount = true,
  className,
  disabled = false,
  variant = 'default',
}: LikeButtonProps) {
  const { toggleLike, isLoading, isOptimistic } = useLikeItem({
    showToasts: true,
  });
  
  const { data: likeStatus } = useLikeStatus(itemType, itemId);
  const [showUndo, setShowUndo] = useState(false);

  const isLiked = likeStatus?.isLiked || false;
  const totalLikes = likeStatus?.totalLikes || 0;
  const isCurrentlyLoading = isLoading || isOptimistic(itemType, itemId);

  const handleLike = async () => {
    if (disabled || isCurrentlyLoading) return;
    
    await toggleLike(itemType, itemId, itemData);
    
    // Show undo notification briefly
    if (!isLiked) {
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 3000);
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const variantClasses = {
    default: isLiked
      ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border-gray-300',
    outline: isLiked
      ? 'border-red-500 text-red-500 hover:bg-red-50'
      : 'border-gray-300 text-gray-600 hover:bg-gray-50',
    ghost: isLiked
      ? 'text-red-500 hover:bg-red-50'
      : 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <div className="relative">
      <button
        onClick={handleLike}
        disabled={disabled || isCurrentlyLoading}
        className={cn(
          'inline-flex items-center gap-2 rounded-md border transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          buttonSizes[size],
          variantClasses[variant],
          isCurrentlyLoading && 'animate-pulse',
          className
        )}
        aria-label={isLiked ? 'Unlike item' : 'Like item'}
        aria-pressed={isLiked ? 'true' : 'false'}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            'transition-all duration-200',
            isLiked ? 'fill-current' : '',
            !isLiked && 'hover:scale-110'
          )}
        />
        
        {showCount && (
          <span className="font-medium">
            {totalLikes}
          </span>
        )}
        
        {isCurrentlyLoading && (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
      </button>

      {/* Undo notification */}
      {showUndo && !isLiked && (
        <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <button
              onClick={() => toggleLike(itemType, itemId, itemData)}
              className="underline hover:no-underline"
            >
              Undo
            </button>
            <span className="ml-1">• Item liked</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Simpler like button for cards and lists
export function SimpleLikeButton({
  itemType,
  itemId,
  itemData,
  className,
}: {
  itemType: string;
  itemId: string;
  itemData: LikedItemData;
  className?: string;
}) {
  const { toggleLike, isLoading, isOptimistic } = useLikeItem({ showToasts: false });
  const { data: likeStatus } = useLikeStatus(itemType, itemId);

  const isLiked = likeStatus?.isLiked || false;
  const isCurrentlyLoading = isLoading || isOptimistic(itemType, itemId);

  return (
    <button
      onClick={() => toggleLike(itemType, itemId, itemData)}
      disabled={isCurrentlyLoading}
      className={cn(
        'p-2 rounded-full transition-all duration-200',
        'hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isCurrentlyLoading && 'animate-pulse',
        className
      )}
      aria-label={isLiked ? 'Unlike item' : 'Like item'}
      aria-pressed={isLiked ? 'true' : 'false'}
    >
      <Heart
        className={cn(
          'w-4 h-4 transition-all duration-200',
          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400',
          !isLiked && 'hover:scale-110 hover:text-red-500'
        )}
      />
    </button>
  );
}
