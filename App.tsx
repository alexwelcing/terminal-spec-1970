
import React, { useState } from 'react';
import AirportBoard from './components/AirportBoard';
import { compareSpecs } from './services/gemini';
import { ComparisonResult } from './types';

const App: React.FC = () => {
  const [yamlOld, setYamlOld] = useState('');
  const [yamlNew, setYamlNew] = useState('');
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!yamlOld || !yamlNew) {
      setError("Both source and destination specifications are required.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await compareSpecs(yamlOld, yamlNew);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while comparing specifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setter(ev.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-10">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <div className="inline-block bg-[#1a1c23] px-6 py-2 border-2 border-amber-500 mb-4 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-amber-500 flex items-center gap-4">
            <span className="text-2xl">✈</span> 
            TERMINAL SPEC 1970
          </h1>
        </div>
        <p className="text-gray-500 tracking-[0.3em] uppercase text-xs font-bold">
          High-Fidelity OpenAPI Specification Comparison Engine
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-12">
        {/* Input Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input A */}
          <div className="bg-[#1a1c23] p-6 border border-[#2d303a] relative group">
            <div className="absolute -top-3 left-4 bg-[#1a1c23] px-2 text-[10px] text-amber-500 font-bold tracking-widest">SOURCE_SPEC (V-OLD)</div>
            <textarea
              className="w-full h-64 bg-black/40 border border-[#2d303a] p-4 text-xs font-mono text-gray-300 focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="Paste Old OpenAPI YAML here..."
              value={yamlOld}
              onChange={(e) => setYamlOld(e.target.value)}
            />
            <div className="mt-4 flex justify-between items-center">
               <input 
                type="file" 
                id="file-old" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, setYamlOld)} 
                accept=".yaml,.yml,.json"
              />
              <label 
                htmlFor="file-old"
                className="text-[10px] text-gray-500 hover:text-amber-500 cursor-pointer font-bold uppercase tracking-widest border-b border-gray-800 pb-1"
              >
                Upload File
              </label>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                {yamlOld.length > 0 ? `${yamlOld.length} BYTES` : 'EMPTY'}
              </div>
            </div>
          </div>

          {/* Input B */}
          <div className="bg-[#1a1c23] p-6 border border-[#2d303a] relative group">
            <div className="absolute -top-3 left-4 bg-[#1a1c23] px-2 text-[10px] text-amber-500 font-bold tracking-widest">DEST_SPEC (V-NEW)</div>
            <textarea
              className="w-full h-64 bg-black/40 border border-[#2d303a] p-4 text-xs font-mono text-gray-300 focus:outline-none focus:border-amber-500/50 resize-none"
              placeholder="Paste New OpenAPI YAML here..."
              value={yamlNew}
              onChange={(e) => setYamlNew(e.target.value)}
            />
             <div className="mt-4 flex justify-between items-center">
               <input 
                type="file" 
                id="file-new" 
                className="hidden" 
                onChange={(e) => handleFileUpload(e, setYamlNew)} 
                accept=".yaml,.yml,.json"
              />
              <label 
                htmlFor="file-new"
                className="text-[10px] text-gray-500 hover:text-amber-500 cursor-pointer font-bold uppercase tracking-widest border-b border-gray-800 pb-1"
              >
                Upload File
              </label>
              <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                {yamlNew.length > 0 ? `${yamlNew.length} BYTES` : 'EMPTY'}
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="flex flex-col items-center">
           <button
            onClick={handleCompare}
            disabled={loading}
            className={`
              px-12 py-4 
              bg-amber-500 text-black 
              font-black text-lg 
              uppercase tracking-[0.4em]
              hover:bg-amber-400 
              active:scale-95 transition-all
              shadow-[0_4px_0_#92400e]
              hover:shadow-[0_2px_0_#92400e]
              hover:translate-y-[2px]
              disabled:opacity-50 disabled:cursor-not-allowed
              relative
            `}
          >
            {loading ? 'Processing...' : 'Analyze Changes'}
            {/* Retro button shine */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/40"></div>
          </button>
          
          {error && (
            <div className="mt-6 text-red-500 font-bold text-xs uppercase tracking-widest animate-bounce">
              ERROR: {error}
            </div>
          )}
        </div>

        {/* Results Board */}
        <AirportBoard data={result} loading={loading} />

        {/* Footer Credit */}
        <footer className="text-center text-gray-700 text-[10px] font-bold uppercase tracking-[0.5em] mt-20">
          International Engineering Standards &copy; 1970-1979
        </footer>
      </main>
    </div>
  );
};

export default App;
