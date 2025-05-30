
import React, { useState } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { getSettings, updateSettings } from '@/utils/storage';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { PERMISSIONS } from '@/types';
import { toast } from 'sonner';
import {
  Save,
  Settings as SettingsIcon,
  Printer,
  Globe,
  Store,
  X
} from 'lucide-react';

const Settings = () => {
  const { hasPermission } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const canManageSettings = hasPermission(PERMISSIONS.MANAGE_SETTINGS);
  
  const [settings, setSettings] = useState(getSettings());
  
  const handleSaveSettings = () => {
    if (!canManageSettings) {
      toast.error(t('no_permission'));
      return;
    }
    
    try {
      updateSettings(settings);
      toast.success(t('settings_saved'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error(t('settings_error'));
    }
  };
  
  const handleChange = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    
    setSettings(newSettings);
    
    if (key === 'language') {
      setLanguage(value as 'ar' | 'en' | 'fr');
      // Save settings immediately when language changes
      updateSettings(newSettings);
    }
  };
  
  // Redirect if no permissions
  if (!canManageSettings) {
    return (
      <div className="flex h-screen">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sidebar className="lg:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{t('settings')}</h1>
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <X className="mx-auto h-10 w-10 text-destructive" />
                <CardTitle>{t('unauthorized')}</CardTitle>
                <CardDescription>
                  {t('no_access')}
                </CardDescription>
              </CardHeader>
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
            <h1 className="text-lg font-semibold">{t('settings')}</h1>
          </div>
          
          <Button onClick={handleSaveSettings}>
            <Save className="ml-2 h-4 w-4" />
            {t('save_settings')}
          </Button>
        </header>
        
        <main className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="general">{t('general')}</TabsTrigger>
              <TabsTrigger value="printing">{t('printing')}</TabsTrigger>
              <TabsTrigger value="business">{t('business')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="h-5 w-5" />
                    {t('general_settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoPrintReceipt" className="flex flex-col space-y-1">
                        <span>{t('auto_print_receipt')}</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          {t('auto_print_receipt_desc')}
                        </span>
                      </Label>
                      <Switch 
                        id="autoPrintReceipt"
                        checked={settings.autoPrintReceipt}
                        onCheckedChange={(checked) => handleChange('autoPrintReceipt', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoKitchenPrint" className="flex flex-col space-y-1">
                        <span>{t('auto_kitchen_print')}</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          {t('auto_kitchen_print_desc')}
                        </span>
                      </Label>
                      <Switch 
                        id="autoKitchenPrint"
                        checked={settings.autoKitchenPrint || false}
                        onCheckedChange={(checked) => handleChange('autoKitchenPrint', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showPriceOnKitchenDisplay" className="flex flex-col space-y-1">
                        <span>{t('show_price_kitchen')}</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          {t('show_price_kitchen_desc')}
                        </span>
                      </Label>
                      <Switch 
                        id="showPriceOnKitchenDisplay"
                        checked={settings.showPriceOnKitchenDisplay || false}
                        onCheckedChange={(checked) => handleChange('showPriceOnKitchenDisplay', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="language" className="flex flex-col space-y-1">
                        <span>{t('app_language')}</span>
                        <span className="font-normal text-sm text-muted-foreground">
                          {t('app_language_desc')}
                        </span>
                      </Label>
                      <Select 
                        value={language}
                        onValueChange={(value) => handleChange('language', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder={t('choose_language')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ar">{t('arabic')}</SelectItem>
                          <SelectItem value="en">{t('english')}</SelectItem>
                          <SelectItem value="fr">{t('french')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="currencySymbol">{t('currency_symbol')}</Label>
                      <Input 
                        id="currencySymbol"
                        placeholder="$"
                        value={settings.currencySymbol}
                        onChange={(e) => handleChange('currencySymbol', e.target.value)}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="printing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    {t('printing_settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="receiptPrinter">{t('receipt_printer')}</Label>
                      <Select 
                        value={settings.receiptPrinter || ''}
                        onValueChange={(value) => handleChange('receiptPrinter', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('choose_printer')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">{t('default_printer')}</SelectItem>
                          <SelectItem value="thermal">{t('thermal_printer')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="kitchenPrinter">{t('kitchen_printer')}</Label>
                      <Select 
                        value={settings.kitchenPrinter || ''}
                        onValueChange={(value) => handleChange('kitchenPrinter', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t('choose_printer')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">{t('default_printer')}</SelectItem>
                          <SelectItem value="thermal">{t('thermal_printer')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="receiptWidth">{t('receipt_width')}</Label>
                      <Input 
                        id="receiptWidth"
                        type="number"
                        placeholder="80"
                        value={settings.receiptWidth || 80}
                        onChange={(e) => handleChange('receiptWidth', Number(e.target.value))}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLogo" className="flex flex-col space-y-1">
                        <span>{t('show_logo')}</span>
                      </Label>
                      <Switch 
                        id="showLogo"
                        checked={settings.showLogo || false}
                        onCheckedChange={(checked) => handleChange('showLogo', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="business" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    {t('business_info')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">{t('business_name')}</Label>
                      <Input 
                        id="businessName"
                        placeholder={t('business_name')}
                        value={settings.businessName || ''}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="businessAddress">{t('business_address')}</Label>
                      <Input 
                        id="businessAddress"
                        placeholder={t('business_address')}
                        value={settings.businessAddress || ''}
                        onChange={(e) => handleChange('businessAddress', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="businessPhone">{t('business_phone')}</Label>
                      <Input 
                        id="businessPhone"
                        placeholder={t('business_phone')}
                        value={settings.businessPhone || ''}
                        onChange={(e) => handleChange('businessPhone', e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="taxRate">{t('tax_rate')}</Label>
                      <Input 
                        id="taxRate"
                        type="number"
                        placeholder="0"
                        value={settings.taxRate || 0}
                        onChange={(e) => handleChange('taxRate', Number(e.target.value))}
                        className="w-full max-w-[180px]"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="receiptFooter">{t('receipt_footer')}</Label>
                      <Input 
                        id="receiptFooter"
                        placeholder="شكراً لزيارتكم"
                        value={settings.receiptFooter || ''}
                        onChange={(e) => handleChange('receiptFooter', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
