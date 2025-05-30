import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { getSettings } from '@/utils/storage';
import { Clock, CheckCircle2, X, AlertCircle, FileText } from 'lucide-react';
import { KitchenOrderStatus, Order } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const Kitchen = () => {
  const { orders, getActiveKitchenOrders, updateKitchenOrderStatus } = useOrder();
  const { currentUser } = useAuth();
  const settings = getSettings();
  const { t } = useLanguage();

  // State for preparation time
  const [prepTimes, setPrepTimes] = useState<Record<string, number>>({});
  const [kitchenOrders, setKitchenOrders] = useState<Order[]>([]);

  // Initialize kitchen orders
  useEffect(() => {
    refreshOrders();
  }, [orders]);

  const refreshOrders = () => {
    // Get active kitchen orders
    const activeOrders = getActiveKitchenOrders();
    setKitchenOrders(activeOrders);
  };

  // Group orders by status
  const newOrders = kitchenOrders.filter(order => order.kitchenStatus === 'new');
  const inProgressOrders = kitchenOrders.filter(order => order.kitchenStatus === 'in-progress');
  const readyOrders = kitchenOrders.filter(order => order.kitchenStatus === 'ready');

  const handleStatusChange = (order: Order, newStatus: KitchenOrderStatus) => {
    updateKitchenOrderStatus(order.id, newStatus);

    // Update the status in the local state immediately
    setKitchenOrders(prev => 
      prev.map(o => {
        if (o.id === order.id) {
          return { ...o, kitchenStatus: newStatus };
        }
        return o;
      })
    );

    // Show toast message
    if (newStatus === 'in-progress') {
      toast.success('تم بدء تحضير الطلب');
    } else if (newStatus === 'ready') {
      toast.success('تم تحضير الطلب بنجاح');
    } else if (newStatus === 'delivered') {
      toast.success('تم تسليم الطلب بنجاح');
    }

    // Refresh orders from context after a short delay
    setTimeout(refreshOrders, 300);
  };

  const handlePrepTimeChange = (orderId: string, minutes: number) => {
    setPrepTimes(prev => ({
      ...prev,
      [orderId]: minutes
    }));

    // Calculate the estimated completion time
    const completionTime = new Date();
    completionTime.setMinutes(completionTime.getMinutes() + minutes);

    // Update the order with the estimated completion time
    const orderToUpdate = kitchenOrders.find(o => o.id === orderId);
    if (orderToUpdate) {
      const updatedOrder = {
        ...orderToUpdate,
        estimatedCompletionTime: completionTime
      };

      // Update the order in the local state
      setKitchenOrders(prev => 
        prev.map(o => {
          if (o.id === orderId) {
            return updatedOrder;
          }
          return o;
        })
      );
    }
  };

  // Modified to only remove from UI, not automatically set to delivered
  const markOrderAsDelivered = (orderId: string) => {
    // Mark the order as delivered by updating its status
    updateKitchenOrderStatus(orderId, 'delivered');

    // Update the local state - remove it from the kitchen view
    setKitchenOrders(prev => prev.filter(o => o.id !== orderId));

    // Show toast
    toast.success('تم تسليم الطلب بنجاح');
  };

  // Calculate remaining time
  const getRemainingTime = (order: Order): string => {
    if (!order.estimatedCompletionTime) return '';

    const now = new Date();
    const completionTime = new Date(order.estimatedCompletionTime);
    const diffInMs = completionTime.getTime() - now.getTime();

    if (diffInMs <= 0) return 'متأخر';

    const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));
    return `${diffInMinutes} دقيقة`;
  };

  // Check for orders that have completed their prep time
  useEffect(() => {
    const checkCompletionTimes = () => {
      const now = new Date();

      inProgressOrders.forEach(order => {
        if (order.estimatedCompletionTime) {
          const completionTime = new Date(order.estimatedCompletionTime);
          if (now >= completionTime && order.kitchenStatus === 'in-progress') {
            // Time's up, mark as ready
            handleStatusChange(order, 'ready');
          }
        }
      });
    };

    // Check every 10 seconds
    const interval = setInterval(checkCompletionTimes, 10000);
    return () => clearInterval(interval);
  }, [inProgressOrders]);

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sidebar className="lg:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t("kitchen_screen")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3">
              {currentUser?.username || 'مطبخ'}
            </Badge>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* New Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("new_orders")}</h2>
                <Badge className="bg-blue-500" variant="default">
                  {newOrders.length}
                </Badge>
              </div>

              {newOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  {t("no_new_orders")}
                </div>
              ) : (
                newOrders.map(order => (
                  <Card key={order.id} className="border-2 border-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          {t("order")} #{order.orderNumber}
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(order.createdAt).toLocaleTimeString('ar', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                                {item.quantity}
                              </Badge>
                              <div className="font-medium rtl">
                                <span>{item.product.nameAr || item.product.name}</span>
                                {item.notes && (
                                  <div className="flex items-center gap-1 text-amber-500 text-sm mt-0.5">
                                    <FileText size={12} />
                                    <span>{item.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {settings.showPriceOnKitchenDisplay && (
                              <span className="text-muted-foreground">
                                {settings.currencySymbol}{item.product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded-md rtl">
                          <div className="font-medium">{t("notes")}:</div>
                          <div>{order.notes}</div>
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="text-sm font-medium block mb-1 rtl">
                          {t("preparation_time_minutes")}:
                        </label>
                        <div className="flex items-center gap-2">
                          {[5, 10, 15, 20, 30].map(time => (
                            <Button
                              key={time}
                              variant={prepTimes[order.id] === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePrepTimeChange(order.id, time)}
                              className="h-8"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full"
                        disabled={!prepTimes[order.id]}
                        onClick={() => handleStatusChange(order, 'in-progress')}
                      >
                        <Clock className="ml-2 h-4 w-4" />
                        {t("start_preparation")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            {/* In Progress Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("in_progress")}</h2>
                <Badge className="bg-yellow-500" variant="default">
                  {inProgressOrders.length}
                </Badge>
              </div>

              {inProgressOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  {t("no_orders_in_progress")}
                </div>
              ) : (
                inProgressOrders.map(order => (
                  <Card key={order.id} className="border-2 border-yellow-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          {t("order")} #{order.orderNumber}
                        </CardTitle>
                        <div className="flex flex-col items-end">
                          <Badge variant="outline">
                            {new Date(order.createdAt).toLocaleTimeString('ar', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Badge>
                          {order.estimatedCompletionTime && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "mt-1",
                                getRemainingTime(order) === 'متأخر' ? "text-destructive" : ""
                              )}
                            >
                              <Clock className="mr-1 h-3 w-3" />
                              {getRemainingTime(order)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                                {item.quantity}
                              </Badge>
                              <div className="font-medium rtl">
                                <span>{item.product.nameAr || item.product.name}</span>
                                {item.notes && (
                                  <div className="flex items-center gap-1 text-amber-500 text-sm mt-0.5">
                                    <FileText size={12} />
                                    <span>{item.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded-md rtl">
                          <div className="font-medium">{t("notes")}:</div>
                          <div>{order.notes}</div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full"
                        onClick={() => handleStatusChange(order, 'ready')}
                      >
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                        {t("mark_as_ready")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>

            {/* Ready Orders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("ready_for_delivery")}</h2>
                <Badge className="bg-green-500" variant="default">
                  {readyOrders.length}
                </Badge>
              </div>

              {readyOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  {t("no_orders_ready")}
                </div>
              ) : (
                readyOrders.map(order => (
                  <Card key={order.id} className="border-2 border-green-500">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>
                          {t("order")} #{order.orderNumber}
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(order.createdAt).toLocaleTimeString('ar', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                                {item.quantity}
                              </Badge>
                              <div className="font-medium rtl">
                                <span>{item.product.nameAr || item.product.name}</span>
                                {item.notes && (
                                  <div className="flex items-center gap-1 text-amber-500 text-sm mt-0.5">
                                    <FileText size={12} />
                                    <span>{item.notes}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded-md rtl">
                          <div className="font-medium">{t("notes")}:</div>
                          <div>{order.notes}</div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="pt-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => markOrderAsDelivered(order.id)}
                      >
                        <CheckCircle2 className="ml-2 h-4 w-4" />
                        {t("mark_as_delivered")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Kitchen;