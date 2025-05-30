
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission } from '../types';
import { setCurrentUser, getCurrentUser, clearCurrentUser, getUsers } from '../utils/storage';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permissionId: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  currentUser: null,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
  isAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check for stored user on component mount
    const user = getCurrentUser();
    if (user) {
      setUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check credentials against stored users
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password && u.isActive);
    
    if (user) {
      setUser(user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    try {
      // Clear all user state
      setUser(null);
      setIsAuthenticated(false);
      clearCurrentUser();
      
      // Show logout toast
      toast.success("تم تسجيل الخروج بنجاح");
      
      // Force a clean navigation to login page
      window.location.href = '/login';
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const hasPermission = (permissionId: string): boolean => {
    if (!currentUser) return false;
    
    // Admin has all permissions
    if (currentUser.role === 'admin') return true;
    
    // Check if the user has the specific permission
    return currentUser.permissions.some(p => p.id === permissionId && p.checked);
  };

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      login, 
      logout,
      hasPermission,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
