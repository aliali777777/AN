
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit, Trash, Save } from 'lucide-react';
import { User, Permission } from '@/types';
import { UserDetailsForm } from './UserDetailsForm';
import { PermissionsForm } from './PermissionsForm';

interface UserDetailPanelProps {
  selectedUser: User | null;
  formData: {
    username: string;
    password: string;
    role: string;
    permissions: Permission[];
    isActive: boolean;
  };
  isEditing: boolean;
  onSetEditing: (isEditing: boolean) => void;
  onFormChange: (field: string, value: any) => void;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSaveUser: () => void;
  onDeleteUser: (userId: string) => void;
  onCancel: () => void;
}

export const UserDetailPanel = ({ 
  selectedUser, 
  formData, 
  isEditing, 
  onSetEditing, 
  onFormChange, 
  onPermissionChange,
  onSaveUser,
  onDeleteUser,
  onCancel
}: UserDetailPanelProps) => {

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>
            {isEditing ? 'تعديل المستخدم' : 'تفاصيل المستخدم'}
          </CardTitle>
          <div className="flex gap-2">
            {!isEditing && selectedUser?.role !== 'admin' && (
              <Button variant="outline" size="sm" onClick={() => onSetEditing(true)}>
                <Edit className="h-4 w-4 ml-2" />
                تعديل
              </Button>
            )}
            
            {selectedUser?.role !== 'admin' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="h-4 w-4 ml-2" />
                    حذف
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف المستخدم</AlertDialogTitle>
                    <AlertDialogDescription>
                      هل أنت متأكد من حذف المستخدم {selectedUser?.username}؟ لا يمكن التراجع عن هذا الإجراء.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => selectedUser && onDeleteUser(selectedUser.id)}
                      className="bg-destructive text-destructive-foreground"
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
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
              selectedUser={selectedUser} 
              isEditing={isEditing} 
              onFormChange={onFormChange} 
            />
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            {selectedUser?.role === 'admin' ? (
              <div className="text-center p-4 bg-secondary rounded-md">
                المدير يملك جميع الصلاحيات تلقائياً
              </div>
            ) : (
              <PermissionsForm 
                permissions={formData.permissions} 
                isEditing={isEditing} 
                onPermissionChange={onPermissionChange} 
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {isEditing && (
        <CardFooter className="justify-end gap-2 border-t p-4">
          <Button 
            variant="outline"
            onClick={onCancel}
          >
            إلغاء
          </Button>
          <Button onClick={onSaveUser}>
            <Save className="h-4 w-4 ml-2" />
            حفظ
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
