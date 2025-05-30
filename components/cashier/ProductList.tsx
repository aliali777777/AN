
import React, { ChangeEvent } from 'react';
import { Product, Settings } from '@/types';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductGrid } from './ProductGrid';
import { CategoryButtons } from './CategoryButtons';
import { useLanguage } from '@/context/LanguageContext';

interface ProductListProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  settings: Settings;
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductSelect,
  onQuickAdd,
  settings,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t } = useLanguage();
  
  // Filter products by category and search query
  const filteredProducts = products.filter(product => {
    // Filter by category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        (product.nameAr && product.nameAr.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  return (
    <div className="grid grid-rows-[auto_auto_1fr] gap-2 h-full">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder={t('search_products')}
          className="pl-10 bg-gray-900 text-white border-gray-700"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="h-32">
        <CategoryButtons 
          onSelectCategory={onCategoryChange}
          selectedCategory={selectedCategory}
        />
      </div>
      
      <div className="overflow-hidden">
        <ProductGrid 
          products={filteredProducts}
          onProductClick={onProductSelect}
          settings={settings}
        />
      </div>
    </div>
  );
};

export default ProductList;
