
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Discount } from '@/types';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'sonner';
import { PercentIcon, Banknote } from 'lucide-react';

interface DiscountDialogProps {
  disabled?: boolean;
}

export function DiscountDialog({ disabled = false }: DiscountDialogProps) {
  const { applyDiscount, currentOrder } = useOrder();
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<string>('');

  const handleApplyDiscount = () => {
    if (!discountValue || isNaN(Number(discountValue)) || Number(discountValue) <= 0) {
      toast.error('الرجاء إدخال قيمة صحيحة للخصم');
      return;
    }

    const value = Number(discountValue);
    
    // Validate the discount based on type
    if (discountType === 'percentage' && value > 100) {
      toast.error('نسبة الخصم يجب أن تكون أقل من أو تساوي 100%');
      return;
    }

    if (discountType === 'fixed' && currentOrder && value > currentOrder.totalAmount) {
      toast.error('قيمة الخصم يجب أن تكون أقل من إجمالي الطلب');
      return;
    }

    const discount: Discount = {
      type: discountType,
      value: value
    };

    applyDiscount(discount);
    toast.success('تم تطبيق الخصم بنجاح');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start"
          disabled={disabled}
        >
          <PercentIcon className="ml-2 h-4 w-4" />
          إضافة خصم
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة خصم للطلب</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup 
            value={discountType} 
            onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
            className="flex space-x-4 space-y-0 rtl:space-x-reverse"
          >
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="percentage" id="percentage" />
              <Label htmlFor="percentage" className="flex items-center">
                <PercentIcon className="ml-1 h-4 w-4" />
                نسبة مئوية
              </Label>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <RadioGroupItem value="fixed" id="fixed" />
              <Label htmlFor="fixed" className="flex items-center">
                <Banknote className="ml-1 h-4 w-4" />
                مبلغ ثابت
              </Label>
            </div>
          </RadioGroup>
          
          <div className="grid gap-2">
            <Label htmlFor="discountValue">
              {discountType === 'percentage' ? 'نسبة الخصم (%)' : 'قيمة الخصم'}
            </Label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              max={discountType === 'percentage' ? '100' : undefined}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === 'percentage' ? '10' : '50'}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleApplyDiscount}>
            تطبيق الخصم
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
