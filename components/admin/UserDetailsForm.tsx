
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types';

interface UserDetailsFormProps {
  formData: {
    username: string;
    password: string;
    role: string;
    isActive: boolean;
  };
  selectedUser: User | null;
  isEditing: boolean;
  onFormChange: (field: string, value: any) => void;
}

export const UserDetailsForm = ({ formData, selectedUser, isEditing, onFormChange }: UserDetailsFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => onFormChange('username', e.target.value)}
          disabled={!isEditing || selectedUser?.role === 'admin'}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور {isEditing && !selectedUser?.id && "(مطلوب)"}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => onFormChange('password', e.target.value)}
          disabled={!isEditing || selectedUser?.role === 'admin'}
          placeholder={selectedUser?.id ? "*** (لا تغيير)" : ""}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">الدور</Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => onFormChange('role', e.target.value)}
          disabled={!isEditing || selectedUser?.role === 'admin'}
          className="w-full p-2 border rounded"
        >
          <option value="cashier">كاشير</option>
          <option value="kitchen">مطبخ</option>
          {!selectedUser?.id && (
            <option value="admin">مدير</option>
          )}
        </select>
      </div>
      
      <div className="space-y-2 flex items-end">
        <div className="flex items-center space-x-2 rtl">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => onFormChange('isActive', checked === true)}
            disabled={!isEditing || selectedUser?.role === 'admin'}
          />
          <Label htmlFor="isActive" className="mr-2">مستخدم نشط</Label>
        </div>
      </div>
    </div>
  );
};
