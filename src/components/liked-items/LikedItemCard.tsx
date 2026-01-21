import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ExternalLink, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/utils/format';
import { LikedItem } from '@/lib/types/liked-items';

interface LikedItemCardProps {
  item: LikedItem;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onRemove?: () => void;
  showActions?: boolean;
  className?: string;
}

export function LikedItemCard({
  item,
  isSelected = false,
  onSelect,
  onRemove,
  showActions = true,
  className,
}: LikedItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const { item_data } = item;

  const getItemLink = () => {
    switch (item.item_type) {
      case 'product':
        return `/products/${item.item_id}`;
      case 'store':
        return `/store/${item_data.slug}`;
      case 'service':
        return `/services/${item.item_id}`;
      default:
        return '#';
    }
  };

  const getItemPrice = () => {
    if (item_data.price) {
      return formatPrice(item_data.price);
    }
    return 'Price not available';
  };

  const getItemImage = () => {
    if (imageError || !item_data.image) {
      return '/placeholder.svg';
    }
    return item_data.image;
  };

  const getItemTypeLabel = () => {
    switch (item.item_type) {
      case 'product':
        return 'Product';
      case 'store':
        return 'Store';
      case 'service':
        return 'Service';
      case 'post':
        return 'Post';
      default:
        return 'Item';
    }
  };

  const getItemTypeColor = () => {
    switch (item.item_type) {
      case 'product':
        return 'bg-blue-100 text-blue-800';
      case 'store':
        return 'bg-green-100 text-green-800';
      case 'service':
        return 'bg-purple-100 text-purple-800';
      case 'post':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
        'hover:shadow-lg transition-all duration-200',
        'overflow-hidden',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        className
      )}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            className="bg-white border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
          />
        </div>
      )}

      {/* Actions Dropdown */}
      {showActions && (
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onRemove}>
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Remove
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={getItemLink()} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in new tab
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Item Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={getItemImage()}
          alt={item_data.title || 'Item image'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={getItemTypeColor()}>
            {getItemTypeLabel()}
          </Badge>
        </div>

        {/* Like Status */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2">
            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          </div>
        </div>
      </div>

      {/* Item Content */}
      <div className="p-4">
        {/* Title */}
        <Link to={getItemLink()}>
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {item_data.title || 'Untitled Item'}
          </h3>
        </Link>

        {/* Description */}
        {item_data.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
            {item_data.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {/* Price */}
            {item_data.price && (
              <span className="font-bold text-lg text-green-600 dark:text-green-400">
                {getItemPrice()}
              </span>
            )}

            {/* Rating */}
            {item_data.rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item_data.rating}
                </span>
              </div>
            )}
          </div>

          {/* Location/Store */}
          {(item_data.location || item_data.store_name) && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item_data.location || item_data.store_name}
            </span>
          )}
        </div>

        {/* Additional Details */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          {item_data.make && item_data.model && (
            <span>{item_data.make} {item_data.model}</span>
          )}
          {item_data.year && <span>{item_data.year}</span>}
          {item_data.condition && <span>{item_data.condition}</span>}
          {item_data.category && <span>{item_data.category}</span>}
        </div>

        {/* Liked Date */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Liked {new Date(item.liked_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Grid view wrapper
export function LikedItemGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

// List view wrapper
export function LikedItemList({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  );
}
