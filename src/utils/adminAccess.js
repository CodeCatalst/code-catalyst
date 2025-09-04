// src/utils/adminAccess.js


// Map tab IDs to permission names (keep this for tab-permission mapping)
export const tabPermissions = {
  notices: 'notices_management',
  blogs: 'blogs_management',
  users: 'user_management',
  roles: 'roles_management',
  gallery: 'gallery_management',
  contact: 'contact_messages',
  hiring: 'hiring_requests',
  team: 'team_management', // Added for Manage Team tab
};

// Check if user has a specific permission
export function hasPermission(userPermissions, permission) {
  if (!Array.isArray(userPermissions)) return false;
  return userPermissions.includes(permission) || userPermissions.includes('*');
}

// Get accessible tabs for a user based on their permissions
export function getAccessibleTabs(userPermissions) {
  if (!Array.isArray(userPermissions)) return [];
  return Object.entries(tabPermissions)
    .filter(([tabId, perm]) =>
      userPermissions.includes('*') || userPermissions.includes(perm)
    )
    .map(([tabId]) => tabId);
}

