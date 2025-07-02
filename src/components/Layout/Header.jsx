import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
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

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Team', href: '/team' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Notices', href: '/notices' },
    { name: 'Contact', href: '/contact' },
  ];

  // Add admin link if user is admin
  const adminLinks = user?.role === 'admin' ? [
    { name: 'Admin', href: '/admin' }
  ] : [];

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
            <div className="w-24 h-24 rounded-lg">
              <img src={'/logo_transparent.png'} alt="Code Catalyst" className="w-24 h-24" />
            </div>
            {/* <p className="font-bold text-xl text-teal-400 hidden sm:block ml-2">
              <span className="text-purple-600">Code</span> Catalyst
            </p> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {[...navigationLinks, ...adminLinks].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium transition-colors duration-200 hover:text-primary-600 ${location.pathname === link.href
                  ? 'text-primary-600'
                  : 'text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                  <span className={`font-medium ${scrolled ? 'text-white' : 'text-white'}`}>
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
                  className={`font-medium hover:text-primary-600 transition-colors text-white`}
                >
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Join Us
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X size={24} className={isAuthPage ? 'text-white' : scrolled ? 'text-white' : 'text-white'} />
            ) : (
              <Menu size={24} className={isAuthPage ? 'text-white' : scrolled ? 'text-white' : 'text-white'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden card p-0 shadow-lg rounded-b-2xl mx-4 mb-4">
            <div className="px-4 py-6 space-y-4">
              {[...navigationLinks, ...adminLinks].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block font-medium py-2 hover:text-primary-600 transition-colors ${location.pathname === link.href ? 'text-primary-600' : 'text-white'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t pt-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 py-2 text-white hover:text-primary-600 transition-colors"
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
                      className="flex items-center space-x-2 py-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block py-2 text-white hover:text-primary-600 transition-colors"
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
                  </>
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