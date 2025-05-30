import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { OrderProvider } from '@/context/OrderContext';
import { LanguageProvider } from '@/context/LanguageContext';
import Login from '@/pages/Login';
import Kitchen from '@/pages/Kitchen';
import CashierPage from '@/pages/cashier/CashierPage';
import Products from '@/pages/Products';
import Settings from '@/pages/Settings';
import Index from '@/pages/Index';
import Admin from '@/pages/Admin';
import CustomerQueue from '@/pages/CustomerQueue';
import Reports from '@/pages/Reports';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from 'sonner';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductProvider>
          <OrderProvider>
            <Router>
              <Toaster position="top-center" richColors />
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/kitchen" element={<ProtectedRoute><Kitchen /></ProtectedRoute>} />
                <Route path="/cashier" element={<ProtectedRoute><CashierPage /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/queue" element={<CustomerQueue />} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

                {/* Add a catch-all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </OrderProvider>
        </ProductProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;