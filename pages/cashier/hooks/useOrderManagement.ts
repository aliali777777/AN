
import { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { Product, OrderItem } from '@/types';
import { toast } from 'sonner';

export const useOrderManagement = () => {
  const { 
    currentOrder, 
    initNewOrder, 
    addItemToOrder, 
    removeItemFromOrder, 
    updateItemQuantity, 
    clearCurrentOrder 
  } = useOrder();
  
  const { currentUser } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Handle order initialization if needed
  useEffect(() => {
    if (!currentOrder && currentUser) {
      initNewOrder(currentUser.id);
    }
  }, [currentOrder, currentUser, initNewOrder]);
  
  // Helper functions for order calculations
  const calculateOrderTotal = () => {
    if (!currentOrder) return 0;
    return currentOrder.totalAmount;
  };

  const calculateOrderDiscount = () => {
    if (!currentOrder) return 0;
    return currentOrder.discountAmount;
  };

  const calculateFinalAmount = () => {
    if (!currentOrder) return 0;
    return currentOrder.finalAmount;
  };
  
  const handleAddToOrder = (quantity: number, notes: string) => {
    if (!selectedProduct) return;
    
    const orderItem: OrderItem = {
      productId: selectedProduct.id,
      product: selectedProduct,
      quantity: quantity,
      notes: notes || undefined
    };
    
    addItemToOrder(orderItem);
    setSelectedProduct(null);
    
    toast.success('تمت إضافة المنتج للطلب');
  };
  
  const handleQuickAdd = (product: Product) => {
    const orderItem: OrderItem = {
      productId: product.id,
      product: product,
      quantity: 1,
      notes: undefined
    };
    
    addItemToOrder(orderItem);
    toast.success('تمت إضافة المنتج للطلب');
  };
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Ask for confirmation before removing
      if (confirm('هل تريد إزالة هذا المنتج من الطلب؟')) {
        removeItemFromOrder(productId);
      }
      return;
    }
    
    updateItemQuantity(productId, newQuantity);
  };
  
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };
  
  const handleProductDialogClose = () => {
    setSelectedProduct(null);
  };
  
  const handleOrderComplete = () => {
    // Order successfully processed, reset state
    setTimeout(() => {
      initNewOrder(currentUser?.id || '');
    }, 500);
  };

  const handleRemoveItem = (productId: string) => {
    removeItemFromOrder(productId);
  };

  const handleCancelOrder = () => {
    if (confirm('هل أنت متأكد من إلغاء الطلب الحالي؟')) {
      clearCurrentOrder();
    }
  };
  
  return {
    currentOrder,
    selectedProduct,
    handleProductClick,
    handleAddToOrder,
    handleQuickAdd,
    handleQuantityChange,
    handleRemoveItem,
    handleCancelOrder,
    handleProductDialogClose,
    calculateOrderTotal,
    calculateOrderDiscount,
    calculateFinalAmount,
    handleOrderComplete
  };
};
