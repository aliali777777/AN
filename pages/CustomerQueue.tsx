import React, { useState, useEffect } from 'react';
import { useOrder } from '@/context/OrderContext';
import { Sidebar } from '@/components/common/Sidebar';
import { OrderQueueDisplay } from '@/components/queue/OrderQueueDisplay';
import { Badge } from '@/components/ui/badge';
import { getSettings } from '@/utils/storage';
import { useLanguage } from '@/context/LanguageContext';

const CustomerQueue = () => {
  const { orders } = useOrder();
  const settings = getSettings();
  const { t } = useLanguage();

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t("customer_queue_screen")}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3">
              {settings.businessName}
            </Badge>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <OrderQueueDisplay />
        </main>
      </div>
    </div>
  );
};

export default CustomerQueue;