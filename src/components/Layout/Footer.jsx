import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Github, Instagram, Linkedin } from 'lucide-react'
import DiscordIcon from './DiscordIcon'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Github, href: 'https://github.com/codecatalyst', label: 'GitHub' },
    { icon: DiscordIcon, href: 'https://discord.gg/uW3BthhwDU', label: 'Discord' },
    { icon: Instagram, href: 'https://www.instagram.com/codecatalyst.jb', label: 'Instagram' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/codecatalystt/', label: 'LinkedIn' },
  ]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Events', href: '/gallery' },
    { name: 'Notices', href: '/notices' },
  ]

  const contactInfo = [
    { icon: Mail, text: 'Admin: code@jbcollege.in', href: 'mailto:code@jbcollege.in' },
    { icon: Mail, text: 'CC: codecatalyst@gmail.com', href: 'mailto:codecatalyst@gmail.com' },
    // { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: 'JB Knowledge Park, Manjhawali, Faridabad NCR -121 102 Nearest Metro Station: Badarpur Delhi', href: '#' },
  ]

  return (
    <footer className="relative bg-gray-900 text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10  rounded-lg flex items-center justify-center">
                <img src="/logo_transparent.png" alt="" />
              </div>
              <span className="font-bold text-xl">Code Catalyst</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Empowering students through technology, innovation, and collaboration. 
              Join us in shaping the future of tech education.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact Info</h3>
            <ul className="space-y-3">
              {contactInfo.map((contact, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <contact.icon size={18} className="text-primary-400 flex-shrink-0" />
                  {contact.href !== '#' ? (
                    <a
                      href={contact.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {contact.text}
                    </a>
                  ) : (
                    <span className="text-gray-300">{contact.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          {/* <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-300">
              Subscribe to get the latest news and updates from Code Catalyst.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              <button className="w-full btn-primary">
                Subscribe
              </button>
            </div>
          </div> */}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-300 text-center md:text-left">
            © {currentYear} Code Catalyst. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
           
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer