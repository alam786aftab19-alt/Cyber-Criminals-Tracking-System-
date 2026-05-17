import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-police-navy flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-police-saffron/20 border-t-police-saffron rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-sm tracking-wider">Verifying Secure Session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
