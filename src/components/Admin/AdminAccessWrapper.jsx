import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminAccessWrapper
 * @param {string} permission - The permission string required for subpage access (e.g. 'user_management')
 * @param {React.ReactNode} children - The content to render if access is granted
 * @returns {JSX.Element|null}
 */


import { hasPermission } from '../../utils/adminAccess';

const AdminAccessWrapper = ({ permission, children, emptyPanel = null }) => {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];
  if (!userPermissions.length) return null;
  if (!hasPermission(userPermissions, permission)) {
    return emptyPanel || (
      <div className="text-center text-gray-400 py-20">
        You do not have access to this admin section yet.
      </div>
    );
  }
  return children;
};

export default AdminAccessWrapper;
