import { Heart, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyLikedStateProps {
  type?: 'all' | 'search' | 'filtered';
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function EmptyLikedState({ 
  type = 'all', 
  searchQuery, 
  onClearSearch 
}: EmptyLikedStateProps) {
  const getContent = () => {
    switch (type) {
      case 'search':
        return {
          icon: Search,
          title: 'No items found',
          description: `No liked items match "${searchQuery}"`,
          action: onClearSearch ? 'Clear search' : null,
          actionLink: null,
        };
      case 'filtered':
        return {
          icon: Heart,
          title: 'No items in this category',
          description: 'Try changing your filters or browse all liked items',
          action: 'View all items',
          actionLink: '/liked-items',
        };
      default:
        return {
          icon: Heart,
          title: 'No liked items yet',
          description: 'Start exploring and save items you love to build your collection',
          action: 'Browse products',
          actionLink: '/products',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>

      {/* Content */}
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {content.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {content.description}
        </p>

        {/* Action Button */}
        {content.action && (
          <div className="space-y-3">
            {content.actionLink ? (
              <Link to={content.actionLink}>
                <Button size="lg" className="min-w-[200px]">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {content.action}
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                onClick={onClearSearch}
                className="min-w-[200px]"
                variant="outline"
              >
                {content.action}
              </Button>
            )}
          </div>
        )}

        {/* Tips for empty liked items */}
        {type === 'all' && (
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              💡 Tips for building your collection
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <li>• Click the heart icon on any item to save it</li>
              <li>• Organize your collection by categories</li>
              <li>• Share your favorites with friends</li>
              <li>• Export your collection for reference</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Animated empty state with skeleton
export function EmptyLikedStateSkeleton() {
  return (
    <div className="space-y-6">
      {/* Skeleton cards */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
          <div className="flex">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
