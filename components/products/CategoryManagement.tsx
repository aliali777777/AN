
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash } from 'lucide-react';

interface CategoryManagementProps {
  categories: string[];
  onAddCategory: (category: string) => void;
  onEditCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (category: string) => void;
}

export const CategoryManagement: React.FC<CategoryManagementProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenDialog = (isEdit: boolean, category?: string) => {
    setEditMode(isEdit);
    if (isEdit && category) {
      setSelectedCategory(category);
      setCategoryName(category);
    } else {
      setSelectedCategory(null);
      setCategoryName('');
    }
    setDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) return;

    if (editMode && selectedCategory) {
      onEditCategory(selectedCategory, categoryName.trim());
    } else {
      onAddCategory(categoryName.trim());
    }
    setDialogOpen(false);
    setCategoryName('');
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`هل أنت متأكد من حذف التصنيف "${category}"؟`)) {
      onDeleteCategory(category);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>التصنيفات ({categories.length})</span>
            <Button onClick={() => handleOpenDialog(false)}>
              <Plus className="ml-2 h-4 w-4" />
              إضافة تصنيف
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category} className="relative group">
                <Badge variant="secondary" className="py-2 px-3">
                  {category}
                  <div className="absolute top-0 right-0 bottom-0 left-0 hidden group-hover:flex bg-black/5 rounded-full items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleOpenDialog(true, category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </Badge>
              </div>
            ))}
            {categories.length === 0 && (
              <div className="text-muted-foreground text-sm">لا توجد تصنيفات. أضف تصنيفًا جديدًا.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editMode ? 'تعديل تصنيف' : 'إضافة تصنيف جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">اسم التصنيف</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="أدخل اسم التصنيف"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveCategory}>
              {editMode ? 'تحديث' : 'إضافة'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
