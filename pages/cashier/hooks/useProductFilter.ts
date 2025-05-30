
import React, { useState, useMemo } from 'react';
import { useProducts } from '@/context/ProductContext';

export const useProductFilter = () => {
  const { availableProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Get unique categories
  const categories = useMemo(() => {
    const categoriesSet = new Set(availableProducts.map(p => p.category));
    return ['all', ...Array.from(categoriesSet)];
  }, [availableProducts]);
  
  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return availableProducts.filter(product => {
      const matchesSearch = searchQuery 
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (product.nameAr && product.nameAr.includes(searchQuery))
        : true;
      
      const matchesCategory = selectedCategory === 'all' 
        ? true 
        : product.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, searchQuery, selectedCategory]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  return {
    filteredProducts,
    searchQuery,
    selectedCategory,
    categories,
    handleSearchChange,
    handleCategoryChange
  };
};
