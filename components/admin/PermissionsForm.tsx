
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Permission } from '@/types';

interface PermissionsFormProps {
  permissions: Permission[];
  isEditing: boolean;
  onPermissionChange: (permissionId: string, checked: boolean) => void;
}

export const PermissionsForm = ({ permissions, isEditing, onPermissionChange }: PermissionsFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
      {permissions.map((permission) => (
        <div key={permission.id} className="flex items-start space-x-2 rtl">
          <Checkbox
            id={permission.id}
            checked={permission.checked}
            onCheckedChange={(checked) => onPermissionChange(permission.id, checked === true)}
            disabled={!isEditing}
          />
          <div className="mr-2">
            <Label htmlFor={permission.id} className="font-medium">
              {permission.name}
            </Label>
            <p className="text-sm text-muted-foreground">
              {permission.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
