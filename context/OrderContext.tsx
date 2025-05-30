// Import necessary components and types
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderItem, OrderStatus, PaymentMethod, Discount, KitchenOrderStatus } from '@/types';
import { getOrders, addOrder, updateOrder, deleteOrder, generateOrderNumber } from '@/utils/storage';
import { toast } from 'sonner';

interface OrderContextProps {
  orders: Order[];
  currentOrder: Order | null;
  initNewOrder: (cashierId: string) => void;
  addItemToOrder: (orderItem: OrderItem) => void;
  removeItemFromOrder: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  updateItemNote: (productId: string, note: string) => void;
  clearCurrentOrder: () => void;
  saveOrder: (customerName?: string, notes?: string, paymentMethod?: PaymentMethod) => Order;
  getOrder: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;
  getActiveKitchenOrders: () => Order[];
  updateKitchenOrderStatus: (orderId: string, newStatus: KitchenOrderStatus) => void;
  getFilteredOrders: (status?: OrderStatus, dateRange?: { startDate: Date, endDate: Date }) => Order[];
  calculateTotalAmount: (items: OrderItem[]) => number;
  applyDiscount: (discount: Discount) => void;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load orders from storage on mount
  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const calculateTotalAmount = (items: OrderItem[]): number => {
    return items.reduce((total, item) => {
      const itemTotal = item.product.price * item.quantity;
      const modifiersTotal = item.modifiers 
        ? item.modifiers.reduce((modTotal, mod) => modTotal + mod.price, 0) * item.quantity 
        : 0;
      return total + itemTotal + modifiersTotal;
    }, 0);
  };

  const calculateDiscountAmount = (totalAmount: number, discount: Discount | undefined): number => {
    if (!discount) return 0;
    
    if (discount.type === 'percentage') {
      return (totalAmount * discount.value) / 100;
    } else if (discount.type === 'fixed') {
      return discount.value;
    }
    
    return 0;
  };

  const initNewOrder = (cashierId: string) => {
    const orderNumber = Number(generateOrderNumber().split('-')[1]);
    
    setCurrentOrder({
      id: `order-${Date.now()}`,
      items: [],
      totalAmount: 0,
      discountAmount: 0,
      finalAmount: 0,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      orderNumber, // Fixed: Using Number to ensure correct type
      cashierId,
      paymentMethod: 'cash',
      isPaid: false,
      kitchenStatus: 'new'
    });
  };

  const applyDiscount = (discount: Discount) => {
    if (!currentOrder) return;
    
    const totalAmount = currentOrder.totalAmount;
    const discountAmount = calculateDiscountAmount(totalAmount, discount);
    const finalAmount = totalAmount - discountAmount;
    
    setCurrentOrder({
      ...currentOrder,
      discount,
      discountAmount,
      finalAmount,
      updatedAt: new Date()
    });
  };
  
  const addItemToOrder = (orderItem: OrderItem) => {
    if (!currentOrder) return;
    
    const existingItemIndex = currentOrder.items.findIndex(
      item => item.productId === orderItem.productId
    );
    
    let updatedItems;
    
    if (existingItemIndex >= 0) {
      // Increment quantity if the item already exists
      updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex].quantity += orderItem.quantity;
      
      // If the new item has notes, update the notes
      if (orderItem.notes) {
        updatedItems[existingItemIndex].notes = orderItem.notes;
      }
    } else {
      // Add new item
      updatedItems = [...currentOrder.items, orderItem];
    }
    
    const totalAmount = calculateTotalAmount(updatedItems);
    const discountAmount = calculateDiscountAmount(totalAmount, currentOrder.discount);
    const finalAmount = totalAmount - discountAmount;
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      totalAmount,
      discountAmount,
      finalAmount,
      updatedAt: new Date()
    });
  };

  const removeItemFromOrder = (productId: string) => {
    if (!currentOrder) return;
    
    const updatedItems = currentOrder.items.filter(item => item.productId !== productId);
    const totalAmount = calculateTotalAmount(updatedItems);
    const discountAmount = calculateDiscountAmount(totalAmount, currentOrder.discount);
    const finalAmount = totalAmount - discountAmount;
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      totalAmount,
      discountAmount,
      finalAmount,
      updatedAt: new Date()
    });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (!currentOrder) return;
    
    // If quantity is zero or less, remove the item
    if (quantity <= 0) {
      removeItemFromOrder(productId);
      return;
    }
    
    const updatedItems = currentOrder.items.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    
    const totalAmount = calculateTotalAmount(updatedItems);
    const discountAmount = calculateDiscountAmount(totalAmount, currentOrder.discount);
    const finalAmount = totalAmount - discountAmount;
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      totalAmount,
      discountAmount,
      finalAmount,
      updatedAt: new Date()
    });
  };

  const updateItemNote = (productId: string, note: string) => {
    if (!currentOrder) return;
    
    const updatedItems = currentOrder.items.map(item => {
      if (item.productId === productId) {
        return { ...item, notes: note };
      }
      return item;
    });
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      updatedAt: new Date()
    });
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  const saveOrder = (customerName?: string, notes?: string, paymentMethod: PaymentMethod = 'cash') => {
    if (!currentOrder) {
      throw new Error('No current order to save');
    }
    
    const finalOrder: Order = {
      ...currentOrder,
      customerName,
      notes,
      paymentMethod,
      updatedAt: new Date()
    };
    
    const existingOrderIndex = orders.findIndex(o => o.id === finalOrder.id);
    
    if (existingOrderIndex >= 0) {
      // Update existing order
      const updatedOrders = [...orders];
      updatedOrders[existingOrderIndex] = finalOrder;
      setOrders(updatedOrders);
      updateOrder(finalOrder);
    } else {
      // Add new order
      setOrders([...orders, finalOrder]);
      addOrder(finalOrder);
    }
    
    setCurrentOrder(null);
    return finalOrder;
  };

  const getOrder = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const cancelOrder = (orderId: string) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        status: 'canceled',
        updatedAt: new Date()
      };
      
      setOrders(updatedOrders);
      updateOrder(updatedOrders[orderIndex]);
      
      toast.success('تم إلغاء الطلب بنجاح');
    }
  };

  // Modified to exclude 'delivered' status orders from active kitchen orders
  const getActiveKitchenOrders = () => {
    return orders.filter(
      order => order.status === 'pending' && 
      ['new', 'in-progress', 'ready'].includes(order.kitchenStatus || '')
    );
  };

  const updateKitchenOrderStatus = (orderId: string, newStatus: KitchenOrderStatus) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex >= 0) {
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = {
        ...updatedOrders[orderIndex],
        kitchenStatus: newStatus,
        updatedAt: new Date()
      };
      
      // If marked as ready, calculate estimated completion time
      if (newStatus === 'ready') {
        updatedOrders[orderIndex].estimatedCompletionTime = new Date();
      }
      
      setOrders(updatedOrders);
      updateOrder(updatedOrders[orderIndex]);
      
      // Show notification when order is delivered
      if (newStatus === 'delivered') {
        toast.success(`تم تسليم الطلب رقم ${updatedOrders[orderIndex].orderNumber}`);
      }
    }
  };

  const getFilteredOrders = (
    status?: OrderStatus, 
    dateRange?: { startDate: Date, endDate: Date }
  ) => {
    return orders.filter(order => {
      // Filter by status if provided
      const statusMatches = !status || order.status === status;
      
      // Filter by date range if provided
      let dateMatches = true;
      if (dateRange) {
        const orderDate = new Date(order.createdAt);
        dateMatches = orderDate >= dateRange.startDate && orderDate <= dateRange.endDate;
      }
      
      return statusMatches && dateMatches;
    });
  };

  const value = {
    orders,
    currentOrder,
    initNewOrder,
    addItemToOrder,
    removeItemFromOrder,
    updateItemQuantity,
    updateItemNote,
    clearCurrentOrder,
    saveOrder,
    getOrder,
    cancelOrder,
    getActiveKitchenOrders,
    updateKitchenOrderStatus,
    getFilteredOrders,
    calculateTotalAmount,
    applyDiscount
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
