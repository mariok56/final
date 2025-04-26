// src/screens/Shop/hooks/useProductFilter.ts
import { useState, useMemo, useCallback } from 'react';
import { debounce } from '../../../utils/debounce';

export const useProductFilter = (products: any[]) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSorting, setActiveSorting] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);
  
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (activeSorting) {
        case 'newest':
          return a.isNew ? -1 : b.isNew ? 1 : 0;
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        default: // featured
          return a.bestseller ? -1 : b.bestseller ? 1 : 0;
      }
    });
  }, [filteredProducts, activeSorting]);
  
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 500),
    []
  );
  
  const handleSearch = useCallback((term: string) => {
    debouncedSearch(term);
  }, [debouncedSearch]);
  
  return {
    products: sortedProducts,
    activeCategory,
    setActiveCategory,
    activeSorting,
    setActiveSorting,
    handleSearch,
  };
};