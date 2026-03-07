import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '../../components/Home/Hero';
import { ArrowRight, Users, Target, Eye, Heart, Lightbulb, Rocket, Code, Github, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { getGallery } from '../../services/gallery';
import DiscordIcon from '../../components/Layout/DiscordIcon';

gsap.registerPlugin(ScrollTrigger);

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

const Home = () => {
  const [latestContent, setLatestContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef(null);

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
    if (loading) return;
    
    const ctx = gsap.context(() => {
      // Parallax effect for background elements
      gsap.utils.toArray('.parallax-bg').forEach((bg) => {
        gsap.to(bg, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: bg.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      // Staggered reveal for sections
      gsap.utils.toArray('.gsap-section').forEach((section) => {
        gsap.fromTo(section, 
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // Image parallax
      gsap.utils.toArray('.parallax-img').forEach((img) => {
        gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: img.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <Hero />

      {/* ─── Marquee Section ─── */}
      <div className="py-6 border-y border-white/5 bg-slate-900/50 overflow-hidden flex whitespace-nowrap">
        <div className="animate-marquee flex gap-8 items-center">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300 uppercase tracking-widest">INNOVATION</span>
              <span className="text-blue-500">✦</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300 uppercase tracking-widest">DEVELOPMENT</span>
              <span className="text-purple-500">✦</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300 uppercase tracking-widest">COMMUNITY</span>
              <span className="text-pink-500">✦</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-300 uppercase tracking-widest">TECHNOLOGY</span>
              <span className="text-cyan-500">✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ─── Core Values ─── */}
      <section className="py-24 bg-slate-950 relative gsap-section">
        {/* Parallax Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax-bg absolute -top-[20%] -left-[10%] w-[50%] h-[140%] bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-blue-400 mb-3">What drives us</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <value.icon className="text-white" size={22} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Innovation Cell ─── */}
      <section className="py-24 bg-slate-900/50 relative gsap-section">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax-bg absolute top-[10%] right-[0%] w-[40%] h-[120%] bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-purple-400 mb-3">Incubation Hub</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Innovation Cell
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Where ideas come to life — your creative space from the Code Catalyst community at JB Knowledge Park.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[{
              icon: Lightbulb,
              title: 'Introduction',
              content: `The Innovation Cell is a dedicated space where creativity meets learning. It is built to inspire students to think differently and go beyond classroom knowledge. Here, ideas are not just discussed but also shaped into practical solutions.`,
              accent: 'blue'
            }, {
              icon: Target,
              title: 'Our Purpose',
              content: `The purpose of the Innovation Cell is to give students the right platform to explore their ideas and talents. Through the Cell, students get an environment where they can discuss problems, think of solutions, and try new approaches.`,
              accent: 'purple'
            }, {
              icon: Users,
              title: 'Who Can Join?',
              content: `The Innovation Cell is open to everyone who is curious and willing to learn. Whether you are from Electrical, IT, Mechanical, or any other stream, you can be a part of this community.`,
              accent: 'green'
            }, {
              icon: Rocket,
              title: 'What We Provide',
              content: `We offer guidance from mentors and hands-on opportunities to work on projects. For students with ideas, we help in refining and developing them into practical innovations with community support.`,
              accent: 'orange'
            }].map((section, idx) => {
              const accentMap = { blue: 'border-blue-500/20 hover:border-blue-500/40', purple: 'border-purple-500/20 hover:border-purple-500/40', green: 'border-emerald-500/20 hover:border-emerald-500/40', orange: 'border-orange-500/20 hover:border-orange-500/40' };
              const iconBgMap = { blue: 'bg-blue-500/10 text-blue-400', purple: 'bg-purple-500/10 text-purple-400', green: 'bg-emerald-500/10 text-emerald-400', orange: 'bg-orange-500/10 text-orange-400' };
              return (
                <div 
                  key={idx} 
                  className={`group rounded-2xl border ${accentMap[section.accent]} bg-white/[0.02] p-8 hover:bg-white/[0.04] transition-all duration-300`}
                >
                  <div className={`w-12 h-12 rounded-xl ${iconBgMap[section.accent]} flex items-center justify-center mb-5`}>
                    <section.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">{section.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Social Platforms ─── */}
      <section className="py-24 bg-slate-950 relative gsap-section">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax-bg absolute top-[30%] left-[20%] w-[60%] h-[80%] bg-gradient-to-t from-pink-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-pink-400 mb-3">Community</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Connect With Us
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join our vibrant community across multiple platforms. Stay updated with the latest tech trends, events, and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[
              { name: 'GitHub', icon: Github, href: 'https://github.com/codeCatalyst-Jb', stat: '4', statLabel: 'Followers', accent: 'gray', cta: 'Follow Us' },
              { name: 'Discord', icon: DiscordIcon, href: 'https://discord.gg/uW3BthhwDU', stat: '100+', statLabel: 'Members', accent: 'indigo', cta: 'Join Server' },
              { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/codecatalyst.jb', stat: '400+', statLabel: 'Followers', accent: 'pink', cta: 'Follow Us' },
              { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/code-catalyst-s/', stat: '70+', statLabel: 'Connections', accent: 'blue', cta: 'Connect' },
              { name: 'WhatsApp', icon: MessageCircle, href: 'https://chat.whatsapp.com/EQvCUtrg0FDD8WfY7KlGih', stat: '450+', statLabel: 'Members', accent: 'green', cta: 'Join Community' },
            ].map((platform, idx) => {
              const colorMap = {
                gray: 'border-gray-700/50 hover:border-gray-600',
                indigo: 'border-indigo-500/30 hover:border-indigo-400/50',
                pink: 'border-pink-500/30 hover:border-pink-400/50',
                blue: 'border-blue-500/30 hover:border-blue-400/50',
                green: 'border-emerald-500/30 hover:border-emerald-400/50',
              };
              const iconColorMap = {
                gray: 'text-gray-300',
                indigo: 'text-indigo-400',
                pink: 'text-pink-400',
                blue: 'text-blue-400',
                green: 'text-emerald-400',
              };
              return (
                <a
                  key={platform.name}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col items-center text-center rounded-2xl border ${colorMap[platform.accent]} bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-300`}
                >
                  <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${iconColorMap[platform.accent]}`}>
                    <platform.icon size={28} />
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{platform.name}</h3>
                  <div className="text-2xl font-bold text-white mt-2">{platform.stat}</div>
                  <div className="text-xs text-gray-500 mb-4">{platform.statLabel}</div>
                  <span className={`text-xs font-medium ${iconColorMap[platform.accent]} flex items-center gap-1 group-hover:gap-2 transition-all duration-300`}>
                    {platform.cta} <ArrowRight size={12} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured Projects ─── */}
      <section className="py-24 bg-slate-900/50 relative gsap-section">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="parallax-bg absolute -top-[10%] -right-[10%] w-[50%] h-[120%] bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-cyan-400 mb-3">Our Work</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A glimpse of what we build. See more on our projects page.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...completedProjectsPreview, ...ongoingProjectsPreview].map((project, idx) => (
              <div 
                key={project.id} 
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-48 sm:h-auto flex-shrink-0 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="parallax-img absolute top-[-10%] left-0 w-full h-[120%] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group/link"
                    >
                      View Project
                      <ArrowRight size={14} className="ml-1.5 transition-transform group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/projects"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm font-medium hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
            >
              See All Projects
              <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 bg-slate-950 relative overflow-hidden gsap-section">
        {/* Subtle gradient backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="parallax-bg absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join Code Catalyst today and connect with like-minded students,
            participate in exciting projects, and grow your technical skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-slate-950 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
            >
              <Users className="mr-2" size={18} />
              Become a Member
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/10 bg-white/[0.03] text-white rounded-xl font-semibold hover:bg-white/[0.06] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;