
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, User as UserIcon } from 'lucide-react';
import { User } from '@/types';

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onAddUser: () => void;
}

export const UserList = ({ users, selectedUser, onSelectUser, onAddUser }: UserListProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">المستخدمين</CardTitle>
          <Button size="sm" variant="outline" onClick={onAddUser}>
            <UserPlus className="h-4 w-4 ml-2" />
            إضافة
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-1">
        {users.map((user) => (
          <Button
            key={user.id}
            variant={selectedUser?.id === user.id ? "default" : "ghost"}
            className="justify-start"
            onClick={() => onSelectUser(user)}
          >
            {user.role === 'admin' ? (
              <Users className="h-4 w-4 ml-2 text-primary" />
            ) : (
              <UserIcon className="h-4 w-4 ml-2" />
            )}
            <span className={!user.isActive ? "text-muted-foreground line-through" : ""}>
              {user.username}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
