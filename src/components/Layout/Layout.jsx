import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { Toaster } from '../Common/Toaster'

const Layout = ({ children, transparentOnTop = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  // Hide header and footer on admin pages
  const isAdminPage = location.pathname.startsWith('/admin')
  const isSocialsPage = location.pathname === '/socials'
  const isDanceSocietyPage = location.pathname === '/dance-society/register'

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminPage && !isSocialsPage && !isDanceSocietyPage && (
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          transparentOnTop={transparentOnTop}
        />
      )}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminPage && !isSocialsPage && !isDanceSocietyPage && <Footer />}
      <Toaster />
    </div>
  )
}

export default Layout