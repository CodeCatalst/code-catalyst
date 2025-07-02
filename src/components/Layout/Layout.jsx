import { useState } from 'react'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children, transparentOnTop = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        transparentOnTop={transparentOnTop}
      />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout