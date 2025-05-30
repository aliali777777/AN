
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../utils/storage';
import { toast } from 'sonner';

interface ProductContextType {
  products: Product[];
  availableProducts: Product[];
  loading: boolean;
  addNewProduct: (product: Omit<Product, 'id'>) => void;
  updateExistingProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  availableProducts: [],
  loading: true,
  addNewProduct: () => {},
  updateExistingProduct: () => {},
  removeProduct: () => {},
  toggleProductAvailability: () => {},
  getProductById: () => undefined,
  getProductsByCategory: () => [],
  searchProducts: () => [],
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load products from local storage
    try {
      const storedProducts = getProducts();
      setProducts(storedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const addNewProduct = (product: Omit<Product, 'id'>) => {
    try {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
      };
      
      addProduct(newProduct);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added successfully');
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product');
    }
  };

  const updateExistingProduct = (product: Product) => {
    try {
      updateProduct(product);
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };

  const removeProduct = (id: string) => {
    try {
      deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product removed successfully');
    } catch (error) {
      console.error('Failed to remove product:', error);
      toast.error('Failed to remove product');
    }
  };

  const toggleProductAvailability = (id: string) => {
    try {
      const product = products.find(p => p.id === id);
      if (product) {
        const updatedProduct = {
          ...product,
          isAvailable: !product.isAvailable
        };
        
        updateProduct(updatedProduct);
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
        
        toast.success(
          updatedProduct.isAvailable 
            ? 'Product is now available' 
            : 'Product is now unavailable'
        );
      }
    } catch (error) {
      console.error('Failed to toggle product availability:', error);
      toast.error('Failed to update product');
    }
  };

  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter(p => p.category === category);
  };

  const searchProducts = (query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    return products.filter(
      p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.nameAr?.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
  };

  // Filter available products
  const availableProducts = products.filter(p => p.isAvailable);

  return (
    <ProductContext.Provider 
      value={{
        products,
        availableProducts,
        loading,
        addNewProduct,
        updateExistingProduct,
        removeProduct,
        toggleProductAvailability,
        getProductById,
        getProductsByCategory,
        searchProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
