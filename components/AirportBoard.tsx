
import React, { useState } from 'react';
import { ComparisonResult, ChangeType, SpecChange } from '../types';
import FlapCell from './FlapCell';
import ChangeDetailModal from './ChangeDetailModal';

interface AirportBoardProps {
  data: ComparisonResult | null;
  loading: boolean;
}

const AirportBoard: React.FC<AirportBoardProps> = ({ data, loading }) => {
  const [selectedChange, setSelectedChange] = useState<SpecChange | null>(null);
  const rows = loading ? Array(5).fill(null) : (data?.changes || []);

  const getStatusColor = (type: ChangeType) => {
    switch (type) {
      case ChangeType.ADDED: return 'text-green-500';
      case ChangeType.REMOVED: return 'text-red-500';
      case ChangeType.BREAKING: return 'text-orange-500';
      default: return 'text-amber-400';
    }
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto bg-[#1a1c23] border-[12px] border-[#22262f] shadow-2xl rounded-sm overflow-hidden ring-4 ring-black/30">
        {/* Board Header */}
        <div className="bg-[#22262f] px-6 py-4 flex justify-between items-center border-b border-black/50">
          <div className="flex gap-12">
            <div className="text-xs text-gray-500 font-bold tracking-[0.2em]">SERVICE TERMINAL: OPENAPI-DIFF-01</div>
            <div className="text-xs text-gray-500 font-bold tracking-[0.2em]">GATE: V2.5-ALPHA</div>
          </div>
          <div className="text-amber-500 text-sm font-bold tracking-widest animate-pulse">
            {loading ? 'STATUS: PROCESSING...' : 'STATUS: READY'}
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex bg-[#0f1115] border-b border-[#2d303a]">
          <div className="w-40 px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-r border-[#2d303a]">Action</div>
          <div className="w-24 px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-r border-[#2d303a]">Method</div>
          <div className="flex-1 px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-r border-[#2d303a]">Endpoint</div>
          <div className="flex-1 px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest border-r border-[#2d303a]">Description</div>
          <div className="w-24 px-4 py-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Impact</div>
        </div>

        {/* Board Rows */}
        <div className="flex flex-col min-h-[400px]">
          {rows.length === 0 && !loading ? (
            <div className="flex-1 flex items-center justify-center text-gray-600 italic tracking-widest p-12 text-center">
              NO DELAYS DETECTED. SYSTEM STATUS NOMINAL. <br/> UPLOAD SPECIFICATIONS TO BEGIN COMPARISON.
            </div>
          ) : (
            rows.map((change, idx) => (
              <div 
                key={idx} 
                onClick={() => change && setSelectedChange(change)}
                className={`
                  flex border-b border-[#2d303a] 
                  transition-all duration-200
                  relative
                  group
                  ${change ? 'cursor-pointer hover:bg-white/[0.05]' : ''}
                `}
              >
                {/* Hover indicator line on left */}
                {change && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>
                )}
                
                <FlapCell 
                  value={change?.type || ''} 
                  width="w-40" 
                  color={change ? getStatusColor(change.type) : ''}
                />
                <FlapCell 
                  value={change?.method || ''} 
                  width="w-24" 
                  align="center"
                />
                <FlapCell 
                  value={change?.endpoint || ''} 
                  width="flex-1" 
                />
                <FlapCell 
                  value={change?.description || ''} 
                  width="flex-1" 
                />
                <FlapCell 
                  value={change?.impact || ''} 
                  width="w-24" 
                  align="center"
                  color={change?.impact === 'HIGH' ? 'text-red-500' : 'text-gray-400'}
                />
                
                {/* View button overlay - Replaces Impact cell on hover */}
                {change && (
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-[#15171e] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 border-l border-[#2d303a]">
                     <span className="text-[10px] bg-amber-500 text-black px-3 py-1 font-bold tracking-widest hover:bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                       VIEW
                     </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {data && !loading && (
          <div className="bg-[#15171e] p-6 border-t border-black/50">
            <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-2 font-bold">Terminal Summary</div>
            <div className="text-amber-200/80 leading-relaxed text-sm font-medium border-l-2 border-amber-500/50 pl-4 italic">
              "{data.summary}"
            </div>
          </div>
        )}
      </div>

      {selectedChange && (
        <ChangeDetailModal 
          change={selectedChange} 
          onClose={() => setSelectedChange(null)} 
        />
      )}
    </>
  );
};

export default AirportBoard;
