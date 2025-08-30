import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../Common/LoadingSpinner'

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth()
    const location = useLocation()

    if (loading) {
        return <LoadingSpinner message="Verifying authentication..." />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check if user has an allowed admin role
    const allowedAdminRoles = ['admin', 'HR Lead', 'team_lead', 'team_member', 'staff'];
    if (!user?.role || !allowedAdminRoles.includes(user.role)) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute