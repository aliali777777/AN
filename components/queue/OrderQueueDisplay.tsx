import React, { useEffect, useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrder } from '@/context/OrderContext';
import { Clock } from 'lucide-react';
import { Order, KitchenOrderStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';

export const OrderQueueDisplay = () => {
  const { orders, getActiveKitchenOrders, updateKitchenOrderStatus } = useOrder();
  const [queueOrders, setQueueOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useLanguage();

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Set up auto-removal for ready orders after 30 seconds
  useEffect(() => {
    // Get today's date at 00:00 to filter orders from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter orders from today
    const todaysOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today;
    });

    // Sort orders by number
    const sortedOrders = todaysOrders.sort((a, b) => a.orderNumber - b.orderNumber);

    // Filter out delivered orders
    const filteredOrders = sortedOrders.filter(order => 
      order.kitchenStatus !== 'delivered'
    );

    setQueueOrders(filteredOrders);

    // Set up interval to check for ready orders that should be auto-removed
    const autoRemoveInterval = setInterval(() => {
      const readyOrders = filteredOrders.filter(
        order => order.kitchenStatus === 'ready'
      );

      for (const order of readyOrders) {
        const readyTime = new Date(order.estimatedCompletionTime || order.updatedAt);
        const currentTime = new Date();
        const diffInSeconds = (currentTime.getTime() - readyTime.getTime()) / 1000;

        // If the order has been ready for more than 30 seconds, mark it as delivered
        if (diffInSeconds >= 30) {
          updateKitchenOrderStatus(order.id, 'delivered');
        }
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(autoRemoveInterval);
  }, [orders, updateKitchenOrderStatus]);

  // Get localized status text
  const getStatusText = (order: Order): string => {
    if (order.status === 'completed' || order.kitchenStatus === 'delivered') {
      return t('ready');
    } else if (order.kitchenStatus === 'ready') {
      return t('ready');
    } else if (order.kitchenStatus === 'in-progress') {
      return t('in_progress');
    } else if (order.kitchenStatus === 'new') {
      return t('new');
    } else {
      return t('pending');
    }
  };

  // Get status color for badge
  const getStatusColor = (order: Order): string => {
    if (order.status === 'completed' || order.kitchenStatus === 'delivered') {
      return 'bg-green-500';
    } else if (order.kitchenStatus === 'ready') {
      return 'bg-green-500';
    } else if (order.kitchenStatus === 'in-progress') {
      return 'bg-yellow-500';
    } else {
      return 'bg-blue-500';
    }
  };

  // استخدام وقت التحضير المحدد من قبل المطبخ
  const getExpectedWaitTime = (order: Order): number | string => {
    // إذا كان الطلب جاهز أو مكتمل، لا وقت للانتظار
    if (order.status === 'completed' || order.kitchenStatus === 'delivered' || order.kitchenStatus === 'ready') {
      return 0;
    }

    // استخدام وقت التحضير المحدد مباشرةً من المطبخ
    if (order.estimatedCompletionTime) {
      const completionTime = new Date(order.estimatedCompletionTime);
      const currentTime = new Date();

      // إذا كان الوقت المتوقع قد انتهى بالفعل
      if (completionTime < currentTime) {
        return t("soon");
      }

      // حساب الفرق بالدقائق - بالضبط كما حدده المطبخ
      const diffInMs = completionTime.getTime() - currentTime.getTime();
      const diffInMinutes = Math.ceil(diffInMs / (1000 * 60));

      return diffInMinutes;
    }

    // للطلبات التي في حالة in-progress ولكن بدون وقت محدد، استخدم وقت افتراضي (15 دقيقة)
    if (order.kitchenStatus === 'in-progress') {
      return 15; // وقت افتراضي للطلبات قيد التحضير إذا لم يتم تحديد الوقت
    }

    // للطلبات الجديدة التي لم تبدأ بعد، استخدم وقت افتراضي (20 دقيقة)
    if (order.kitchenStatus === 'new') {
      return 20; // وقت افتراضي للطلبات الجديدة 
    }

    // إذا لم يكن هناك وقت تحضير محدد
    return t("not_specified");
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{t("order_queue_list")}</CardTitle>
          <div className="text-xl">
            {format(currentTime, 'HH:mm:ss a')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-center text-lg">{t("order_number")}</TableHead>
              <TableHead className="font-bold text-center text-lg">{t("status")}</TableHead>
              <TableHead className="font-bold text-center text-lg">{t("waiting_time_minutes")}</TableHead>
              <TableHead className="font-bold text-center text-lg">{t("order_time")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queueOrders.length > 0 ? (
              queueOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  className={cn(
                    "text-center text-lg",
                    (order.kitchenStatus === 'ready' || order.status === 'completed') ? "bg-green-50" : ""
                  )}
                >
                  <TableCell className="text-center font-bold text-xl">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn("px-3 py-1 text-white", getStatusColor(order))}>
                      {getStatusText(order)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getExpectedWaitTime(order) === 0 ? (
                      <span className="text-green-600 font-medium">{t("ready_to_pickup")}</span>
                    ) : typeof getExpectedWaitTime(order) === 'number' ? (
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-5 w-5" />
                        <span>{getExpectedWaitTime(order)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">{getExpectedWaitTime(order)}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(new Date(order.createdAt), 'HH:mm:ss a')}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  {t("no_current_orders")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};