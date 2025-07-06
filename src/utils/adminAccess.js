// src/utils/adminAccess.js

export const rolePermissions = {
  admin: ['hiring_requests'], // admin can only access hiring requests
  'HR Lead': ['hiring_requests'],
  'team_lead': [],
  'team_member': [],
};

export const tabPermissions = {
  notices: 'notices_management',
  blogs: 'blogs_management',
  users: 'user_management',
  gallery: 'gallery_management',
  contact: 'contact_messages',
  hiring: 'hiring_requests',
};

export function getAccessibleTabs(role) {
  const allowed = rolePermissions[role] || [];
  return Object.entries(tabPermissions)
    .filter(([tabId, perm]) =>
      allowed.includes('*') || allowed.includes(perm)
    )
    .map(([tabId]) => tabId);
}
