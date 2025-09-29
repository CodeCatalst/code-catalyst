import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      // Verify token and get user data
      console.log('AuthContext: Fetching user data with token:', token.substring(0, 20) + '...');
      api.get('/auth/me')
        .then(response => {
          console.log('AuthContext: User data received:', response.data.user);
          setUser(response.data.user)
        })
        .catch((error) => {
          console.error('AuthContext: Failed to fetch user data:', error.response?.data || error);
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      console.log('AuthContext: No token found');
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token: newToken, user: userData } = response.data

      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData)
      const { token: newToken, user: newUser } = response.data

      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(newUser)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed'
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const forgotPassword = async (email) => {
    try {
      await api.post('/auth/forgot-password', { email })
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send reset email'
      }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      let response;
      
      // Handle password update separately
      if (profileData.currentPassword && profileData.newPassword) {
        response = await api.put('/auth/password', {
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        });
      } else {
        // Handle profile update
        const updateData = {};
        
        // Only include fields that are actually provided
        if (profileData.full_name !== undefined) updateData.full_name = profileData.full_name;
        if (profileData.username !== undefined) updateData.username = profileData.username;
        if (profileData.email !== undefined) updateData.email = profileData.email;
        if (profileData.bio !== undefined) updateData.bio = profileData.bio;
        if (profileData.profile_picture_url !== undefined) updateData.profile_picture_url = profileData.profile_picture_url;
        
        console.log('Updating profile with data:', updateData); // Debug log
        
        response = await api.put('/auth/profile', updateData);
        
        if (response.data.user) {
          console.log('Received updated user data:', response.data.user); // Debug log
          setUser(response.data.user);
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error.response?.data || error); // Debug log
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          (error.response?.data?.details ? `Profile update failed: ${error.response.data.details}` : 'Profile update failed');
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    forgotPassword,
    updateProfile,
    // Debug function to check user permissions
    debugUser: () => {
      console.log('=== AUTH DEBUG INFO ===');
      console.log('Token:', token ? token.substring(0, 20) + '...' : 'No token');
      console.log('User:', user);
      console.log('User Role:', user?.role);
      console.log('User Permissions:', user?.permissions);
      console.log('Is Authenticated:', !!user);
      console.log('======================');
      return user;
    },
    // Force refresh user data
    refreshUser: async () => {
      if (token) {
        try {
          console.log('Forcing user data refresh...');
          const response = await api.get('/auth/me');
          console.log('Refreshed user data:', response.data.user);
          setUser(response.data.user);
          return response.data.user;
        } catch (error) {
          console.error('Failed to refresh user data:', error);
          throw error;
        }
      }
    },
    // Check current token
    checkToken: () => {
      const currentToken = localStorage.getItem('token');
      console.log('=== TOKEN DEBUG INFO ===');
      console.log('Token present:', !!currentToken);
      console.log('Token length:', currentToken ? currentToken.length : 0);
      console.log('Token preview:', currentToken ? currentToken.substring(0, 50) + '...' : 'No token');
      console.log('Token structure valid:', currentToken ? currentToken.split('.').length === 3 : false);
      console.log('======================');
      return {
        present: !!currentToken,
        length: currentToken ? currentToken.length : 0,
        preview: currentToken ? currentToken.substring(0, 20) + '...' : 'No token',
        isValidFormat: currentToken ? currentToken.split('.').length === 3 : false
      };
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}