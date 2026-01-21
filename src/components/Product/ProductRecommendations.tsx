import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase/client';
import type { Product } from '@/lib/types';

interface ProductRecommendationsProps {
  currentProduct: Product;
  limit?: number;
  title?: string;
}

interface RecommendationType {
  id: string;
  title: string;
  products: Product[];
}

export default function ProductRecommendations({ 
  currentProduct, 
  limit = 8, 
  title = "Similar Products" 
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [currentProduct?.id, currentProduct?.category]);

  const loadRecommendations = async () => {
    if (!currentProduct) return;

    setLoading(true);
    try {
      // Get similar products from same category
      const { data: similarProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('category', currentProduct.category)
        .neq('id', currentProduct.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Get products from same manufacturer/make if available
      const { data: sameMakeProducts } = currentProduct.make
        ? await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('make', currentProduct.make)
            .neq('id', currentProduct.id)
            .neq('category', currentProduct.category) // Different category but same make
            .order('created_at', { ascending: false })
            .limit(limit)
        : { data: [] };

      // Get recently viewed products (fallback to recently created)
      const { data: recentProducts } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentProduct.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      // Combine and deduplicate recommendations
      const allRecommendations = [
        ...similarProducts || [],
        ...sameMakeProducts || [],
        ...recentProducts || []
      ];

      // Remove duplicates and limit results
      const uniqueRecommendations = allRecommendations.filter((product, index, self) =>
        index === self.indexOf(product) || !allRecommendations.slice(0, index).some(p => p.id === product.id)
      ).slice(0, limit);

      // Group recommendations by type
      const groupedRecommendations: RecommendationType[] = [];
      
      if (uniqueRecommendations.length > 0) {
        // Similar products (same category)
        const similar = uniqueRecommendations.filter(p => p.category === currentProduct.category);
        if (similar.length > 0) {
          groupedRecommendations.push({
            id: 'similar',
            title: 'Similar Products',
            products: similar.slice(0, 4)
          });
        }

        // Same manufacturer (different category)
        const sameMake = uniqueRecommendations.filter(p => 
          p.make === currentProduct.make && p.category !== currentProduct.category
        );
        if (sameMake.length > 0 && groupedRecommendations.length < 2) {
          groupedRecommendations.push({
            id: 'same-make',
            title: `More from ${currentProduct.make}`,
            products: sameMake.slice(0, 4)
          });
        }

        // Recently added (fallback)
        const recent = uniqueRecommendations.filter(p => 
          p.category !== currentProduct.category && 
          p.make !== currentProduct.make &&
          !groupedRecommendations.some(r => r.products.some(prod => prod.id === p.id))
        );
        if (recent.length > 0 && groupedRecommendations.length < 2) {
          groupedRecommendations.push({
            id: 'recent',
            title: 'Recently Added',
            products: recent.slice(0, 4)
          });
        }
      }

      setRecommendations(groupedRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/placeholder.svg';

    return (
      <Link to={`/products/${product.id}`} className="group block">
        <Card className="overflow-hidden border border-border hover:border-accent transition-all duration-300 hover:shadow-lg">
          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.original_price && product.price && product.price < product.original_price && (
              <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs">
                Sale
              </Badge>
            )}
          </div>

          <CardContent className="p-4">
            {/* Category Badge */}
            <div className="mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
              {product.title}
            </h3>

            {/* Details */}
            {product.make && product.model && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>{product.make}</span>
                <span>•</span>
                <span>{product.model}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.original_price)}
              </span>
              {product.original_price && product.price && product.price < product.original_price && (
                <span className="text-sm text-green-600 font-medium">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Action */}
            <Button variant="outline" size="sm" className="w-full">
              <span className="flex items-center justify-center gap-2">
                View Details
                <ChevronRight className="w-4 h-4" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </Link>
    );
  };

  const RecommendationSection = ({ recommendation }: { recommendation: RecommendationType }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          {recommendation.id === 'similar' && <Package className="w-5 h-5 text-accent" />}
          {recommendation.id === 'same-make' && <TrendingUp className="w-5 h-5 text-blue-600" />}
          {recommendation.id === 'recent' && <Star className="w-5 h-5 text-yellow-500" />}
          {recommendation.title}
        </h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className={`grid gap-4 ${
        recommendation.products.length <= 2 
          ? "grid-cols-1 sm:grid-cols-2" 
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      }`}>
        {recommendation.products.map((product, index) => (
          <ProductCard key={`${recommendation.id}-${product.id}-${index}`} product={product} />
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
        <div className="grid gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="animate-pulse">
              <div className="aspect-[4/3] bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No recommendations available</h3>
        <p className="text-muted-foreground">
          Check back later for similar products.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
      {recommendations.map((recommendation) => (
        <RecommendationSection 
          key={recommendation.id} 
          recommendation={recommendation} 
        />
      ))}
    </div>
  );
}
