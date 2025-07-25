import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import store from './redax/store';
import AdminLayout from './Loyaut/Loyaut';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy loaded page components
const AddProductPage = React.lazy(() => import('./pages/AddProductPage'));
const OrderDetails = React.lazy(() => import('./pages/OrderDetails'));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage'));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage'));
const TagsPage = React.lazy(() => import('./pages/TagsPage'));
const UsersPage = React.lazy(() => import('./pages/UsersPage'));
const AdminsPage = React.lazy(() => import('./pages/AdminsPage'));
const RolesPage = React.lazy(() => import('./pages/RolesPage'));
const CouriersPage = React.lazy(() => import('./pages/CouriersPage'));
const AddCourierPage = React.lazy(() => import('./pages/AddCourierPage'));
const CouriersTrackPage = React.lazy(() => import('./pages/CouriersTrackPage'));
const CouriersStatsPage = React.lazy(() => import('./pages/CouriersStatsPage'));
const OrdersPage = React.lazy(() => import('./pages/OrdersPage'));
const OrderStatusPage = React.lazy(() => import('./pages/OrderStatusPage'));
const CancelledOrdersPage = React.lazy(() => import('./pages/CancelledOrdersPage'));
const StatisticsPage = React.lazy(() => import('./pages/StatisticsPage'));
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'));
const PaymentsPage = React.lazy(() => import('./pages/PaymentsPage'));
const PromotionsPage = React.lazy(() => import('./pages/PromotionsPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const UpdatesPage = React.lazy(() => import('./pages/UpdatesPage'));
const LogsPage = React.lazy(() => import('./pages/LogsPage'));
const SupportPage = React.lazy(() => import('./pages/SupportPage'));
const FaqPage = React.lazy(() => import('./pages/FaqPage'));

// Token yaroqliligini tekshirish funksiyasi
const checkTokenValidity = async (token) => {
  if (!token) {
    console.error('Token topilmadi');
    return false;
  }
  try {
    const response = await axios.get('https://hosilbek02.pythonanywhere.com/api/user/user-profiles/', {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Token tekshiruvi muvaffaqiyatli:', response.status);
    return true;
  } catch (err) {
    console.error('Token tekshirishda xato:', err.response?.status, err.response?.data);
    return false;
  }
};

// ProtectedRoute komponenti
const ProtectedRoute = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      console.log('Token tekshirilmoqda:', { token, isAuthenticated });
      if (isAuthenticated && token) {
        // localStorage bilan sinxronlashtirish
        localStorage.setItem('token', token);
        const valid = await checkTokenValidity(token);
        if (!valid) {
          console.log('Token yaroqsiz, logout amalga oshirilmoqda');
          dispatch({ type: 'auth/logout' });
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
        setIsValid(valid);
      } else {
        console.log('Token yoki autentifikatsiya yo‘q');
        localStorage.removeItem('token');
        setIsValid(false);
      }
    };

    verifyToken();

    // Axios interceptor for 401/403 errors
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('API xatosi:', error.response.status, error.response.data);
          dispatch({ type: 'auth/logout' });
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => axios.interceptors.response.eject(interceptor);
  }, [isAuthenticated, token, dispatch, navigate]);

  if (isValid === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isValid ? <Outlet /> : <Navigate to="/login" replace />;
};

// Route groups
const productRoutes = [
  { path: '/add-product', element: <AddProductPage /> },
  { path: '/products', element: <ProductsPage /> },
  { path: '/categories', element: <CategoriesPage /> },
  { path: '/tags', element: <TagsPage /> },
];

const userRoutes = [
  { path: '/users', element: <UsersPage /> },
  { path: '/admins', element: <AdminsPage /> },
  { path: '/roles', element: <RolesPage /> },
];

const courierRoutes = [
  { path: '/couriers', element: <CouriersPage /> },
  { path: '/add-courier', element: <AddCourierPage /> },
  { path: '/couriers-track', element: <CouriersTrackPage /> },
  { path: '/couriers-stats', element: <CouriersStatsPage /> },
];

const orderRoutes = [
  { path: '/orders', element: <OrdersPage /> },
  { path: '/order-status', element: <OrderStatusPage /> },
  { path: '/cancelled-orders', element: <CancelledOrdersPage /> },
];

const analyticsRoutes = [
  { path: '/statistics', element: <StatisticsPage /> },
  { path: '/reports', element: <ReportsPage /> },
  { path: '/payments', element: <PaymentsPage /> },
];

const contentRoutes = [
  { path: '/promotions', element: <PromotionsPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/messages', element: <MessagesPage /> },
];

const systemRoutes = [
  { path: '/settings', element: <SettingsPage /> },
  { path: '/updates', element: <UpdatesPage /> },
  { path: '/logs', element: <LogsPage /> },
];

const supportRoutes = [
  { path: '/support', element: <SupportPage /> },
  { path: '/faq', element: <FaqPage /> },
];

// Suspense fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <Router>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/"
                element={
                  <AdminLayout>
                    <Home />
                  </AdminLayout>
                }
              />
              <Route path="/order-details/:id" element={<OrderDetails />} />

              {/* Product Routes */}
              {productRoutes.map((route, index) => (
                <Route
                  key={`product-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* User Routes */}
              {userRoutes.map((route, index) => (
                <Route
                  key={`user-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* Courier Routes */}
              {courierRoutes.map((route, index) => (
                <Route
                  key={`courier-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* Order Routes */}
              {orderRoutes.map((route, index) => (
                <Route
                  key={`order-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* Analytics & Reports */}
              {analyticsRoutes.map((route, index) => (
                <Route
                  key={`analytics-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* Content Management */}
              {contentRoutes.map((route, index) => (
                <Route
                  key={`content-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* System Settings */}
              {systemRoutes.map((route, index) => (
                <Route
                  key={`system-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}

              {/* Customer Support */}
              {supportRoutes.map((route, index) => (
                <Route
                  key={`support-${index}`}
                  path={route.path}
                  element={
                    <AdminLayout>
                      {route.element}
                    </AdminLayout>
                  }
                />
              ))}
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<div>404 - Sahifa topilmadi</div>} />
          </Routes>
        </React.Suspense>
      </Router>
    </Provider>
  );
}

export default App;