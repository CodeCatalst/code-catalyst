import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

// Lazy load pages for better performance
import { lazy, Suspense } from 'react'
import Loader from './components/Common/LoadingSpinner'

const Home = lazy(() => import('./pages/Home/Home'))
const About = lazy(() => import('./pages/About/About'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const Gallery = lazy(() => import('./pages/Gallery/Gallery'))
const Team = lazy(() => import('./pages/Team/Team'))
const Vlogs = lazy(() => import('./pages/Vlogs/Vlogs'))
const Notices = lazy(() => import('./pages/Notices/Notices'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Signup = lazy(() => import('./pages/Auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const Profile = lazy(() => import('./pages/Profile/Profile'))

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/team" element={<Team />} />
            <Route path="/vlogs" element={<Vlogs />} />
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
          </Routes>
        </Suspense>
      </Layout>
    </AuthProvider>
  )
}

export default App