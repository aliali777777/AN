import React, { useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FileText, Download, Printer, ChartBar, ChartPie, FileSpreadsheet } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

// Sample data for reports
const salesData = [
  { id: 1, date: '2023-05-01', totalSales: 1250, itemsSold: 42, profit: 375 },
  { id: 2, date: '2023-05-02', totalSales: 980, itemsSold: 31, profit: 294 },
  { id: 3, date: '2023-05-03', totalSales: 1540, itemsSold: 53, profit: 462 },
  { id: 4, date: '2023-05-04', totalSales: 1320, itemsSold: 45, profit: 396 },
  { id: 5, date: '2023-05-05', totalSales: 2100, itemsSold: 68, profit: 630 },
];

const topProductsData = [
  { id: 1, name: 'كابتشينو', quantity: 245, revenue: 1225 },
  { id: 2, name: 'لاتيه', quantity: 198, revenue: 990 },
  { id: 3, name: 'أمريكانو', quantity: 187, revenue: 935 },
  { id: 4, name: 'موكا', quantity: 156, revenue: 780 },
  { id: 5, name: 'إسبريسو', quantity: 134, revenue: 670 },
];

const profitData = [
  { id: 1, month: 'يناير', revenue: 32500, expenses: 18200, profit: 14300 },
  { id: 2, month: 'فبراير', revenue: 28900, expenses: 16700, profit: 12200 },
  { id: 3, month: 'مارس', revenue: 34800, expenses: 19500, profit: 15300 },
  { id: 4, month: 'أبريل', revenue: 37200, expenses: 20800, profit: 16400 },
  { id: 5, month: 'مايو', revenue: 42100, expenses: 23500, profit: 18600 },
];

type ReportType = 'sales' | 'products' | 'profit';
type TimeFrame = 'daily' | 'monthly' | 'yearly';

const Reports = () => {
  const { hasPermission } = useAuth();
  const canViewReports = hasPermission(PERMISSIONS.VIEW_REPORTS);
  const [activeReport, setActiveReport] = useState<ReportType>('sales');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('daily');
  const [showDialog, setShowDialog] = useState(false);
  const [currentReportTitle, setCurrentReportTitle] = useState('');
	const { t } = useLanguage();

  const handleShowReport = (reportType: ReportType, title: string) => {
    setActiveReport(reportType);
    setCurrentReportTitle(title);
    setShowDialog(true);
  };

  const handleExport = (format: string) => {
    toast.success(`تم تصدير التقرير بصيغة ${format}`);
    setShowDialog(false);
  };

  const handlePrint = () => {
    toast.success('جاري إرسال التقرير للطباعة');
    setShowDialog(false);
  };

  if (!canViewReports) {
    return (
      <div className="flex h-screen">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sidebar className="lg:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{t('reports')}</h1>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle>{t('unauthorized')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">
                  {t('no_permission_to_access_reports')}
                </p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sidebar className="lg:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{t('reports')}</h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">{t('sales_reports')}</TabsTrigger>
              <TabsTrigger value="products">{t('products_reports')}</TabsTrigger>
              <TabsTrigger value="profits">{t('profit_loss_reports')}</TabsTrigger>
            </TabsList>

            <TabsContent value="sales" className="space-y-4">
              <div className="flex gap-3 mb-6">
                <Button 
                  variant={timeFrame === 'daily' ? 'default' : 'outline'}
                  onClick={() => setTimeFrame('daily')}
                >
                  {t('daily')}
                </Button>
                <Button 
                  variant={timeFrame === 'monthly' ? 'default' : 'outline'}
                  onClick={() => setTimeFrame('monthly')}
                >
                  {t('monthly')}
                </Button>
                <Button 
                  variant={timeFrame === 'yearly' ? 'default' : 'outline'}
                  onClick={() => setTimeFrame('yearly')}
                >
                  {t('yearly')}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t('sales_report')} {timeFrame === 'daily' ? t('daily') : timeFrame === 'monthly' ? t('monthly') : t('yearly')}</span>
                    <Button onClick={() => handleShowReport('sales', t('sales_report'))}>
                      <ChartBar className="ml-2 h-4 w-4" />
                      {t('view_report')}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('view_sales_reports')} {timeFrame === 'daily' ? t('daily_reports') : timeFrame === 'monthly' ? t('monthly_reports') : t('yearly_reports')} {t('and_analyze_data')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t('top_selling_products_report')}</span>
                    <Button onClick={() => handleShowReport('products', t('products_report'))}>
                      <ChartPie className="ml-2 h-4 w-4" />
                      {t('view_report')}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('view_top_selling_products_report')} {t('and_analyze_performance')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t('profit_and_loss_report')}</span>
                    <Button onClick={() => handleShowReport('profit', t('profit_report'))}>
                      <FileSpreadsheet className="ml-2 h-4 w-4" />
                      {t('view_report')}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('view_profit_and_loss_reports')} {t('and_analyze_financial_performance')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-[80%]">
              <DialogHeader>
                <DialogTitle>{currentReportTitle}</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <div className="flex justify-end gap-2 mb-4">
                  <Button variant="outline" onClick={() => handleExport('PDF')}>
                    <FileText className="ml-2 h-4 w-4" />
                    {t('export_pdf')}
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('Excel')}>
                    <Download className="ml-2 h-4 w-4" />
                    {t('export_excel')}
                  </Button>
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="ml-2 h-4 w-4" />
                    {t('print')}
                  </Button>
                </div>

                {activeReport === 'sales' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t('date')}</TableHead>
                        <TableHead className="text-right">{t('total_sales')}</TableHead>
                        <TableHead className="text-right">{t('items_sold')}</TableHead>
                        <TableHead className="text-right">{t('profit')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>{row.totalSales} ريال</TableCell>
                          <TableCell>{row.itemsSold}</TableCell>
                          <TableCell>{row.profit} ريال</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeReport === 'products' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t('product')}</TableHead>
                        <TableHead className="text-right">{t('quantity_sold')}</TableHead>
                        <TableHead className="text-right">{t('revenue')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProductsData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.quantity}</TableCell>
                          <TableCell>{row.revenue} ريال</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeReport === 'profit' && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">{t('month')}</TableHead>
                        <TableHead className="text-right">{t('revenue')}</TableHead>
                        <TableHead className="text-right">{t('expenses')}</TableHead>
                        <TableHead className="text-right">{t('profit')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profitData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.month}</TableCell>
                          <TableCell>{row.revenue} ريال</TableCell>
                          <TableCell>{row.expenses} ريال</TableCell>
                          <TableCell>{row.profit} ريال</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <DialogFooter>
                <Button onClick={() => setShowDialog(false)}>{t('close')}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default Reports;