// Re-export all types from database.ts
export * from './database';

// Additional utility types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOptions {
  category?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  condition?: string;
  search?: string;
}

export interface SortOptions {
  field: 'price' | 'year' | 'created_at' | 'title';
  order: 'asc' | 'desc';
}
