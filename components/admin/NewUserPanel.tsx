
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Permission } from '@/types';
import { UserDetailsForm } from './UserDetailsForm';
import { PermissionsForm } from './PermissionsForm';

interface NewUserPanelProps {
  formData: {
    username: string;
    password: string;
    role: string;
    permissions: Permission[];
    isActive: boolean;
  };
  onFormChange: (field: string, value: any) => void;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSaveUser: () => void;
  onCancel: () => void;
}

export const NewUserPanel = ({ 
  formData, 
  onFormChange, 
  onPermissionChange, 
  onSaveUser, 
  onCancel 
}: NewUserPanelProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>إضافة مستخدم جديد</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">التفاصيل</TabsTrigger>
            <TabsTrigger value="permissions">الصلاحيات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <UserDetailsForm 
              formData={formData} 
              selectedUser={null} 
              isEditing={true} 
              onFormChange={onFormChange} 
            />
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <PermissionsForm 
              permissions={formData.permissions} 
              isEditing={true} 
              onPermissionChange={onPermissionChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="justify-end gap-2 border-t p-4">
        <Button 
          variant="outline"
          onClick={onCancel}
        >
          إلغاء
        </Button>
        <Button onClick={onSaveUser}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة
        </Button>
      </CardFooter>
    </Card>
  );
};
