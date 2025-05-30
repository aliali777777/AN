
import React from 'react';
import { Order, Settings } from '@/types';
import { format } from 'date-fns';

interface OrderReceiptProps {
  order: Order;
  settings: Settings;
}

export const OrderReceipt = ({ order, settings }: OrderReceiptProps) => {
  return (
    <div className="print-only p-4 font-mono text-sm" style={{ width: `${settings.receiptWidth}mm` }}>
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg">{settings.businessName}</h2>
        <p>{settings.businessAddress}</p>
        <p>TEL: {settings.businessPhone}</p>
        {settings.showLogo && <img src="/logo.png" alt="Logo" className="mx-auto my-2 h-12" />}
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Sales Invoice-POS</span>
          <span>#{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</span>
        </div>
      </div>

      <div className="border-t border-b py-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between mb-1">
            <div>
              <div>{item.product.nameAr || item.product.name}</div>
              <div className="text-xs">
                {item.quantity} x {settings.currencySymbol}{item.product.price}
              </div>
            </div>
            <div>
              {settings.currencySymbol}
              {(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{settings.currencySymbol}{order.totalAmount.toFixed(2)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- {settings.currencySymbol}{order.discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{settings.currencySymbol}{order.finalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-sm">
        <p>Thank you for visiting</p>
        <p>{settings.receiptFooter}</p>
      </div>
    </div>
  );
};
