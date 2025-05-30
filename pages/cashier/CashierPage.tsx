import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { getSettings } from '@/utils/storage';
import { useProductFilter } from './hooks/useProductFilter';
import { useOrderManagement } from './hooks/useOrderManagement';
import { CategoryButtons } from '@/components/cashier/CategoryButtons';
import { Numpad } from '@/components/cashier/Numpad';
import CurrentOrderSummary from '@/components/cashier/CurrentOrderSummary';
import { PaymentButtons } from '@/components/cashier/PaymentButtons';
import { ProductDetailDialog } from '@/components/cashier/ProductDetailDialog';
import { ProductGrid } from '@/components/cashier/ProductGrid'; 
import { OrderHeader } from '@/components/cashier/OrderHeader';
import { useOrder } from '@/context/OrderContext';
import { useProducts } from '@/context/ProductContext';
import { PaymentDialog } from '@/components/order/PaymentDialog';
import { DiscountDialog } from '@/components/order/DiscountDialog';
import { OrderItem } from '@/types';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const CashierPage = () => {
  const navigate = useNavigate();
  const settings = getSettings();
  const { availableProducts } = useProducts();
  const { t } = useLanguage();
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemNote, setItemNote] = useState<string>("");

  const { 
    filteredProducts,
    searchQuery,
    selectedCategory,
    categories,
    handleSearchChange,
    handleCategoryChange
  } = useProductFilter();

  const {
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
  } = useOrderManagement();

  const { updateItemQuantity, removeItemFromOrder } = useOrder();

  const handleNumpadClick = (num: number) => {
    if (selectedItemId && currentOrder) {
      const orderItem = currentOrder.items.find(item => item.productId === selectedItemId);
      if (orderItem) {
        const currentValue = orderItem.quantity;
        let newQuantity = Number(`${currentValue}${num}`);

        if (newQuantity > 99) newQuantity = 99;

        handleQuantityChange(selectedItemId, newQuantity);
        toast.success(`Quantity updated to ${newQuantity}`);
      }
    } else {
      toast.info("Please select a product first to update quantity");
    }
  };

  const handleNumpadClear = () => {
    if (selectedItemId) {
      handleQuantityChange(selectedItemId, 1);
      toast.success("Quantity reset to 1");
    } else {
      toast.info("Please select a product first");
    }
  };

  const handleNumpadDelete = () => {
    if (selectedItemId) {
      removeItemFromOrder(selectedItemId);
      toast.success(t('product_removed'));
      setSelectedItemId(null);
    } else {
      toast.info(t('select_product_to_delete'));
    }
  };

  const handleNumpadDot = () => {
    toast.info(t('decimal_not_supported'));
  };

  const handleAddNote = () => {
    if (selectedItemId) {
      setIsNoteDialogOpen(true);
    } else {
      toast.info(t('select_product_for_note'));
    }
  };

  const handleSaveNote = () => {
    if (selectedItemId && currentOrder) {
      const orderItem = currentOrder.items.find(item => item.productId === selectedItemId);
      if (orderItem) {
        const updatedItem: OrderItem = {
          ...orderItem,
          notes: itemNote
        };

        handleRemoveItem(selectedItemId);

        setTimeout(() => {
          handleAddToOrder(updatedItem.quantity, updatedItem.notes || '');
        }, 10);

        toast.success('Note added');
        setIsNoteDialogOpen(false);
      }
    }
  };

  const handleClearAll = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      handleCancelOrder();
      toast.success("All items cleared");
    } else {
      toast.info("Cart is already empty");
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItemId) {
      handleRemoveItem(selectedItemId);
      toast.success(t('selected_item_deleted'));
      setSelectedItemId(null);
    } else {
      toast.info(t('select_product_to_delete'));
    }
  };

  const handleCashPayment = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      toast.info(t('add_products_first'));
    }
  };

  const handleDiscount = () => {
    if (currentOrder && currentOrder.items.length > 0) {
      setIsDiscountDialogOpen(true);
    } else {
      toast.info("Please add products to cart first to apply discount");
    }
  };

  const handleCloseOrder = () => {
    navigate('/');
    toast.success('تم العودة إلى الصفحة الرئيسية');
  };

  // Select an item when clicked
  const handleSelectItem = (item: OrderItem) => {
    setSelectedItemId(item.productId);
    if (item.notes) {
      setItemNote(item.notes);
    } else {
      setItemNote("");
    }
    toast.info(`Selected ${item.product.name}`);
  };

  // Get products for selected category
  const categoryProducts = selectedCategory === 'all' 
    ? availableProducts 
    : availableProducts.filter(p => p.category === selectedCategory);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="pos-theme">
      <div className="flex h-screen bg-black overflow-hidden">
        <div className="flex-1 flex flex-col h-full bg-black text-white overflow-hidden">
          {/* Replace the old X button with the OrderHeader component */}
          <OrderHeader storeName="SHIWOW" onClose={handleCloseOrder} />

          <div className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-rows-2 h-full gap-4">
              {/* Top section: Categories (left) and Products (right) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Categories - Left */}
                <div className="overflow-auto">
                  <CategoryButtons 
                    onSelectCategory={handleCategoryChange}
                    selectedCategory={selectedCategory}
                  />
                </div>

                {/* Products - Right */}
                <div className="overflow-auto">
                  <ProductGrid 
                    products={categoryProducts} 
                    onProductClick={handleProductClick} 
                    settings={settings}
                  />
                </div>
              </div>

              {/* Bottom section: Order Summary (larger) and Numpad (smaller) */}
              <div className="grid grid-cols-3 gap-4">
                {/* Order Summary - Takes up 2/3 of the space */}
                <div className="col-span-2 flex flex-col overflow-auto">
                  <CurrentOrderSummary
                    order={currentOrder}
                    settings={settings}
                    onSelectItem={handleSelectItem}
                    selectedItemId={selectedItemId}
                    onRemoveItem={handleRemoveItem}
                    calculateOrderTotal={calculateOrderTotal}
                    calculateOrderDiscount={calculateOrderDiscount}
                    calculateFinalAmount={calculateFinalAmount}
                    onAddNote={handleAddNote}
                  />
                </div>

                {/* Numpad and Payment Buttons - Takes up 1/3 of the space */}
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <Numpad 
                      onNumberClick={handleNumpadClick} 
                      onClear={handleNumpadClear}
                      onDelete={handleNumpadDelete}
                      onDot={handleNumpadDot}
                    />
                  </div>

                  <div className="flex-1">
                    <PaymentButtons 
                      onClearAll={handleClearAll}
                      onDiscount={handleDiscount}
                      onDeleteItem={handleDeleteSelected}
                      onCashPayment={handleCashPayment}
                      onAddItem={() => {}} // Empty function since we no longer need this button
                      onAddNote={handleAddNote}
                      selectedItemExists={!!selectedItemId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductDetailDialog 
        product={selectedProduct}
        settings={settings}
        isOpen={!!selectedProduct}
        onClose={handleProductDialogClose}
        onAddToOrder={handleAddToOrder}
      />

      <DiscountDialog 
        disabled={!currentOrder || currentOrder.items.length === 0} 
      />

      <PaymentDialog 
        onComplete={handleOrderComplete}
        disabled={!currentOrder || currentOrder.items.length === 0}
      />

      {/* Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-pos-gold">Add Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={itemNote}
            onChange={(e) => setItemNote(e.target.value)}
            placeholder="Type your note here..."
            className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)} 
              className="bg-black text-pos-gold border-pos-gold/30 hover:bg-black/90">
              Cancel
            </Button>
            <Button onClick={handleSaveNote} 
              className="bg-pos-gold text-black hover:bg-pos-gold/90">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default CashierPage;