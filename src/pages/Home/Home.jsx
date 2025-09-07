import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Video, Bell, Code, Zap, Star } from 'lucide-react';
import api from '../../services/api';
import { getGallery } from '../../services/gallery';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const Home = () => {
  const [latestContent, setLatestContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles for advanced effects
  useEffect(() => {
    const initParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 80; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          connections: []
        });
      }
      setParticles(newParticles);
    };
    initParticles();
    window.addEventListener('resize', initParticles);
    return () => window.removeEventListener('resize', initParticles);
  }, []);

  // Canvas animation for neural network effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
        particles.forEach(otherParticle => {
          if (particle.id !== otherParticle.id) {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) + 
              Math.pow(particle.y - otherParticle.y, 2)
            );
            if (distance < 150) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 150)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particles]);

  useEffect(() => {
    // Fetch latest events, notices, and blogs
    async function fetchLatestContent() {
      setLoading(true);
      try {
        const [galleryEvents, noticesRes, blogsRes] = await Promise.all([
          getGallery(),
          api.get('/notices'),
          api.get('/blogs'),
        ]);
        console.log('Gallery Events API response:', galleryEvents);
        setLatestContent({
          events: galleryEvents.slice(0, 3),
          notices: noticesRes.data.slice(0, 3),
          blogs: blogsRes.data.slice(0, 3),
        });
      } catch (err) {
        setLatestContent({ events: [], notices: [], blogs: [] });
      }
      setLoading(false);
    }
    fetchLatestContent();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
          <Code className="absolute inset-0 m-auto text-blue-400 animate-pulse" size={24} />
        </div>
        <p className="ml-4 text-gray-300 text-lg">Loading Code Catalyst...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Banner/Hero Section Start */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col gap-10 items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-black text-white overflow-hidden"
      >
        {/* Neural Network Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-30"
        />
        {/* Animated Background Layers */}
        <div className="absolute inset-0 opacity-20">
          {/* Hexagonal Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px',
            animation: 'grid-pulse 8s ease-in-out infinite alternate'
          }} />
          {/* Circuit Board Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(45deg, rgba(147, 51, 234, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 50px 50px',
            animation: 'circuit-flow 15s linear infinite'
          }} />
        </div>
        {/* Floating Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`geo-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-complex ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `translate3d(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03}px, 0)`
              }}
            >
              <div className={`w-${4 + Math.floor(Math.random() * 8)} h-${4 + Math.floor(Math.random() * 8)} ${
                Math.random() > 0.5 ? 'rounded-full' : 'rounded-lg rotate-45'
              } bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm`} />
            </div>
          ))}
        </div>
        {/* Glowing Orbs */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute w-32 h-32 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)`,
                animation: `orbit ${20 + Math.random() * 20}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        {/* Floating Code Elements Enhanced */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={`code-${i}`}
              className="absolute text-blue-400/40 font-mono text-lg animate-float transition-all duration-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 8}s`,
                transform: `translate3d(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px, 0) rotate(${Math.random() * 360}deg)`,
                filter: 'blur(0.5px)',
                textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
              }}
            >
              {[
                '{CodeCatalyst}', '< />', '( )', '[ ]', '<CodeCatalyst />','<CodeCatalyst />','<CodeCatalyst />','<CodeCatalyst />','<CodeCatalyst />', '&&', '||', 
                '<dev>', '</CodeCatalyst>', 'async', 'await', 'Code=>Catalyst', 'const', 'let',
                'function CodeCatalyst()', 'return', 'import', 'export', 'class', 'extends'
              ][Math.floor(Math.random() * 20)]}
            </div>
          ))}
        </div>
        {/* Scanning Lines Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent w-full h-1 animate-scan-horizontal" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent w-1 h-full animate-scan-vertical" />
        </div>
        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(15)].map((_, i) => (
            <div
              key={`matrix-${i}`}
              className="absolute text-green-400/30 font-mono text-xs leading-tight"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `matrix-rain ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            >
              {Array.from({ length: 20 }, (_, j) => (
                <div key={j} className="opacity-80">
                  {Math.random().toString(36).charAt(0)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="relative z-20 max-w-5xl w-full mx-auto p-10 animate-fade-in text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-black">
                            <img src={'/logo_transparent.png'} alt="Code Catalyst" className="w-30 h-30" />

            </div>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_4px_20px_rgba(59,130,246,0.3)]">
              Code Catalyst
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
            Code. Create. Analyze.

          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/signup" className="group relative flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x text-white font-semibold px-8 py-4 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <ArrowRight className="mr-2 transition-transform duration-300 group-hover:translate-x-1" size={22} />
              <span className="relative z-10">Join Our Community</span>
            </Link>
            
          </div>
        </div>
        {/* Enhanced Scroll Indicator */}
        
      </section>
      {/* Banner/Hero Section End */}

      {/* Highlights Section */}
      <section className="section-padding bg-slate-900 relative">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              What's Happening at <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_2px_16px_rgba(168,85,247,0.5)]">Code Catalyst</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Stay updated with our latest events, announcements, and community highlights
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Events */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-400" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-white">Latest Events</h3>
              </div>

              <div className="space-y-4">
                {latestContent?.events?.map((event) => (
                  <div key={event.id} className="card hover:scale-105 transition-transform">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title || event.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="font-semibold text-white mb-2">{event.title || event.name}</h4>
                    <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                    <p className="text-gray-400 text-xs">{event.date ? new Date(event.date).toLocaleDateString() : ''}</p>
                  </div>
                ))}
              </div>

              <Link to="/gallery" className="inline-flex items-center font-medium text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x px-4 py-2 rounded-lg shadow transition-transform hover:scale-105">
                View All Events <ArrowRight size={16} className="ml-1 text-white" />
              </Link>
            </div>

            {/* Notices */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Bell className="text-accent-600" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-300">Recent Notices</h3>
              </div>

              <div className="space-y-4">
                {latestContent?.notices?.map((notice) => (
                  <div key={notice.id} className="card hover:scale-105 transition-transform">
                    <h4 className="font-semibold text-white mb-1">{notice.title}</h4>
                    <p className="text-gray-300 text-sm mb-1">{notice.description}</p>
                    <p className="text-gray-400 text-xs">{new Date(notice.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              <Link to="/notices" className="inline-flex items-center font-medium text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x px-4 py-2 rounded-lg shadow transition-transform hover:scale-105">
                View All Notices <ArrowRight size={16} className="ml-1 text-white" />
              </Link>
            </div>

            {/* Blogs */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Video className="text-secondary-600" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-300">Latest Blogs</h3>
              </div>

              <div className="space-y-4">
                {latestContent?.blogs?.map((blog) => (
                  <div key={blog.id} className="card hover:scale-105 transition-transform">
                    {blog.thumbnail && (
                      <img
                        src={blog.thumbnail}
                        alt={blog.title}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                    )}
                    <h4 className="font-semibold text-white mb-1">{blog.title}</h4>
                    <p className="text-gray-300 text-sm mb-1">{blog.author}</p>
                    <p className="text-gray-400 text-xs">{new Date(blog.date || blog.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              <Link to="/blog" className="inline-flex items-center font-medium text-white bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x px-4 py-2 rounded-lg shadow transition-transform hover:scale-105">
                Read All Blogs <ArrowRight size={16} className="ml-1 text-white" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative section-padding flex items-center justify-center bg-purple-900 text-white overflow-hidden">
        <div className="container-max text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Start Your Tech Journey?
            </h2>
            <p className="text-xl text-gray-100">
              Join Code Catalyst today and connect with like-minded students,
              participate in exciting projects, and grow your technical skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="group relative bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="relative z-10 flex items-center justify-center">
                  <Users className="inline mr-2" size={20} />
                  Become a Member
                </span>
              </Link>
              <Link to="/contact" className="group relative bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <span className="relative z-10">Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes circuit-flow {
          0% { transform: translateX(-100px); }
          100% { transform: translateX(100px); }
        }
        @keyframes float-complex {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        @keyframes orbit {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(100px) translateY(-50px); }
          50% { transform: translateX(0px) translateY(-100px); }
          75% { transform: translateX(-100px) translateY(-50px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes matrix-rain {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-scan-horizontal {
          animation: scan-horizontal 8s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .animate-scan-vertical {
          animation: scan-vertical 6s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .animate-matrix-rain {
          animation: matrix-rain 10s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4,0,0.2,1);
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .animate-float {
          animation: float-complex 6s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        /* Smoother transitions for transform and opacity */
        .animate-float, .animate-fade-in, .animate-pulse-glow, .animate-pulse-slow {
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
};

export default Home;
