import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import CommentsPage from '../pages/CommentsPage';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRouter: React.FC = () => {
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
