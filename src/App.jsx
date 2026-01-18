import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout/Layout'
import ScrollToTop from './components/Layout/ScrollToTop'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminRoute from './components/Auth/AdminRoute'
import { NoticesProvider } from './context/NoticesContext'
import { BlogsProvider } from './context/NoticesContext'

// Lazy load pages for better performance
import { lazy, Suspense, useEffect } from 'react'
import Loader from './components/Common/LoadingSpinner'
import apiBase from './services/apiBase'
import CoreTeamFeedback from './pages/feedback/CoreTeamFeedback'


const Home = lazy(() => import('./pages/Home/Home'))
const About = lazy(() => import('./pages/About/About'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
// const Hiring = lazy(() => import('./pages/Hiring/Hiring'))
const Gallery = lazy(() => import('./pages/Home/Gallery/Gallery'))
const GalleryDetails = lazy(() => import('./pages/Home/Gallery/GalleryDetails'))
const Team = lazy(() => import('./pages/Team/Team'))
const MemberDetail = lazy(() => import('./pages/Team/MemberDetail'))
const Blog = lazy(() => import('./pages/Blog/Blog'))
const BlogDetails = lazy(() => import('./pages/Blog/BlogDetails'))
const Notices = lazy(() => import('./pages/Notices/Notices'))
const NoticeDetails = lazy(() => import('./pages/Notices/NoticeDetails'))
const Login = lazy(() => import('./pages/Auth/Login'))
const Socials = lazy(() => import('./pages/Socials/Socials'))
const Signup = lazy(() => import('./pages/Auth/Signup'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Profile = lazy(() => import('./pages/Profile/Profile'))
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'))
const Privacy = lazy(() => import('./pages/Privacy'))
const Test = lazy(() => import('./Test'))
const Innovation = lazy(() => import('./pages/Innovation/Innovation'))
const Projects = lazy(() => import('./pages/Projects/Projects'))
const EsportsRegistration = lazy(() => import('./pages/Esports/EsportsRegistration'))
const DanceSocietyRegistration = lazy(() => import('./pages/jbiansRegistration/RegistrationJbian'))
const OpenSource = lazy(() => import('./pages/OpenSource/OpenSource'))
const Feedback = lazy(()=> import('./pages/feedback/CoreTeamFeedback'))
const AdminFeedbackResponses = lazy(() => import('./pages/Admin/CoreTeamFeedbackResponses'))

const HERO_ROUTES = [
  '/',
  '/about',
  '/gallery',
  '/team',
  // '/hiring',
  '/blog',
  '/notices',
  '/test',
  '/projects',
  '/opensource',
  '/feedback',
// '/esports',
]

function App() {
  const location = useLocation()
  const transparentOnTop = HERO_ROUTES.includes(location.pathname)

  // Prefetch common GET endpoints on app mount to reduce spinner times
  useEffect(() => {
    const urls = ['/gallery', '/blogs', '/notices']
    apiBase.prefetch(urls).catch(() => {
      /* ignore prefetch errors */
    })
  }, [])

  return (
    <NoticesProvider>
      <BlogsProvider>
        <AuthProvider>
          <ScrollToTop />
          <Layout transparentOnTop={transparentOnTop}>
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* <Route path="/hiring" element={<Hiring />} /> */}
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<Test />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/team" element={<Team />} />
                <Route path="/team/:id" element={<MemberDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/gallery/:id" element={<GalleryDetails />} />
                <Route path="/notices" element={<Notices />} />
                <Route path="/notices/:id" element={<NoticeDetails />} />
                <Route path="/innovation" element={<Innovation />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/esports" element={<EsportsRegistration />} />
                <Route path="/dance-society/register" element={<DanceSocietyRegistration />} />
                <Route path="/opensource" element={<OpenSource />} />
                <Route path="/feedback" element={<CoreTeamFeedback />} />
                <Route path='/socials' element={<Socials />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
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
                <Route
                  path="/admin/feedback-responses"
                  element={
                    <AdminRoute>
                      <AdminFeedbackResponses />
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