import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

const ProtectedRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAuth();
 
   return (loading)? 
    <div>
      <img src="KS Logo.png" alt='KeyScribe' height="200"></img>
      <p>Loading...</p>
    </div> :
   (isAuthenticated) ? (children) : (<Navigate to="/login" replace />);
 };

export default ProtectedRoute;
