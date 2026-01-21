
import React, { useState, useEffect } from 'react';

interface FlapCellProps {
  value: string;
  width?: string;
  align?: 'left' | 'center';
  color?: string;
}

const FlapCell: React.FC<FlapCellProps> = ({ value, width = 'w-32', align = 'left', color = 'text-amber-400' }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <div className={`${width} h-12 relative overflow-hidden bg-[#15171e] border-r border-[#2d303a] last:border-r-0 flex items-center ${align === 'center' ? 'justify-center' : 'justify-start px-4'}`}>
      {/* Mechanical Flap Effect */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/50 z-10"></div>
      
      <span className={`
        ${color} 
        font-bold 
        text-lg 
        tracking-widest 
        uppercase 
        transition-all 
        duration-300
        ${isFlipping ? 'scale-y-0 opacity-50' : 'scale-y-100 opacity-100'}
      `}>
        {displayValue || '---'}
      </span>
      
      {/* Subtle highlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default FlapCell;
