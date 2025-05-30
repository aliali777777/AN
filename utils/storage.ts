import { User, Product, Order, UserRole, Settings, PERMISSIONS, Permission } from '../types';

// Default admin user
const DEFAULT_ADMIN: User = {
  id: '1',
  username: 'admin',
  password: 'admin',
  role: UserRole.ADMIN,
  permissions: Object.values(PERMISSIONS).map(id => ({ 
    id, 
    name: id,
    description: `Permission to ${id.replace(/_/g, ' ')}`,
    checked: true 
  })),
  isActive: true,
};

// Default settings
const DEFAULT_SETTINGS: Settings = {
  language: 'ar',
  currencySymbol: '$',
  businessName: 'مطعمي',
  businessAddress: 'شارع الرئيسي, المدينة',
  businessPhone: '+123456789',
  autoPrintReceipt: true,
  autoKitchenPrint: true,
  receiptWidth: 80,
  showLogo: true,
  taxRate: 0,
  receiptFooter: 'شكراً لزيارتكم',
  allowOrderModification: true,
  requireAdminForVoid: true,
  requireAdminForDiscount: true,
  showPriceOnKitchenDisplay: false,
};

// Initialize storage with default data
export const initStorage = () => {
  if (!getUsers().length) {
    setUsers([DEFAULT_ADMIN]);
  }
  
  if (!getProducts().length) {
    setProducts([
      {
        id: '1',
        name: 'Hamburger',
        nameAr: 'برجر لحم',
        category: 'Burgers',
        price: 8.99,
        cost: 3.50,
        isAvailable: true,
        imageUrl: '/placeholder.svg'
      },
      {
        id: '2',
        name: 'Cheeseburger',
        nameAr: 'برجر جبنة',
        category: 'Burgers',
        price: 9.99,
        cost: 4.00,
        isAvailable: true,
        imageUrl: '/placeholder.svg'
      },
      {
        id: '3',
        name: 'French Fries',
        nameAr: 'بطاطا مقلية',
        category: 'Sides',
        price: 3.99,
        cost: 1.20,
        isAvailable: true,
        imageUrl: '/placeholder.svg'
      },
      {
        id: '4',
        name: 'Cola',
        nameAr: 'كولا',
        category: 'Drinks',
        price: 2.49,
        cost: 0.80,
        isAvailable: true,
        imageUrl: '/placeholder.svg'
      },
      {
        id: '5',
        name: 'Water',
        nameAr: 'مياه',
        category: 'Drinks',
        price: 1.99,
        cost: 0.30,
        isAvailable: true,
        imageUrl: '/placeholder.svg'
      },
    ]);
  }
  
  // Initialize settings
  if (!localStorage.getItem('settings')) {
    updateSettings(DEFAULT_SETTINGS);
  }
};

// User related storage functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const setUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  
  if (index !== -1) {
    users[index] = updatedUser;
    setUsers(users);
  }
};

export const deleteUser = (id: string): void => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  setUsers(filteredUsers);
};

export const getCurrentUser = (): User | null => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? JSON.parse(currentUser) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Product related storage functions
export const getProducts = (): Product[] => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : [];
};

export const setProducts = (products: Product[]): void => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const addProduct = (product: Product): void => {
  const products = getProducts();
  products.push(product);
  setProducts(products);
};

export const updateProduct = (updatedProduct: Product): void => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  
  if (index !== -1) {
    products[index] = updatedProduct;
    setProducts(products);
  }
};

export const deleteProduct = (id: string): void => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  setProducts(filteredProducts);
};

// Order related storage functions
export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const setOrders = (orders: Order[]): void => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const addOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  setOrders(orders);
};

export const updateOrder = (updatedOrder: Order): void => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === updatedOrder.id);
  
  if (index !== -1) {
    orders[index] = updatedOrder;
    setOrders(orders);
  }
};

export const deleteOrder = (id: string): void => {
  const orders = getOrders();
  const filteredOrders = orders.filter(order => order.id !== id);
  setOrders(filteredOrders);
};

export const generateOrderNumber = (): string => {
  const today = new Date();
  const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
  
  const orders = getOrders();
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });
  
  const orderCount = todayOrders.length + 1;
  return `${dateStr}-${orderCount.toString().padStart(3, '0')}`;
};

// Settings related storage functions
export const getSettings = (): Settings => {
  const settings = localStorage.getItem('settings');
  return settings ? JSON.parse(settings) : DEFAULT_SETTINGS;
};

export const updateSettings = (settings: Settings): void => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

// Clear all data (for testing purposes)
export const clearAllData = (): void => {
  localStorage.removeItem('users');
  localStorage.removeItem('products');
  localStorage.removeItem('orders');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('settings');
};
