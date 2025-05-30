import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <p className="text-muted-foreground">{t("welcome")}, {user?.username}!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total")} {t("profit_report")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% {t("this_month")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pending_orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% {t("this_month")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("users")}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% {t("this_month")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("active")} {t("today")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 {t("today")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("pending_orders")}</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("new_order")} #{t("order_number")} 1234
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("customer")}: John Doe - {t("total")}: $23.50
                  </p>
                </div>
                <div className="ml-auto font-medium">2 {t("loading")}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("order_number")} #1233 {t("completed")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("customer")}: Jane Smith - {t("total")}: $45.00
                  </p>
                </div>
                <div className="ml-auto font-medium">5 {t("loading")}</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t("customer")} {t("add_user")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mike Johnson {t("add_user")}
                  </p>
                </div>
                <div className="ml-auto font-medium">10 {t("loading")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("reports")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("daily_sales")}</span>
                <span className="text-sm font-bold">$1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("pending_orders")}</span>
                <span className="text-sm font-bold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("completed")} {t("pending_orders")}</span>
                <span className="text-sm font-bold">47</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("order_total")}</span>
                <span className="text-sm font-bold">$26.23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;