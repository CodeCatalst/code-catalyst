import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { hasPermission } from '../../utils/adminAccess';

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [updatesOpen, setUpdatesOpen] = useState(false)
  const [mobileUpdatesOpen, setMobileUpdatesOpen] = useState(false)
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()

  // Determine if current page is login or signup
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open and close on Escape
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
        setUpdatesOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen, setMobileMenuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (updatesOpen && !e.target.closest('#updates-dropdown-container')) {
        setUpdatesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [updatesOpen])

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Projects', href: '/projects' },
    { name: 'Innovation', href: '/innovation' },
    { name: 'Open Source', href: '/opensource' },
    { name: 'Contact', href: '/contact' },
    // { name: 'Hiring', href: '/hiring' },
    { name: 'Esports', href: '/esports' }
  ];

  // Add admin link if user has any admin permission
  const adminPermissions = [
    'notices_management',
    'blogs_management',
    'user_management',
    'roles_management',
    'gallery_management',
    'contact_messages',
    'hiring_requests',
    'team_management',
    'core_team_feedback',
    'core_team_feedback_responses',
    'esports',
    '*'
  ];
  const userPermissions = user?.permissions || [];
  const userRoles = user?.roles || [];
  const hasAdminAccess = adminPermissions.some(perm => userPermissions.includes(perm));
  
  const adminLinks = hasAdminAccess
    ? [{ name: 'Admin', href: '/admin' }]
    : [];

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900 bg-opacity-60 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
      <nav className="container-max">
        <div className="flex justify-between items-center h-17 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex flex-row items-center">
            <div className="w-20 h-20 rounded-lg">
              <img src={'/logo_transparent.png'} alt="Code Catalyst" className="w-20 h-20" />
            </div>
            {/* <p className="font-bold text-xl text-teal-400 hidden sm:block ml-2">
              <span className="text-purple-600">Code</span> Catalyst
            </p> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {[...navigationLinks, ...adminLinks].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-medium whitespace-nowrap transition-colors duration-200 hover:text-primary-600 ${location.pathname === link.href
                  ? 'text-primary-600'
                  : 'text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Updates dropdown */}
            <div className="relative" id="updates-dropdown-container">
              <button
                onClick={() => setUpdatesOpen(!updatesOpen)}
                aria-expanded={updatesOpen}
                aria-controls="updates-menu"
                className={`font-medium transition-colors duration-200 hover:text-primary-600 ${updatesOpen ? 'text-primary-600' : 'text-white'}`}
              >
                <span className="inline-flex items-center gap-2">
                  Updates
                  <ChevronDown 
                    size={14} 
                    className={`transition-transform duration-300 ${updatesOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </span>
              </button>

              {updatesOpen && (
                <div 
                  id="updates-menu" 
                  className="absolute right-0 mt-1 w-48 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-2xl ring-1 ring-purple-500/30 z-50 animate-dropdown overflow-hidden backdrop-blur-sm"
                >
                  <Link 
                    to="/gallery" 
                    className="block px-4 py-3 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-t-lg transition-all duration-300 border-b border-gray-700/50 group" 
                    onClick={() => setUpdatesOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:scale-150 transition-transform"></span>
                      Event Gallery
                    </span>
                  </Link>
                  <Link 
                    to="/blog" 
                    className="block px-4 py-3 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 border-b border-gray-700/50 group" 
                    onClick={() => setUpdatesOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-150 transition-transform"></span>
                      Blog
                    </span>
                  </Link>
                  <Link 
                    to="/notices" 
                    className="block px-4 py-3 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-orange-500/20 rounded-b-lg transition-all duration-300 group" 
                    onClick={() => setUpdatesOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 group-hover:scale-150 transition-transform"></span>
                      Notices
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  {user?.profile_picture_url ? (
                    <img
                      src={user.profile_picture_url}
                      alt={user.full_name || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-600"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span
                    className={`font-medium text-white max-w-[140px] whitespace-nowrap overflow-hidden text-ellipsis`}
                  >
                    {user?.full_name}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className={`font-medium whitespace-nowrap hover:text-primary-600 transition-colors text-white`}
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary whitespace-nowrap">
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className={isAuthPage ? 'text-white' : scrolled ? 'text-white' : 'text-white'} />
            ) : (
              <Menu size={24} className={isAuthPage ? 'text-white' : scrolled ? 'text-white' : 'text-white'} />
            )}
            <span className="sr-only">Toggle navigation</span>
          </button>
        </div>

        {/* Mobile Menu - fixed overlay for better UX on small screens */}
        {mobileMenuOpen && (
          <div className="lg:hidden card p-0 shadow-lg rounded-b-2xl mx-4 mb-4">
            <div className="px-4 py-6 space-y-4">
              {[...navigationLinks, ...adminLinks].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block font-medium py-2 hover:text-primary-600 transition-colors ${location.pathname === link.href ? 'text-primary-600' : 'text-white'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Updates collapsible */}
              <div className="mt-2">
                <button
                  onClick={() => setMobileUpdatesOpen(!mobileUpdatesOpen)}
                  className="w-full flex items-center justify-between text-lg font-medium py-3 px-2 rounded-md hover:bg-white/5"
                  aria-expanded={mobileUpdatesOpen}
                  aria-controls="mobile-updates"
                >
                  <span className="text-white">Updates</span>
                  {mobileUpdatesOpen ? <ChevronUp size={18} className="text-white" /> : <ChevronDown size={18} className="text-white" />}
                </button>

                {mobileUpdatesOpen && (
                  <div id="mobile-updates" className="pl-4 mt-2 space-y-2">
                    <Link to="/gallery" className="block py-2 text-white hover:text-primary-400" onClick={() => setMobileMenuOpen(false)}>Event Gallery</Link>
                    <Link to="/blog" className="block py-2 text-white hover:text-primary-400" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
                    <Link to="/notices" className="block py-2 text-white hover:text-primary-400" onClick={() => setMobileMenuOpen(false)}>Notices</Link>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 mt-6 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 py-2 text-white hover:text-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Profile ({user?.full_name})</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 py-2 text-red-500 hover:text-red-600"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block py-3 text-white hover:text-primary-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary block text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Join Us
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header