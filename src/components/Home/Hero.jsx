import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Code, Terminal, Cpu, Globe } from 'lucide-react';
import gsap from 'gsap';

const Hero = () => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Initial state
      gsap.set('.hero-badge', { opacity: 0, y: 20 });
      gsap.set('.hero-title-line', { opacity: 0, y: 50, rotateX: -20 });
      gsap.set('.hero-desc', { opacity: 0, y: 20 });
      gsap.set('.hero-btn', { opacity: 0, y: 20 });
      gsap.set('.hero-stat', { opacity: 0, y: 20 });
      gsap.set('.hero-card', { opacity: 0, scale: 0.9, rotateY: 15 });
      gsap.set('.hero-icon', { opacity: 0, scale: 0 });

      // Animation sequence
      tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
        .to('.hero-title-line', { 
          opacity: 1, 
          y: 0, 
          rotateX: 0, 
          duration: 0.8, 
          stagger: 0.15,
          transformOrigin: '0% 50% -50'
        }, '-=0.4')
        .to('.hero-desc', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to('.hero-btn', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.4')
        .to('.hero-stat', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .to('.hero-card', { opacity: 1, scale: 1, rotateY: 0, duration: 1, ease: 'back.out(1.2)' }, '-=1')
        .to('.hero-icon', { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' }, '-=0.6');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    const particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive count

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#3b82f6' : '#a855f7' // blue-500 or purple-500
      });
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();

        // Connect particles
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 0.1 * (1 - dist / 150);
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Dynamic Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-40"
      />
      
      {/* Gradient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="container px-4 mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-8" style={{ perspective: '1000px' }}>
          <div className="hero-badge inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-gray-300 font-medium">Accepting New Members</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            <div className="hero-title-line overflow-hidden">Code.</div>
            <div className="hero-title-line overflow-hidden">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create.
              </span>
            </div>
            <div className="hero-title-line overflow-hidden">Analyze.</div>
          </h1>
          
          <p className="hero-desc text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Join the premier student tech society bridging the gap between academic learning and industry innovation through hands-on projects and mentorship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={scrollToContent}
              className="hero-btn group relative px-8 py-4 bg-white text-slate-950 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Explore Community 
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <a 
              href="https://discord.gg/uW3BthhwDU" 
              target="_blank" 
              rel="noreferrer"
              className="hero-btn px-8 py-4 rounded-xl font-bold border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              Join Discord
            </a>
          </div>

          {/* Stats / Trust Indicators */}
          <div className="pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-white/5 text-gray-500">
            <div className="hero-stat flex flex-col">
              <span className="text-2xl font-bold text-white">500+</span>
              <span className="text-sm">Members</span>
            </div>
            <div className="hero-stat w-px h-8 bg-white/10" />
            <div className="hero-stat flex flex-col">
              <span className="text-2xl font-bold text-white">20+</span>
              <span className="text-sm">Projects</span>
            </div>
            <div className="hero-stat w-px h-8 bg-white/10" />
            <div className="hero-stat flex flex-col">
              <span className="text-2xl font-bold text-white">10+</span>
              <span className="text-sm">Events</span>
            </div>
          </div>
        </div>

        {/* Right Content - Visual Element */}
        <div className="hidden lg:block relative" style={{ perspective: '1000px' }}>
          <div 
            className="hero-card relative transition-transform duration-200 ease-out"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mousePosition.y * -1}deg) rotateY(${mousePosition.x}deg)`
            }}
          >
            {/* Main floating card */}
            <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-blue-500/10">
              {/* Window Controls */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              
              {/* Code Content */}
              <div className="font-mono text-sm space-y-2">
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">1</span>
                  <span className="text-purple-400">import</span> <span className="text-white">Future</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@code-catalyst/tech'</span>;
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">2</span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">3</span>
                  <span className="text-blue-400">const</span> <span className="text-yellow-400">mission</span> <span className="text-white">=</span> <span className="text-blue-400">async</span> () <span className="text-blue-400">=&gt;</span> {'{'}
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">4</span>
                  <span className="ml-4 text-purple-400">await</span> <span className="text-white">Future.</span><span className="text-yellow-400">innovate</span>({'{'}
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">5</span>
                  <span className="ml-8 text-white">learning:</span> <span className="text-orange-400">true</span>,
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">6</span>
                  <span className="ml-8 text-white">community:</span> <span className="text-orange-400">true</span>,
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">7</span>
                  <span className="ml-8 text-white">impact:</span> <span className="text-green-400">'global'</span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">8</span>
                  <span className="ml-4">{'}'});</span>
                </div>
                <div className="flex text-gray-400">
                  <span className="w-8 text-gray-600 select-none">9</span>
                  <span className="text-white">{'}'}</span>
                </div>
              </div>

              {/* Cursor Animation */}
              <div className="absolute bottom-6 right-6 w-3 h-5 bg-blue-500 animate-pulse" />
            </div>

            {/* Floating Elements Background */}
            <div className="absolute -z-10 top-[-20px] right-[-20px] w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl opacity-20 animate-float-slow" />
            <div className="absolute -z-10 bottom-[-30px] left-[-20px] w-32 h-32 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full opacity-20 blur-xl animate-pulse" />

            {/* Tech Icons Floating */}
            <div className="hero-icon absolute -top-12 -right-12 p-4 bg-slate-900 border border-white/10 rounded-xl shadow-xl animate-bounce-slow">
              <Terminal className="w-8 h-8 text-blue-400" />
            </div>
            <div className="hero-icon absolute -bottom-8 -left-8 p-4 bg-slate-900 border border-white/10 rounded-xl shadow-xl animate-bounce-reverse-slow">
              <Cpu className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;