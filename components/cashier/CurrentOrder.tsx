import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, Plus, Minus, Trash } from 'lucide-react';
import { Settings, type Order, type OrderItem } from '@/types';
import { PaymentDialog } from '@/components/order/PaymentDialog';
import { DiscountDialog } from '@/components/order/DiscountDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/context/LanguageContext';

interface CurrentOrderProps {
  order: Order | null;
  settings: Settings;
  onCancelOrder: () => void;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  calculateOrderTotal: () => number;
  calculateOrderDiscount: () => number;
  calculateFinalAmount: () => number;
  onOrderComplete: () => void;
}

export const CurrentOrder = ({
  order,
  settings,
  onCancelOrder,
  onQuantityChange,
  onRemoveItem,
  calculateOrderTotal,
  calculateOrderDiscount,
  calculateFinalAmount,
  onOrderComplete
}: CurrentOrderProps) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  if (!order) return null;

  return (
    <Card className="flex-1 flex flex-col shadow-lg border-2">
      <CardHeader className="pb-3 flex-row justify-between items-center bg-primary/10">
        <CardTitle className="flex items-center text-xl">
          <ShoppingCart className="ml-2 h-6 w-6" />
          {t("current_order")}
        </CardTitle>
        <div className="flex items-center">
          <span className="text-base font-medium ml-1 bg-primary/20 px-2 py-1 rounded-md">#{order.orderNumber}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/20"
            onClick={onCancelOrder}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-4">
            {order.items.map((item) => (
              <OrderItem 
                key={item.productId} 
                item={item} 
                settings={settings}
                onQuantityChange={onQuantityChange}
                onRemoveItem={onRemoveItem}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
            <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">{t("no_items_in_order")}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex-col border-t pt-4 bg-muted/30">
        <div className="w-full space-y-3">
          <div className="flex justify-between text-base">
            <span>{t("total")}:</span>
            <span>{settings.currencySymbol}{calculateOrderTotal().toFixed(2)}</span>
          </div>

          {calculateOrderDiscount() > 0 && (
            <div className="flex justify-between text-green-600 text-base">
              <span>{t("discount")}:</span>
              <span>- {settings.currencySymbol}{calculateOrderDiscount().toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-xl border-t border-dashed pt-2 border-primary/30">
            <span>{t("grand_total")}:</span>
            <span>{settings.currencySymbol}{calculateFinalAmount().toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <DiscountDialog 
              disabled={!order || order.items.length === 0} 
            />

            <PaymentDialog 
              onComplete={onOrderComplete}
              disabled={!order || order.items.length === 0}
            />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

interface OrderItemProps {
  item: OrderItem;
  settings: Settings;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const OrderItem = ({ item, settings, onQuantityChange, onRemoveItem }: OrderItemProps) => {
  return (
    <div className="flex items-center justify-between border border-muted rounded-lg p-3 hover:bg-muted/20 transition-colors">
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-lg">
            {item.product.nameAr || item.product.name}
          </h4>
          <span className="text-base font-semibold text-primary">
            {settings.currencySymbol}
            {(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>

        {item.notes && (
          <p className="text-sm text-muted-foreground my-1 bg-muted/30 p-1 rounded">
            {item.notes}
          </p>
        )}

        <div className="flex items-center mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-primary"
            onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-10 text-center font-bold text-base">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full border-primary"
            onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive ml-2 hover:bg-destructive/10"
            onClick={() => onRemoveItem(item.productId)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};