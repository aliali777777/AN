
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentMethod } from '@/types';
import { useOrder } from '@/context/OrderContext';
import { toast } from 'sonner';
import { CreditCard, Banknote, WalletCards, CreditCardIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface PaymentDialogProps {
  onComplete: () => void;
  disabled?: boolean;
}

export function PaymentDialog({ onComplete, disabled = false }: PaymentDialogProps) {
  const { saveOrder, currentOrder } = useOrder();
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  
  const finalAmount = currentOrder?.finalAmount || 0;
  
  const handleProcessPayment = () => {
    if (paymentMethod === 'cash' && amountPaid && Number(amountPaid) < finalAmount) {
      toast.error('المبلغ المدفوع أقل من المبلغ المطلوب');
      return;
    }
    
    try {
      // Process the order
      saveOrder(customerName || undefined, notes || undefined, paymentMethod);
      
      // Show success message with change amount if applicable
      if (paymentMethod === 'cash' && amountPaid) {
        const change = Number(amountPaid) - finalAmount;
        if (change > 0) {
          toast.success(`تم إتمام الطلب بنجاح. المبلغ المتبقي: ${change.toFixed(2)}`);
        } else {
          toast.success('تم إتمام الطلب بنجاح');
        }
      } else {
        toast.success('تم إتمام الطلب بنجاح');
      }
      
      // Close the dialog and call the completion handler
      setOpen(false);
      
      // Reset form
      setPaymentMethod('cash');
      setCustomerName('');
      setNotes('');
      setAmountPaid('');
      
      // Call the completion handler
      onComplete();
    } catch (error) {
      console.error('Failed to process payment:', error);
      toast.error('حدث خطأ أثناء معالجة الطلب');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full"
          disabled={disabled}
        >
          <CreditCardIcon className="ml-2 h-4 w-4" />
          إتمام الطلب
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إتمام الطلب</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customerName">اسم العميل (اختياري)</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="اسم العميل"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي ملاحظات إضافية عن الطلب"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>طريقة الدفع</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center">
                  <Banknote className="ml-1 h-4 w-4" />
                  نقداً
                </Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="ml-1 h-4 w-4" />
                  بطاقة ائتمان
                </Label>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile" className="flex items-center">
                  <WalletCards className="ml-1 h-4 w-4" />
                  محفظة إلكترونية
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {paymentMethod === 'cash' && (
            <div className="grid gap-2">
              <Label htmlFor="amountPaid">المبلغ المدفوع</Label>
              <Input
                id="amountPaid"
                type="number"
                min={finalAmount}
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={finalAmount.toString()}
              />
              {amountPaid && Number(amountPaid) >= finalAmount && (
                <div className="text-sm text-muted-foreground">
                  المبلغ المتبقي: {(Number(amountPaid) - finalAmount).toFixed(2)}
                </div>
              )}
            </div>
          )}
          
          <div className="pt-4">
            <div className="text-sm font-medium mb-2">ملخص الطلب:</div>
            <div className="flex justify-between text-sm">
              <span>إجمالي الطلب:</span>
              <span>{currentOrder?.totalAmount.toFixed(2)}</span>
            </div>
            {currentOrder?.discountAmount ? (
              <div className="flex justify-between text-sm text-green-600">
                <span>الخصم:</span>
                <span>- {currentOrder.discountAmount.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t">
              <span>المبلغ النهائي:</span>
              <span>{finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleProcessPayment}>
            إتمام عملية الدفع
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
