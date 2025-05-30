
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Tag } from 'lucide-react';
import { Product, Settings } from '@/types';

interface ProductDetailDialogProps {
  product: Product | null;
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onAddToOrder: (quantity: number, notes: string) => void;
}

export const ProductDetailDialog = ({
  product,
  settings,
  isOpen,
  onClose,
  onAddToOrder
}: ProductDetailDialogProps) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleQuantityIncrement = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToOrder = () => {
    onAddToOrder(quantity, notes);
    setQuantity(1);
    setNotes('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{product?.nameAr || product?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            {product?.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-32 h-32 object-cover rounded-md" 
              />
            ) : (
              <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                <Tag className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuantityDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center w-12 h-10 border rounded-md">
              {quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuantityIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium block">
              ملاحظات إضافية
            </label>
            <Input
              id="notes"
              placeholder="مثال: بدون بصل، حار..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <div className="font-medium">
              السعر: {settings.currencySymbol}
              {product ? (quantity * product.price).toFixed(2) : '0.00'}
            </div>
            <Button onClick={handleAddToOrder}>
              إضافة للطلب
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
