export interface LikedItem {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'product' | 'service' | 'post' | 'store';
  item_data: LikedItemData;
  liked_at: string;
  updated_at: string;
}

export interface LikedItemData {
  // Product specific fields
  title?: string;
  description?: string;
  price?: number;
  original_price?: number;
  image?: string;
  category?: string;
  make?: string;
  model?: string;
  year?: number;
  location?: string;
  condition?: string;
  rating?: number;
  store_name?: string;
  
  // Common fields
  slug?: string;
  status?: 'active' | 'inactive' | 'deleted';
  metadata?: Record<string, any>;
}

export interface LikeResponse {
  success: boolean;
  isLiked: boolean;
  totalLikes: number;
  message?: string;
}

export interface LikedItemsResponse {
  items: LikedItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface LikeStatus {
  isLiked: boolean;
  totalLikes: number;
}
