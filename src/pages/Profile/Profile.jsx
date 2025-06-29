import { useState } from 'react'
import { User, Mail, Lock, Camera, Save, AlertCircle, CheckCircle, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState({})

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess('')

    try {
      const result = await updateProfile(profileData)

      if (result.success) {
        setSuccess('Profile updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setErrors({ submit: result.error })
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update profile. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    // Validate password form
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

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="section-padding">
        <div className="container-max max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
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
                        : 'bg-white text-gray-700 hover:bg-gray-50'
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={profileData.name}
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Picture</h2>

                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                          {profileData.profilePicture ? (
                            <img
                              src={profileData.profilePicture}
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-white font-bold text-2xl">
                              {user?.name?.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {user?.name}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            Upload a new profile picture to personalize your account
                          </p>
                          <div className="flex space-x-3">
                            <button className="btn-primary flex items-center space-x-2">
                              <Camera size={20} />
                              <span>Upload New Picture</span>
                            </button>
                            <button className="btn-secondary">
                              Remove Picture
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium text-gray-900 mb-2">Guidelines</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Image should be at least 200x200 pixels</li>
                          <li>• Accepted formats: JPG, PNG, GIF</li>
                          <li>• Maximum file size: 5MB</li>
                          <li>• Square images work best</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Admin Menu Tab */}
                {activeTab === 'admin' && isAdmin && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Shield className="text-primary-600" size={24} /> Admin Menu
                    </h2>
                    <ul className="space-y-4">
                      <li>
                        <a href="/admin/dashboard" className="btn-primary">Admin Dashboard</a>
                      </li>
                      <li>
                        <a href="/admin/users" className="btn-secondary">User Management</a>
                      </li>
                      <li>
                        <a href="/admin/forms" className="btn-secondary">Form Manager</a>
                      </li>
                      <li>
                        <a href="/admin/submissions" className="btn-secondary">Submissions Viewer</a>
                      </li>
                    </ul>
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