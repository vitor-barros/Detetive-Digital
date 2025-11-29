import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { riskLevel, summary, reasons } = result;

  let theme = {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    accent: 'bg-slate-500',
    label: 'Inconclusivo',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  };

  switch (riskLevel) {
    case RiskLevel.DANGEROUS:
      theme = {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-900',
        accent: 'bg-red-600',
        label: 'Alto Risco Detectado',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      };
      break;
    case RiskLevel.SUSPICIOUS:
      theme = {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-900',
        accent: 'bg-orange-500',
        label: 'Suspeito - Tenha Cautela',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      };
      break;
    case RiskLevel.SAFE:
      theme = {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-900',
        accent: 'bg-emerald-600',
        label: 'Seguro',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
      };
      break;
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Status Header */}
      <div className={`px-6 py-5 border-b ${theme.border} ${theme.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
           <div className={`p-2 rounded-full text-white shadow-sm ${theme.accent}`}>
             {theme.icon}
           </div>
           <div>
             <h2 className={`text-lg font-bold uppercase tracking-tight ${theme.text}`}>{theme.label}</h2>
             <p className="text-xs text-slate-500 font-medium mt-0.5">Relatório de Análise</p>
           </div>
        </div>
        <div className={`hidden sm:block px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${theme.accent}`}>
          Nível de Segurança: {result.score}/100
        </div>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="mb-8">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-2">Resumo Executivo</h3>
           <p className={`text-lg font-medium leading-relaxed ${theme.text}`}>
             {summary}
           </p>
        </div>

        {/* Detailed Reasons */}
        {reasons.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">Indicadores Detectados</h3>
            <div className="space-y-3">
              {reasons.map((reason) => (
                <div key={reason.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 items-start">
                  <div className="mt-0.5 text-slate-400 shrink-0">
                    {reason.type === 'ai' ? (
                       // AI Brain Icon
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16v-4"/><path d="M12 8h.01"/><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
                    ) : (
                       // Search/Loupe Icon
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    )}
                  </div>
                  <div className="flex-1">
                     <p className="text-sm text-slate-700 font-medium leading-relaxed">{reason.message}</p>
                     <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-1 block">Fonte: {reason.type === 'ai' ? 'Inteligência Artificial' : 'Análise Estática'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Safe State Empty Message */}
        {riskLevel === RiskLevel.SAFE && reasons.length === 0 && (
          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-800 text-sm">
             Nenhum indicador técnico de fraude foi encontrado. O link ou mensagem analisado não apresenta características típicas de golpes conhecidos.
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;