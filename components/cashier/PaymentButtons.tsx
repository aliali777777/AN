
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Printer } from 'lucide-react';

interface PaymentButtonsProps {
  onClearAll: () => void;
  onDiscount: () => void;
  onDeleteItem: () => void;
  onCashPayment: () => void;
  onAddItem: () => void;
  onAddNote: () => void;
  selectedItemExists: boolean;
}

export const PaymentButtons: React.FC<PaymentButtonsProps> = ({ 
  onClearAll, 
  onDiscount, 
  onDeleteItem,
  onCashPayment,
  onAddItem,
  onAddNote,
  selectedItemExists 
}) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-pos-darkgray text-pos-gold border-gray-800 hover:bg-pos-lightgray py-3 rounded-lg"
          onClick={onClearAll}
        >
          <span className="text-base font-medium">Clear All</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-pos-darkgray text-pos-gold border-gray-800 hover:bg-pos-lightgray py-3 rounded-lg"
          onClick={onDiscount}
        >
          <span className="text-base font-medium">Discount</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="bg-pos-darkgray text-pos-gold border-gray-800 hover:bg-pos-lightgray py-3 rounded-lg"
          onClick={onDeleteItem}
          disabled={!selectedItemExists}
        >
          <span className="mr-2 text-pos-gold">🔐</span>
          <span className="text-base font-medium">Delete</span>
        </Button>
        <Button 
          variant="outline" 
          className="bg-pos-darkgray text-pos-gold border-gray-800 hover:bg-pos-lightgray py-3 rounded-lg"
          onClick={onAddItem}
          disabled={!selectedItemExists}
        >
          <span className="mr-2 text-pos-gold">🧺</span>
          <span className="text-base font-medium">Item</span>
        </Button>
      </div>
      
      <Button 
        variant="default" 
        className="w-full bg-pos-gold text-black hover:bg-pos-gold/90 py-3 rounded-lg flex items-center justify-center"
        onClick={onCashPayment}
      >
        <span className="text-lg font-bold">Cash</span>
        <span className="text-base">&nbsp;& print</span>
        <Printer className="h-5 w-5 ml-2" />
      </Button>
    </div>
  );
};
