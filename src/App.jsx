import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './Loyaut/Loyaut';
import Home from './pages/Home';

// Product Pages
import AddProductPage from './pages/AddProductPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import TagsPage from './pages/TagsPage';

// User Pages
import UsersPage from './pages/UsersPage';
import AdminsPage from './pages/AdminsPage';
import RolesPage from './pages/RolesPage';

// Courier Pages
import CouriersPage from './pages/CouriersPage';
import AddCourierPage from './pages/AddCourierPage';
import CouriersTrackPage from './pages/CouriersTrackPage';
import CouriersStatsPage from './pages/CouriersStatsPage';

// Order Pages
import OrdersPage from './pages/OrdersPage';
import OrderStatusPage from './pages/OrderStatusPage';
import CancelledOrdersPage from './pages/CancelledOrdersPage';

// Analytics & Reports
import StatisticsPage from './pages/StatisticsPage';
import ReportsPage from './pages/ReportsPage';
import PaymentsPage from './pages/PaymentsPage';

// Content Management
import PromotionsPage from './pages/PromotionsPage';
import BlogPage from './pages/BlogPage';
import MessagesPage from './pages/MessagesPage';

// System Settings
import SettingsPage from './pages/SettingsPage';
import UpdatesPage from './pages/UpdatesPage';
import LogsPage from './pages/LogsPage';

// Customer Support
import SupportPage from './pages/SupportPage';
import FaqPage from './pages/FaqPage';

function App() {
  return (
    <Router>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Product Routes */}
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/tags" element={<TagsPage />} />

          {/* User Routes */}
          <Route path="/users" element={<UsersPage />} />
          <Route path="/admins" element={<AdminsPage />} />
          <Route path="/roles" element={<RolesPage />} />

          {/* Courier Routes */}
          <Route path="/couriers" element={<CouriersPage />} />
          <Route path="/add-courier" element={<AddCourierPage />} />
          <Route path="/couriers-track" element={<CouriersTrackPage />} />
          <Route path="/couriers-stats" element={<CouriersStatsPage />} />

          {/* Order Routes */}
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/order-status" element={<OrderStatusPage />} />
          <Route path="/cancelled-orders" element={<CancelledOrdersPage />} />

          {/* Analytics & Reports */}
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />

          {/* Content Management */}
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/messages" element={<MessagesPage />} />

          {/* System Settings */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/logs" element={<LogsPage />} />

          {/* Customer Support */}
          <Route path="/support" element={<SupportPage />} />
          <Route path="/faq" element={<FaqPage />} />
        </Routes>
      </AdminLayout>
    </Router>
  );
}

export default App;
