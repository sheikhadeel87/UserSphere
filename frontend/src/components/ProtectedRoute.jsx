import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) return <div style={{ padding: 48, textAlign: 'center' }}>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    
    return children;
  }
  
  export default ProtectedRoute;