import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * AdminAccessWrapper
 * @param {string} permission - The permission string required for subpage access (e.g. 'user_management')
 * @param {React.ReactNode} children - The content to render if access is granted
 * @returns {JSX.Element|null}
 */

// Define which roles have access to which permissions/subpages
const rolePermissions = {
  admin: ['*'], // admin can access all admin subpages
  'HR Lead': ['hiring_requests'], // HR Lead can access hiring requests and contact messages
  'team_lead': [], // Team Lead has no access by default
  'team_member': [], // Team Member has no access by default
  'staff': ['notices_management','blogs_management'], // Use permission keys, not tab ids
  'Blogger': ['blogs_management'], // Blogger can access blogs management
  // Add more roles and permissions as needed
};

const tabPermissions = {
  notices: 'notices_management',
  blogs: 'blogs_management',
  users: 'user_management',
  gallery: 'gallery_management',
  contact: 'contact_messages',
  hiring: 'hiring_requests',
  team: 'team_management',
  CoreTeamFeedback: 'core_team_feedback',
  CoreTeamFeedbackResponses: 'core_team_feedback_responses',
};

export function getAccessibleTabs(role) {
  const allowed = rolePermissions[role] || [];
  return Object.entries(tabPermissions)
    .filter(([tabId, perm]) =>
      allowed.includes('*') || allowed.includes(perm)
    )
    .map(([tabId]) => tabId);
}

const allowedRoles = Object.keys(rolePermissions);

const AdminAccessWrapper = ({ permission, children, emptyPanel = null }) => {
  const { user } = useAuth();
  const role = user?.role;
  const hasPanelAccess = allowedRoles.includes(role);
  const allowed = rolePermissions[role] || [];
  const hasSubpageAccess =
    allowed.includes('*') ||
    allowed.includes(permission);

  if (!hasPanelAccess) return null;
  if (!hasSubpageAccess) {
    return emptyPanel || (
      <div className="text-center text-gray-400 py-20">
        You do not have access to this admin section yet.
      </div>
    );
  }
  return children;
};

export default AdminAccessWrapper;
