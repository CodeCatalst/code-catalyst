import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminAccessWrapper
 * @param {string} permission - The permission string required for subpage access (e.g. 'user_management')
 * @param {React.ReactNode} children - The content to render if access is granted
 * @returns {JSX.Element|null}
 */


import { hasPermission } from '../../utils/adminAccess';
import AdminEsportsManager from './AdminEsportsManager';

const AdminAccessWrapper = ({ permission, children, emptyPanel = null }) => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];

  // Debug logging
  console.log('AdminAccessWrapper Debug:', {
    user: user,
    userRole: user?.role,
    userPermissions: userPermissions,
    requiredPermission: permission,
    hasUserPermissions: userPermissions.length > 0,
    hasRequiredPermission: hasPermission(userPermissions, permission)
  });

  // Additional debugging for esports permission issues
  if (permission === 'esports_management' || permission === 'esports') {
    console.log('=== ESPORTS PERMISSION DEBUG ===');
    console.log('User Role:', user?.role);
    console.log('User Permissions:', userPermissions);
    console.log('Required Permission:', permission);
    console.log('Has ESPORTS role:', user?.role === 'Esports' || user?.role === 'ESPORTS');
    console.log('Has admin role:', user?.role === 'admin' || user?.role === 'super_admin');
    console.log('Has required permission:', hasPermission(userPermissions, permission));
    console.log('=============================');
  }

  // Special case: if user has admin role, grant access to everything
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    console.log('AdminAccessWrapper: Admin/Super admin access granted');
    return children;
  }

  // Special case: if user has Esports role and permission is 'esports' or 'esports_management', grant access
  if ((user?.role === 'Esports' || user?.role === 'ESPORTS') && (permission === 'esports' || permission === 'esports_management')) {
    console.log('AdminAccessWrapper: Esports role access granted');
    return children;
  }

  if (!userPermissions.length) {
    console.log('AdminAccessWrapper: No user permissions found');
    return null;
  }
  if (!hasPermission(userPermissions, permission)) {
    console.log('AdminAccessWrapper: Required permission not found', {
      userPermissions,
      requiredPermission: permission
    });
    return emptyPanel || (
      <div className="text-center text-gray-400 py-20">
        <div>You do not have access to this admin section yet.</div>
        <div className="mt-4 p-4 bg-gray-700 rounded text-left text-sm">
          <div><strong>Debug Info:</strong></div>
          <div>User Role: {user?.role || 'No role'}</div>
          <div>User Permissions: {userPermissions.join(', ') || 'No permissions'}</div>
          <div>Required Permission: {permission}</div>
          <div>Has Permission: {hasPermission(userPermissions, permission) ? 'Yes' : 'No'}</div>
          <button
            onClick={() => {
              console.log('Full user object:', user);
              console.log('Full permissions array:', userPermissions);
            }}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            Log Full Debug Info
          </button>
        </div>
      </div>
    );
  }
  console.log('AdminAccessWrapper: Access granted via permissions');
  return children;
};

export default AdminAccessWrapper;
