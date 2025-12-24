import React, { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import ProtectedRoute from '../components/ProtectedRoute';
import { getCurrentUser } from '../features/auth/authSlice';
import CommentsPage from '../pages/CommentsPage';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRouter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Try to get current user if token exists
    if (token && !isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [token, isAuthenticated, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/comments"
          element={
            <ProtectedRoute>
              <CommentsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/comments" replace />} />
        <Route path="*" element={<Navigate to="/comments" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
