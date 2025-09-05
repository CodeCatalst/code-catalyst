import { useState, useEffect } from 'react'
import { User, Mail, Lock, Camera, Save, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Show loading state while user data is being fetched
  if (authLoading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  // Profile form state
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profile_picture_url: user?.profile_picture_url || ''
  })

  // Sync profileData with user context on user change
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profile_picture_url: user.profile_picture_url || ''
      });
      console.log('User data loaded:', user); // For debugging
    }
  }, [user])

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // For image preview
  const [selectedImage, setSelectedImage] = useState(null)

  const isAdmin = user?.role === 'admin' || user?.roles?.includes?.('admin')

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'picture', label: 'Profile Picture', icon: Camera },
  ]
  // Add admin tab if user is admin
  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin Menu', icon: Shield })
  }

  // Handle profile info update
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess('')

    try {
      console.log('Submitting profile data:', profileData); // Debug log
      const result = await updateProfile({
        full_name: profileData.full_name,
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio
      });

      if (result.success) {
        setSuccess('Profile updated successfully!')
        console.log('Profile updated successfully'); // Debug log
        setTimeout(() => setSuccess(''), 3000)
      } else {
        console.error('Profile update failed:', result.error); // Debug log
        setErrors({ submit: result.error })
      }
    } catch (error) {
      console.error('Profile update error:', error); // Debug log
      setErrors({ submit: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Handle password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setLoading(true)
    setErrors({})
    setSuccess('')
    try {
      const result = await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      if (result.success) {
        setSuccess('Password updated successfully!')
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update password. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Handle profile picture update
  const handlePictureSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess('')
    try {
      const result = await updateProfile({ profile_picture_url: profileData.profile_picture_url })
      if (result.success) {
        setSuccess('Profile picture updated!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update profile picture. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Password Reset Prompt
  const [resetPrompt, setResetPrompt] = useState('');
  const { forgotPassword } = useAuth();

  const handlePasswordReset = async () => {
    setLoading(true);
    setResetPrompt('');
    try {
      const result = await forgotPassword(user.email);
      if (result.success) {
        setResetPrompt('Password reset email sent! Please check your inbox.');
      } else {
        setResetPrompt(result.error || 'Failed to send reset email.');
      }
    } catch (error) {
      setResetPrompt('Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result)
        setProfileData(prev => ({ ...prev, profile_picture_url: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-900">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
              <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-800 font-medium">{errors.submit}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="card">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          value={profileData.full_name}
                          onChange={handleProfileChange}
                          className="input-field"
                          placeholder="Enter your full name"
                        />
                        </div>

                        <div>
                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={profileData.username}
                            onChange={handleProfileChange}
                            className="input-field"
                            placeholder="Choose a username"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="input-field"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          className="input-field resize-none"
                          placeholder="Tell us about yourself..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Save size={20} />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>
                    <button
                      type="button"
                      className="mb-4 btn-secondary"
                      onClick={handlePasswordReset}
                      disabled={loading}
                    >
                      Send Password Reset Email
                    </button>
                    {resetPrompt && (
                      <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${resetPrompt.includes('sent') ? 'bg-green-900/50 border border-green-700 text-green-300' : 'bg-red-900/50 border border-red-700 text-red-300'}`}>
                        {resetPrompt.includes('sent') ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                        {resetPrompt}
                      </div>
                    )}
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className={`input-field ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="Enter your current password"
                        />
                        {errors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`input-field ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="Enter your new password"
                        />
                        {errors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`input-field ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="Confirm your new password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={20} />
                            <span>Update Password</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Profile Picture Tab */}
                {activeTab === 'picture' && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Profile Picture</h2>
                    <form onSubmit={handlePictureSubmit} className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div>
                          <img
                            src={selectedImage || profileData.profile_picture_url || '/default-avatar.png'}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-primary-600"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <Camera size={20} />
                            <span>Update Picture</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Admin Menu Tab */}
                {activeTab === 'admin' && isAdmin && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                      <Shield className="text-primary-600" size={24} />   <a href="/admin" className="btn-primary">Admin Dashboard</a>
                    </h2>
                   
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile