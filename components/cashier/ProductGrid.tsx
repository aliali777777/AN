import React from 'react';
import { Button } from '@/components/ui/button';
import { Product, Settings } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { FileText } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  settings: Settings;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onProductClick,
  settings 
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-3 gap-1 h-full overflow-y-auto">
      {products.length > 0 ? (
        products.map(product => (
          <Button
            key={product.id}
            variant="outline"
            className="h-24 flex flex-col items-center justify-center p-2 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={() => onProductClick(product)}
          >
            <span className="text-sm font-medium text-right w-full">
              {product.nameAr || product.name}
            </span>
            <span className="text-xs text-white/70 mt-auto text-right w-full">
              {settings.currencySymbol}{product.price.toFixed(2)}
            </span>
            {product.description && (
              <span className="absolute top-1 left-1">
                <FileText size={12} className="text-amber-400" />
              </span>
            )}
          </Button>
        ))
      ) : (
        <div className="col-span-3 flex items-center justify-center h-full">
          <span className="text-gray-500">{t('no_products_in_category')}</span>
        </div>
      )}
    </div>
  );
};