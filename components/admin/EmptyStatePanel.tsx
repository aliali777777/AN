
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

interface EmptyStatePanelProps {
  onAddUser: () => void;
}

export const EmptyStatePanel = ({ onAddUser }: EmptyStatePanelProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <Users className="h-16 w-16 mx-auto text-muted-foreground" />
        <h3 className="text-lg font-medium">اختر مستخدمًا لعرض التفاصيل</h3>
        <Button onClick={onAddUser}>
          <UserPlus className="h-4 w-4 ml-2" />
          إضافة مستخدم جديد
        </Button>
      </div>
    </div>
  );
};
