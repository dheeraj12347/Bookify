import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import CustomerSignup from './pages/CustomerSignup.jsx';
import CustomerLogin from './pages/CustomerLogin.jsx';
import OtpVerification from './pages/OtpVerification.jsx';
import VendorSignup from './pages/VendorSignup.jsx';
import VendorLogin from './pages/VendorLogin.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import VendorDashboard from './pages/VendorDashboard.jsx';
import BookingPage from './pages/BookingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BookingHistory from './pages/BookingHistory.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customer/signup" element={<CustomerSignup />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/verify-otp" element={<OtpVerification />} />
        <Route path="/vendor/signup" element={<VendorSignup />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/customer/dashboard"
          element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>}
        />
        <Route
          path="/book/:serviceId"
          element={<ProtectedRoute role="customer"><BookingPage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute role="customer"><BookingHistory /></ProtectedRoute>}
        />
        <Route
          path="/vendor/dashboard"
          element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
        />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
