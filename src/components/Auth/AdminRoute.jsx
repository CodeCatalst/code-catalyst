import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../Common/LoadingSpinner'
import { hasPermission, tabPermissions } from '../../utils/adminAccess'

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth()
    const location = useLocation()

    if (loading) {
        return <LoadingSpinner message="Verifying authentication..." />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    // Check if user has access to any admin section
    const allowedAdminRoles = ['admin', 'super_admin', 'HR Lead', 'team_lead', 'team_member', 'staff', 'Blogger', 'Esports'];
    const userPerms = user?.permissions || [];
    const anyAdminPermission = Array.isArray(userPerms) && Object.values(tabPermissions).some(p => hasPermission(userPerms, p));
    const isAllowedRole = !!user?.role && allowedAdminRoles.includes(user.role);

    if (!anyAdminPermission && !isAllowedRole) {
      return <Navigate to="/" replace />;
    }

    return children
}

export default AdminRoute