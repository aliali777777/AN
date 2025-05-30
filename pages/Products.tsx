import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProducts } from '@/context/ProductContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { PERMISSIONS } from '@/types';
import { Product } from '@/types';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Edit,
  Trash,
  Save,
  Image,
  Eye,
  EyeOff,
  Package,
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryManagement } from '@/components/products/CategoryManagement';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useLanguage } from '@/context/LanguageContext';

const ProductDialog = ({ 
  product, 
  isOpen, 
  onOpenChange, 
  onSave,
  categories
}: { 
  product?: Product; 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSave: (product: Omit<Product, 'id'>) => void,
  categories: string[];
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    category: product?.category || (categories.length > 0 ? categories[0] : ''),
    price: product?.price || 0,
    cost: product?.cost || 0,
    image: product?.image || '',
    description: product?.description || '',
    isAvailable: product?.isAvailable ?? true,
  });

  const { t } = useLanguage();

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error(t('product_name_required'));
      return;
    }

    if (formData.price <= 0) {
      toast.error(t('product_price_positive'));
      return;
    }

    onSave(formData);
    onOpenChange(false);
  };

  useEffect(() => {
    // Update category if the current one doesn't exist anymore
    if (formData.category && !categories.includes(formData.category) && categories.length > 0) {
      handleChange('category', categories[0]);
    }
  }, [categories]);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>{product ? t('edit_product') : t('add_new_product')}</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('product_name_english')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Product Name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameAr">{t('product_name_arabic')}</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => handleChange('nameAr', e.target.value)}
              placeholder={t('product_name')}
              className="rtl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">{t('category')}</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('select_category')} />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    {t('no_categories_available')}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{t('image_url')}</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="Image URL"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">{t('selling_price')}</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">{t('cost')}</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) => handleChange('cost', Number(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t('product_description')}</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Product description"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isAvailable"
            checked={formData.isAvailable}
            onCheckedChange={(checked) => handleChange('isAvailable', checked)}
          />
          <Label htmlFor="isAvailable">{t('available_for_sale')}</Label>
        </div>

        <DialogFooter>
          <Button type="submit">
            <Save className="ml-2 h-4 w-4" />
            {t('save')}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

const Products = () => {
  const { hasPermission } = useAuth();
  const { 
    products, 
    addNewProduct, 
    updateExistingProduct, 
    removeProduct, 
    toggleProductAvailability 
  } = useProducts();

  const canManageProducts = hasPermission(PERMISSIONS.MANAGE_PRODUCTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const { t } = useLanguage();

  // Extract all unique categories from products
  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
    setCategories(uniqueCategories);
  }, [products]);

  // Filter products based on search query and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.nameAr && product.nameAr.includes(searchQuery)) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeTab === "all" || product.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setSelectedProduct(undefined);
    setDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(t('confirm_delete_product').replace('{productName}', product.nameAr || product.name))) {
      removeProduct(product.id);
    }
  };

  const handleSaveProduct = (formData: Omit<Product, 'id'>) => {
    if (selectedProduct) {
      updateExistingProduct({
        ...formData,
        id: selectedProduct.id
      });
    } else {
      addNewProduct(formData);
    }
  };

  // Category management handlers
  const handleAddCategory = (category: string) => {
    if (categories.includes(category)) {
      toast.error(t('category_exists'));
      return;
    }
    setCategories(prev => [...prev, category]);
    toast.success(t('category_added').replace('{category}', category));
  };

  const handleEditCategory = (oldCategory: string, newCategory: string) => {
    if (oldCategory === newCategory) return;

    if (categories.includes(newCategory)) {
      toast.error(t('category_exists'));
      return;
    }

    // Update category in list
    setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c));

    // Update all products with this category
    products
      .filter(p => p.category === oldCategory)
      .forEach(p => {
        updateExistingProduct({
          ...p,
          category: newCategory
        });
      });

    toast.success(t('category_renamed').replace('{oldCategory}', oldCategory).replace('{newCategory}', newCategory));

    // Update active tab if needed
    if (activeTab === oldCategory) {
      setActiveTab(newCategory);
    }
  };

  const handleDeleteCategory = (category: string) => {
    // Check if products use this category
    const productsWithCategory = products.filter(p => p.category === category);

    if (productsWithCategory.length > 0) {
      toast.error(t('category_in_use').replace('{category}', category).replace('{productCount}', productsWithCategory.length.toString()));
      return;
    }

    setCategories(prev => prev.filter(c => c !== category));

    // Reset active tab if needed
    if (activeTab === category) {
      setActiveTab("all");
    }

    toast.success(t('category_deleted').replace('{category}', category));
  };

  // Redirect if no permissions
  if (!canManageProducts) {
    return (
      <div className="flex h-screen">
        <Sidebar className="w-64 hidden md:block" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sidebar className="lg:hidden" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{t('products_management')}</h1>
            </div>
          </header>

          <main className="flex-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                <CardTitle>{t('unauthorized')}</CardTitle>
                <CardContent>
                  {t('no_permission_products')}
                </CardContent>
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
            <h1 className="text-lg font-semibold">{t('products_management')}</h1>
          </div>

          <Button onClick={handleAddProduct}>
            <Plus className="ml-2 h-4 w-4" />
            {t('add_product')}
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-4">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  <Package className="mr-2 h-4 w-4" />
                  {t('category_management')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryManagement 
                  categories={categories}
                  onAddCategory={handleAddCategory}
                  onEditCategory={handleEditCategory}
                  onDeleteCategory={handleDeleteCategory}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-5">
              <CardContent className="pt-6">
                <div className="relative mb-4">
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={t('search_product')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 pr-10 rtl"
                  />
                </div>

                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 w-full overflow-x-auto flex flex-nowrap justify-start">
                    <TabsTrigger value="all" className="flex-shrink-0">
                      {t('all')} ({products.length})
                    </TabsTrigger>
                    {categories.map(category => (
                      <TabsTrigger key={category} value={category} className="flex-shrink-0">
                        {category} ({products.filter(p => p.category === category).length})
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('products')} ({filteredProducts.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('product')}</TableHead>
                      <TableHead>{t('category')}</TableHead>
                      <TableHead>{t('price')}</TableHead>
                      <TableHead>{t('cost')}</TableHead>
                      <TableHead>{t('profit')}</TableHead>
                      <TableHead>{t('available')}</TableHead>
                      <TableHead className="text-left">{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {product.image ? (
                                <div 
                                  className="w-8 h-8 bg-muted rounded-md bg-cover bg-center"
                                  style={{ backgroundImage: `url(${product.image})` }}
                                />
                              ) : (
                                <div className="w-8 h-8 bg-muted rounded-md flex items-center justify-center text-xs font-bold">
                                  {product.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <div>{product.nameAr || product.name}</div>
                                {product.nameAr && <div className="text-xs text-muted-foreground">{product.name}</div>}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-muted">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.cost.toFixed(2)}</TableCell>
                          <TableCell className="text-primary">
                            {(product.price - product.cost).toFixed(2)} ({((product.price - product.cost) / product.price * 100).toFixed(0)}%)
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => toggleProductAvailability(product.id)}
                              className={product.isAvailable ? "text-green-500" : "text-destructive"}
                            >
                              {product.isAvailable ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteProduct(product)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {t('no_matching_products')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <ProductDialog 
            product={selectedProduct} 
            isOpen={dialogOpen} 
            onOpenChange={setDialogOpen} 
            onSave={handleSaveProduct} 
            categories={categories}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default Products;