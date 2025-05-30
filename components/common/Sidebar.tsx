
import { 
  HomeIcon, 
  ReceiptIcon, 
  UtensilsCrossedIcon, 
  PackageIcon, 
  AreaChartIcon, 
  UsersIcon, 
  SettingsIcon, 
  LogOutIcon, 
  Menu 
} from 'lucide-react';
import { QueueListIcon } from '@/components/icons/QueueListIcon';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserRole, PERMISSIONS } from '@/types';

export function Sidebar({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const { currentUser, logout, hasPermission } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const nav = [
    {
      name: 'dashboard',
      path: '/',
      icon: HomeIcon,
      roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.KITCHEN],
      permission: null,
    },
    {
      name: 'cashier',
      path: '/cashier',
      icon: ReceiptIcon,
      roles: [UserRole.ADMIN, UserRole.CASHIER],
      permission: PERMISSIONS.CREATE_ORDERS,
    },
    {
      name: 'kitchen',
      path: '/kitchen',
      icon: UtensilsCrossedIcon,
      roles: [UserRole.ADMIN, UserRole.KITCHEN],
      permission: PERMISSIONS.KITCHEN_DISPLAY,
    },
    {
      name: 'products',
      path: '/products',
      icon: PackageIcon,
      roles: [UserRole.ADMIN],
      permission: PERMISSIONS.MANAGE_PRODUCTS,
    },
    {
      name: 'reports',
      path: '/reports',
      icon: AreaChartIcon,
      roles: [UserRole.ADMIN],
      permission: PERMISSIONS.VIEW_REPORTS,
    },
    {
      name: 'admin',
      path: '/admin',
      icon: UsersIcon,
      roles: [UserRole.ADMIN],
      permission: PERMISSIONS.MANAGE_USERS,
    },
    {
      name: 'settings',
      path: '/settings',
      icon: SettingsIcon,
      roles: [UserRole.ADMIN],
      permission: PERMISSIONS.ACCESS_SETTINGS,
    },
    {
      name: 'queue',
      path: '/queue',
      icon: QueueListIcon,
      roles: [UserRole.ADMIN, UserRole.CASHIER, UserRole.KITCHEN],
      isPublic: true,
      permission: null,
    },
  ];

  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    logout();
  };

  // Check if the user has permission to see a menu item
  const canAccessMenuItem = (item: any) => {
    // Public items or role-based access
    if (item.isPublic) return true;
    
    // Check role-based access
    const hasRole = currentUser && item.roles.includes(currentUser.role as UserRole);
    
    // Check permission-based access
    const hasRequiredPermission = !item.permission || hasPermission(item.permission);
    
    return hasRole && hasRequiredPermission;
  };

  return (
    <div className={cn("flex flex-col space-y-4 py-4 border-r bg-secondary text-secondary-foreground h-full", className)}>
      <div className="px-3 py-2">
        <Link to="/" className="hover:underline px-2">
          <h1 className="font-bold text-lg">
            مطعمي
          </h1>
        </Link>
      </div>
      <div className="flex-1 space-y-1">
        {nav.map((item) => (
          canAccessMenuItem(item) && (
            <Link key={item.name} to={item.path}>
              <Button
                variant={pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "justify-start w-full font-normal",
                  pathname === item.path ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {t(item.name)}
              </Button>
            </Link>
          )
        ))}
      </div>
      <Separator />
      <div className="px-3 py-2">
        {currentUser ? (
          <Button 
            variant="destructive" 
            className="justify-start w-full font-normal"
            onClick={handleLogout}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            {t('logout')}
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="ghost" className="justify-start font-normal">
              {t('login')}
            </Button>
          </Link>
        )}
      </div>
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-40 md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-10 w-64">
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
