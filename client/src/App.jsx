import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ScanReceipt from './pages/ScanReceipt';
import ReviewItems from './pages/ReviewItems';
import AssignPeople from './pages/AssignPeople';
import SplitResult from './pages/SplitResult';
import WhoPaid from './pages/WhoPaid';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan-receipt"
          element={
            <ProtectedRoute>
              <ScanReceipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review-items"
          element={
            <ProtectedRoute>
              <ReviewItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assign-people"
          element={
            <ProtectedRoute>
              <AssignPeople />
            </ProtectedRoute>
          }
        />
        <Route
          path="/who-paid"
          element={
            <ProtectedRoute>
              <WhoPaid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/split-result"
          element={
            <ProtectedRoute>
              <SplitResult />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;