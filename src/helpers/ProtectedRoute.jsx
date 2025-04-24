import React from 'react';
import { Navigate } from 'react-router-dom';
import { AUTHENTICATION_TOKEN, DOCTOR_INFO } from './constants/StaticKeys';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem(AUTHENTICATION_TOKEN);
  const adminInfo = localStorage.getItem('ADMIN_INFO');
  const doctorInfo = localStorage.getItem(DOCTOR_INFO);

  // First check if user is authenticated at all
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Parse admin and doctor info
  const isAdmin = adminInfo ? JSON.parse(adminInfo)?.isAdmin : false;
  const isDoctor = !!doctorInfo;

  // Admin route protection
  if (requireAdmin) {
    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // Doctor route protection (non-admin routes)
  if (!requireAdmin) {
    if (isAdmin) {
      return <Navigate to="/admin" replace />;
    }
    if (!isDoctor) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return children;
};

export default ProtectedRoute;