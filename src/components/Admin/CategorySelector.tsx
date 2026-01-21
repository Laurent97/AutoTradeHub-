import { useState, useEffect } from 'react';
import { ChevronDown, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  product_type: string;
  level: number;
  parent_id?: string;
}

interface CategoryPath {
  product_type: string;
  category_id: string;
  category_name: string;
  subcategory_id?: string;
  subcategory_name?: string;
  specific_id?: string;
  specific_name?: string;
}

interface CategorySelectorProps {
  value: CategoryPath;
  onChange: (categoryPath: CategoryPath) => void;
  error?: string;
}

const PRODUCT_TYPES = [
  { value: 'parts', label: 'Parts' },
  { value: 'cars', label: 'Cars' },
  { value: 'accessories', label: 'Accessories' }
];

export default function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [addingCategory, setAddingCategory] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('product_type, level, sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubcategories = (productType: string) => {
    return categories.filter(cat => cat.product_type === productType && cat.level === 2);
  };

  const getSpecificCategories = (parentSlug: string) => {
    const parent = categories.find(cat => cat.slug === parentSlug);
    if (!parent) return [];
    return categories.filter(cat => cat.parent_id === parent.id);
  };

  const handleProductTypeChange = (productType: string) => {
    onChange({
      product_type: productType,
      category_id: '',
      category_name: '',
      subcategory_id: '',
      subcategory_name: '',
      specific_id: '',
      specific_name: ''
    });
  };

  const handleSubcategoryChange = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    onChange({
      ...value,
      category_id: categoryId,
      category_name: category.name,
      subcategory_id: '',
      subcategory_name: '',
      specific_id: '',
      specific_name: ''
    });
  };

  const handleSpecificChange = (specificId: string) => {
    const specific = categories.find(cat => cat.id === specificId);
    if (!specific) return;

    onChange({
      ...value,
      specific_id: specificId,
      specific_name: specific.name
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !selectedParent) return;

    setAddingCategory(true);
    try {
      const parent = categories.find(cat => cat.id === selectedParent);
      if (!parent) throw new Error('Parent category not found');

      const slug = newCategoryName.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

      const { data, error } = await supabase
        .from('product_categories')
        .insert({
          name: newCategoryName.trim(),
          slug,
          product_type: parent.product_type,
          level: parent.level + 1,
          parent_id: selectedParent
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh categories
      await loadCategories();
      
      // Auto-select the new category if it's a specific category
      if (parent.level === 2) {
        handleSpecificChange(data.id);
      }

      // Reset form
      setNewCategoryName('');
      setSelectedParent('');
      setShowAddCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setAddingCategory(false);
    }
  };

  const subcategories = value.product_type ? getSubcategories(value.product_type) : [];
  const specificCategories = value.category_id ? getSpecificCategories(value.category_id) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Product Type */}
        <div className="space-y-2">
          <Label htmlFor="product-type">Product Type *</Label>
          <Select
            value={value.product_type}
            onValueChange={handleProductTypeChange}
          >
            <SelectTrigger id="product-type">
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        <div className="space-y-2">
          <Label htmlFor="subcategory">Subcategory *</Label>
          <Select
            value={value.category_id}
            onValueChange={handleSubcategoryChange}
            disabled={!value.product_type || subcategories.length === 0}
          >
            <SelectTrigger id="subcategory">
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {subcategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Specific Category */}
        <div className="space-y-2">
          <Label htmlFor="specific">Specific Category (Optional)</Label>
          <div className="flex gap-2">
            <Select
              value={value.specific_id}
              onValueChange={handleSpecificChange}
              disabled={!value.category_id || specificCategories.length === 0}
            >
              <SelectTrigger id="specific" className="flex-1">
                <SelectValue placeholder="Select specific" />
              </SelectTrigger>
              <SelectContent>
                {specificCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={!value.category_id}
                  title="Add new category"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-category-name">Category Name</Label>
                    <Input
                      id="new-category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="parent-category">Parent Category</Label>
                    <Select
                      value={selectedParent}
                      onValueChange={setSelectedParent}
                    >
                      <SelectTrigger id="parent-category">
                        <SelectValue placeholder="Select parent" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddCategory}
                      disabled={!newCategoryName.trim() || !selectedParent || addingCategory}
                      className="flex-1"
                    >
                      {addingCategory ? 'Adding...' : 'Add Category'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddCategory(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Category Summary */}
      {value.category_name && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Selected: <span className="font-medium text-foreground">
              {value.category_name}
            </span>
            {value.specific_name && (
              <span className="font-medium text-foreground">
                {' > '}{value.specific_name}
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Validation Info */}
      {value.product_type && !value.category_id && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please select a subcategory to continue.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
