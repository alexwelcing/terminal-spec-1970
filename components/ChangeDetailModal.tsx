
import React, { useEffect, useState } from 'react';
import { SpecChange, ChangeType } from '../types';

interface ChangeDetailModalProps {
  change: SpecChange;
  onClose: () => void;
}

const ChangeDetailModal: React.FC<ChangeDetailModalProps> = ({ change, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay to ensure the browser paints the initial state before transitioning
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    // Wait for the exit animation to complete before unmounting
    setTimeout(onClose, 400); 
  };

  const getHeaderColor = (type: ChangeType) => {
    switch (type) {
      case ChangeType.ADDED: return 'text-green-500 border-green-500';
      case ChangeType.REMOVED: return 'text-red-500 border-red-500';
      case ChangeType.BREAKING: return 'text-orange-500 border-orange-500';
      default: return 'text-amber-500 border-amber-500';
    }
  };

  const headerColorClass = getHeaderColor(change.type);
  const textColorClass = headerColorClass.split(' ')[0];
  const borderColorClass = headerColorClass.split(' ')[1];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ perspective: '2000px' }}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div 
        className={`
          relative w-full max-w-2xl 
          bg-[#0f1115] 
          border-2 ${borderColorClass}
          shadow-[0_0_50px_rgba(0,0,0,0.8)] 
          transition-all duration-500 
          transform-gpu origin-top
        `}
        style={{
           backgroundImage: `radial-gradient(circle at center, #1a1c23 0%, #0f1115 100%)`,
           // Elastic/Mechanical easing for the "heavy flap" feel
           transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
           transform: visible 
             ? 'rotateX(0deg) translateY(0) scale(1)' 
             : 'rotateX(-60deg) translateY(-100px) scale(0.9)',
           opacity: visible ? 1 : 0
        }}
      >
         {/* Retro Corner Accents */}
         <div className={`absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 ${borderColorClass}`}></div>
         <div className={`absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 ${borderColorClass}`}></div>
         <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 ${borderColorClass}`}></div>
         <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 ${borderColorClass}`}></div>

         {/* Header Bar */}
         <div className={`
           px-6 py-3 
           border-b border-[#2d303a] 
           flex justify-between items-center
           bg-white/5
         `}>
            <div className={`font-bold tracking-[0.2em] text-xs uppercase ${textColorClass}`}>
              DATA LOG: ENTRY #{Math.floor(Math.random() * 10000)}
            </div>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-white font-mono text-xl leading-none transition-colors"
            >
              [X]
            </button>
         </div>

         {/* Content Area */}
         <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                 <span className={`px-3 py-1 text-black font-bold text-xs uppercase tracking-widest bg-${change.type === 'ADDED' ? 'green' : change.type === 'REMOVED' ? 'red' : change.type === 'BREAKING' ? 'orange' : 'amber'}-500`}>
                   {change.type}
                 </span>
                 <span className="text-gray-500 font-mono text-xs tracking-widest uppercase">IMPACT: {change.impact}</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold font-mono ${textColorClass} tracking-tight break-all`}>
                {change.method} {change.endpoint}
              </h2>
            </div>

            {/* Description */}
            <div className="bg-[#15171e] p-4 border-l-2 border-[#2d303a]">
               <h3 className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2 font-bold">Briefing</h3>
               <p className="text-gray-300 text-sm leading-relaxed font-mono">
                 {change.description}
               </p>
            </div>

            {/* Technical Detail */}
            <div className="space-y-2">
               <h3 className={`text-[10px] uppercase tracking-[0.2em] font-bold ${textColorClass} flex items-center gap-2`}>
                 <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                 Technical Analysis
               </h3>
               <div className="bg-black/40 border border-[#2d303a] p-5 text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                 {change.technicalDetail || "No additional technical details available."}
               </div>
            </div>

         </div>

         {/* Footer */}
         <div className="px-6 py-3 bg-[#0f1115] border-t border-[#2d303a] text-right">
            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest animate-pulse">
               END OF RECORD
            </span>
         </div>
      </div>
    </div>
  );
};

export default ChangeDetailModal;
