import React from 'react';
import { OrderItem as OrderItemType, Settings } from '@/types';

interface OrderItemProps {
  item: OrderItemType;
  settings: Settings;
  onSelect: (item: OrderItemType) => void;
  isSelected: boolean;
}

export const OrderItemRow: React.FC<OrderItemProps> = ({ 
  item, 
  settings,
  onSelect,
  isSelected
}) => {
  return (
    <div 
      className={`py-4 cursor-pointer ${isSelected ? 'bg-pos-lightgray/40 rounded' : ''}`}
      onClick={() => onSelect(item)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-2xl font-medium text-pos-gold mr-3">
            {item.quantity}
          </span>
          <span className="text-2xl text-pos-gold">
            {item.product.nameAr || item.product.name}
          </span>
        </div>
        <span className="text-2xl text-pos-gold">
          {settings.currencySymbol}{(item.product.price * item.quantity).toFixed(2)}
        </span>
      </div>

      {item.notes && (
        <div className="mt-2 text-sm text-amber-300/70">
          {item.notes}
        </div>
      )}
    </div>
  );
};