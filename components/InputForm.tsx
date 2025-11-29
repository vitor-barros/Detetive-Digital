import React, { useState } from 'react';

interface InputFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wide">
          Dados para Análise
        </label>
        <div className="relative">
          <textarea
            id="content"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole aqui o link suspeito, mensagem SMS ou e-mail que deseja verificar..."
            className="w-full h-32 p-4 text-base bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <p className="text-right text-xs text-slate-400 mt-2">
          Suporta links (URLs) e textos completos.
        </p>
      </div>

      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className={`w-full py-3.5 px-4 rounded-lg text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2
          ${!text.trim() || isLoading 
            ? 'bg-slate-300 cursor-not-allowed text-slate-500' 
            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:translate-y-0.5'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white/80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="tracking-wide">PROCESSANDO ANÁLISE...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <span className="tracking-wide">EXECUTAR VERIFICAÇÃO</span>
          </>
        )}
      </button>
    </form>
  );
};

export default InputForm;