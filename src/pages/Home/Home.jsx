// Small Projects Preview Section
const completedProjectsPreview = [
  {
    id: 1,
    name: 'Mukhota Website',
    description: 'A drama society website to showcase performances and establish an online presence.',
    link: 'https://mukhauta.vercel.app/',
    image: '/mukhauta.png',
    color: 'from-purple-500 to-pink-500'
  }
];
const ongoingProjectsPreview = [
  {
    id: 2,
    name: 'Eve Chatbot',
    description: 'An intelligent chatbot for community info, college details, and career guidance.',
    link: 'https://eve-higv.onrender.com/?next=/cc-chatbot/',
    image: '/eve.jpg',
    color: 'from-blue-500 to-cyan-500'
  }
];
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Video, Bell, Code, Zap, Star, Target, Eye, Heart, Lightbulb, Rocket, Award, BookOpen, Brain, Sparkles, Globe, Github, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { getGallery } from '../../services/gallery';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import DiscordIcon from '../../components/Layout/DiscordIcon';

const Home = () => {
  const [latestContent, setLatestContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);

  // Core Values section data (from About)
  const values = [
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading student tech society that bridges the gap between academic learning and industry demands, fostering innovation and technical excellence.',
      color: 'from-purple-500 to-pink-600',
      delay: '0ms'
    },
    {
      icon: Target,
      title: 'Our Purpose',
      description: 'To create a thriving community where students can explore, learn, and excel in technology while building lasting connections and practical skills for their future careers.',
      color: 'from-blue-500 to-purple-600',
      delay: '200ms'
    },
    {
      icon: Heart,
      title: 'Our Mission',
      description: 'Empowering students through hands-on workshops, collaborative projects, industry mentorship, and a supportive community that encourages continuous learning and growth.',
      color: 'from-pink-500 to-red-600',
      delay: '400ms'
    }
  ];

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
        setLatestContent({
          events: Array.isArray(galleryEvents) ? galleryEvents.slice(0, 3) : [],
          notices: Array.isArray(noticesRes?.data?.data) ? noticesRes.data.data.slice(0, 3) : [],
          blogs: Array.isArray(blogsRes?.data) ? blogsRes.data.slice(0, 3) : [],
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

  // Scroll the page slightly past the hero section when Explore community is clicked
  const scrollPastHero = () => {
    if (!heroRef.current) return;
    const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
    // Scroll a little past the bottom of the hero so the next section's top is visible
    const target = Math.max(0, heroBottom - 56); // 56px for header height offset
    window.scrollTo({ top: target, behavior: 'smooth' });
  };
  

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"style={{ animationDuration: '0.5s' }}></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-purple-500/20 border-b-purple-500 rounded-full animate-spin animate-reverse" style={{ animationDuration: '0.5s' }}></div>
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
            <button onClick={scrollPastHero} className="group relative flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x text-white font-semibold px-8 py-4 rounded-xl transition-all duration-500 ease-out transform hover:scale-[1.02] hover:shadow-2xl shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <ArrowRight className="mr-2 transition-transform duration-300 group-hover:translate-x-1" size={22} />
              <span className="relative z-10">Explore community</span>
            </button>
          </div>
        </div>
        {/* Enhanced Scroll Indicator */}
        
      </section>
      {/* Banner/Hero Section End */}

      {/* Core Values Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden text-white">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative"
                style={{ animationDelay: value.delay }}
              >
                <div className="relative bg-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-700">
                  {/* 3D Icon Container */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <value.icon className="text-white" size={32} />
                    </div>
                    <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-xl transform translate-y-2`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {value.title}
                  </h3>
                  <p className="text-white leading-relaxed group-hover:text-gray-100 transition-colors duration-300">
                    {value.description}
                  </p>
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation Cell Section (copied from Innovation page) */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Innovation <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Cell</span>
            </h2>
            <p className="text-xl max-w-2xl mx-auto text-gray-300">
              Where Ideas Come to Life - Your creative space from the Code Catalyst community at JB Knowledge Park.
            </p>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {/* (Empty for now) */}
          </div>
          {/* About Innovation Cell Sections as Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
            {[{
              icon: Lightbulb,
              title: 'Introduction',
              content: `The Innovation Cell is a dedicated space where creativity meets learning. It is built to inspire students to think differently and go beyond classroom knowledge. Here, ideas are not just discussed but also shaped into practical solutions. In short, it's a place where imagination turns into reality.`,
              color: 'from-blue-500 to-cyan-500'
            }, {
              icon: Target,
              title: 'Our Purpose',
              content: `The purpose of the Innovation Cell is to give students the right platform to explore their ideas and talents. Through the Cell, students get an environment where they can discuss problems, think of solutions, and try new approaches. It's about developing confidence to create something new and useful. It helps students to grow their skills for both academics and real-world needs.`,
              color: 'from-purple-500 to-pink-500'
            }, {
              icon: Users,
              title: 'Who Can Join?',
              content: `The Innovation Cell is open to everyone who is curious and willing to learn. Whether you are from Electrical, IT, Mechanical, or any other stream, you can be a part of this community. If you bring an idea, the Cell will support you in making it more impactful. It's about giving every student a chance to explore innovation in their own way.`,
              color: 'from-green-500 to-emerald-500'
            }, {
              icon: Rocket,
              title: 'What We Provide',
              content: `The Innovation Cell provides students with the tools, resources, and support they need to succeed. We offer guidance from mentors, and hands-on opportunities to work on projects. For students with ideas, we help in refining and developing them into practical innovations. With Code Catalyst also being a part of this journey, students gain even more exposure and community support.`,
              color: 'from-orange-500 to-red-500'
            }].map((section, idx) => (
              <div key={idx} className="bg-white/10 rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className={`w-14 h-14 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-4`}>
                  <section.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Platforms Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.2) 1px, transparent 1px),
              radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="container-max px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Connect With <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">Us</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join our vibrant community across multiple platforms. Stay updated with the latest tech trends, events, and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {/* GitHub */}
            <div className="flex flex-col gap-4">
              <a
                href="https://github.com/codeCatalyst-Jb"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-gray-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Github className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">GitHub</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Explore our open-source projects, contribute to code, and collaborate with fellow developers.
                  </p>
                  <div className="flex items-center text-blue-400 font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    <span>Follow Us</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </a>
              <div className="text-center bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  4
                </div>
                <div className="text-gray-300 font-medium text-sm">GitHub Followers</div>
              </div>
            </div>

            {/* Discord */}
            <div className="flex flex-col gap-4">
              <a
                href="https://discord.gg/uW3BthhwDU"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 border border-indigo-500 hover:border-indigo-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <DiscordIcon size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Discord</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    Join our active community, get real-time help, participate in discussions, and network with peers.
                  </p>
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    <span>Join Server</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </a>
              <div className="text-center bg-indigo-900/50 rounded-xl p-4 border border-indigo-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  100+
                </div>
                <div className="text-gray-300 font-medium text-sm">Discord Members</div>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex flex-col gap-4">
              <a
                href="https://www.instagram.com/codecatalyst.jb"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-pink-600 via-purple-600 to-orange-500 rounded-2xl p-8 border border-pink-500 hover:border-pink-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Instagram className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Instagram</h3>
                  <p className="text-pink-100 text-sm leading-relaxed">
                    See our event highlights, behind-the-scenes moments, and stay connected with our journey.
                  </p>
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    <span>Follow Us</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </a>
              <div className="text-center bg-pink-900/50 rounded-xl p-4 border border-pink-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent mb-2">
                  400+
                </div>
                <div className="text-gray-300 font-medium text-sm">Instagram Followers</div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex flex-col gap-4">
              <a
                href="https://www.linkedin.com/company/code-catalyst-s/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-8 border border-blue-600 hover:border-blue-500 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <Linkedin className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">LinkedIn</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    Connect professionally, discover opportunities, and network with industry experts.
                  </p>
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    <span>Connect</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </a>
              <div className="text-center bg-blue-900/50 rounded-xl p-4 border border-blue-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    70+
                  </div>
                <div className="text-gray-300 font-medium text-sm">LinkedIn Connections</div>
              </div>
            </div>

            {/* WhatsApp Community */}
            <div className="flex flex-col gap-4">
              <a
                href="https://chat.whatsapp.com/EQvCUtrg0FDD8WfY7KlGih"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-8 border border-green-500 hover:border-green-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <MessageCircle className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">WhatsApp</h3>
                  <p className="text-green-100 text-sm leading-relaxed">
                    Join our WhatsApp community for instant updates, quick discussions, and direct communication.
                  </p>
                  <div className="flex items-center text-white font-semibold group-hover:translate-x-1 transition-transform duration-300">
                    <span>Join Community</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              </a>
              <div className="text-center bg-green-900/50 rounded-xl p-4 border border-green-700">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  450+
                </div>
                <div className="text-gray-300 font-medium text-sm">WhatsApp Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900">
        <div className="container-max px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A glimpse of what we build. See more on our projects page.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...completedProjectsPreview, ...ongoingProjectsPreview].map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row overflow-hidden">
                <img src={project.image} alt={project.name} className="w-full md:w-32 h-48 object-cover" />
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{project.name}</h3>
                    <p className="text-gray-700 mb-4">{project.description}</p>
                  </div>
                  <div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:scale-105 transition-transform">
                      View Project
                      <ArrowRight size={16} className="ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/projects" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold hover:scale-105 transition-transform">See All Projects</Link>
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
