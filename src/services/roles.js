import api from './apiBase';

export const getRoles = async () => {
  try {
    const response = await api.get('/roles');
    return response.data.roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

export const createRole = async (data) => {
  try {
    const response = await api.post('/roles', data);
    return response.data.role;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

export const updateRole = async (id, data) => {
  try {
    const response = await api.put(`/roles/${id}`, data);
    return response.data.role;
  } catch (error) {
    console.error('Error updating role:', error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
};

export const getPermissions = async () => {
  try {
    const response = await api.get('/permissions');
    return response.data.permissions;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

export const getRolePermissions = async (roleId) => {
  try {
    const response = await api.get(`/roles/${roleId}/permissions`);
    return response.data.permissions;
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    throw error;
  }
};

export const createPermission = async (data) => {
  try {
    const response = await api.post('/permissions', data);
    return response.data.permission;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

export const deletePermission = async (id) => {
  try {
    const response = await api.delete(`/permissions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting permission:', error);
    throw error;
  }
};

export const assignPermissionToRole = async (roleId, permissionId) => {
  try {
    const response = await api.post(`/roles/${roleId}/permissions`, { permissionId });
    return response.data;
  } catch (error) {
    console.error('Error assigning permission to role:', error);
    throw error;
  }
};

export const removePermissionFromRole = async (roleId, permissionId) => {
  try {
    const response = await api.delete(`/roles/${roleId}/permissions/${permissionId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing permission from role:', error);
    throw error;
  }
};
