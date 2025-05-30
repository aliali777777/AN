import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

interface OrderHeaderProps {
  storeName: string;
  onClose?: () => void;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  storeName,
  onClose 
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-pos-lightgray">
      <h1 className="text-3xl font-bold text-pos-gold">{storeName}</h1>
      <div className="flex items-center space-x-4">
        <div className="text-pos-gold">
          {format(new Date(), 'MMMM d, yyyy')}
        </div>
        <div className="flex items-center text-pos-gold">
          <span className="mr-2">Apple:</span>
          <span className="bg-pos-gold text-pos-dark px-2 py-0.5 rounded text-sm font-medium">
            Pay
          </span>
        </div>
        <Button 
          variant="ghost" 
          className="text-pos-gold hover:text-white"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};