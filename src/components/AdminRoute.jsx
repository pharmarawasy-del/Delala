import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '../utils/admin';

export default function AdminRoute({ user, children }) {
    if (!isAdmin(user)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
