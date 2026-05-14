import React from 'react';

const Watermark = () => {
    return (
        <div className="absolute bottom-8 right-8 z-[50] pointer-events-none group select-none">
            <a
                href="https://origincreativeagency.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/30 backdrop-blur-md border border-white/5 hover:bg-slate-800/50 hover:border-white/10 transition-all duration-500 shadow-xl shadow-black/10"
            >
                <div className="relative flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-white/10 group-hover:bg-white/20 transition-colors">
                    <img
                        src="/origin.png"
                        alt="Origin Logo"
                        className="w-full h-full object-contain p-0.5"
                    />
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium opacity-80">Developed by</span>
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Origin</span>
                </div>
            </a>
        </div>
    );
};

export default Watermark;
