import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RequireAdmin = () => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
        return <Navigate to="/auth?mode=login" replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default RequireAdmin;
