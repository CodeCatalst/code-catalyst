import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/Layout/ScrollToTop'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminRoute from './components/Auth/AdminRoute'
import { NoticesProvider } from './context/NoticesContext'
import { BlogsProvider } from './context/NoticesContext'

// Lazy load pages for better performance
import { lazy, Suspense } from 'react'
import Loader from './components/Common/LoadingSpinner'

const Home = lazy(() => import('./pages/Home/Home'))
const About = lazy(() => import('./pages/About/About'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const Hiring = lazy(() => import('./pages/Hiring/Hiring'))
const Gallery = lazy(() => import('./pages/Gallery/Gallery'))
const Team = lazy(() => import('./pages/Team/Team'))
const Blog = lazy(() => import('./pages/Blog/Blog'))
const BlogDetails = lazy(() => import('./pages/Blog/BlogDetails'))
const Notices = lazy(() => import('./pages/Notices/Notices'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Signup = lazy(() => import('./pages/Auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Test = lazy(() => import('./Test'))

const HERO_ROUTES = [
  '/',
  '/about',
  '/gallery',
  '/team',
  '/hiring',
  '/blog',
  '/notices',
  '/test',
]

function App() {
  const location = useLocation()
  const transparentOnTop = HERO_ROUTES.includes(location.pathname)

  return (
    <NoticesProvider>
      <BlogsProvider>
        <AuthProvider>
          <ScrollToTop />
          <Layout transparentOnTop={transparentOnTop}>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/hiring" element={<Hiring />} />
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<Test />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </BlogsProvider>
    </NoticesProvider>
  )
}

export default App