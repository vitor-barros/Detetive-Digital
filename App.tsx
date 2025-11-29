import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import { analyzeContentLocal } from './services/analysisService';
import { analyzeContentWithGemini } from './services/geminiService';
import { AnalysisResult, RiskLevel } from './types';

// Icons components
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);

const BankIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21v-7"/><path d="M19 21v-7"/><path d="M2 10h20"/><path d="M12 3L2 10"/><path d="M12 3l10 7"/><path d="M12 3v7"/></svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const App: React.FC = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (text: string) => {
    setLoading(true);
    setResult(null);

    try {
      // 1. Executa análise local primeiro
      const localResult = analyzeContentLocal(text);
      let finalResult = localResult;

      // 2. Tenta executar análise de IA
      if (process.env.API_KEY) {
        const geminiData = await analyzeContentWithGemini(text);
        
        if (geminiData) {
          let newScore = localResult.score;
          let newRiskLevel = localResult.riskLevel;

          // REGRA DE SOBRESCRITA DA IA:
          // Se a IA diz que é GOLPE (isScam = true), forçamos o score para 0 (Perigoso),
          // ignorando a nota alta da análise local que pode ter falhado.
          if (geminiData.isScam) {
            newScore = 0;
            newRiskLevel = RiskLevel.DANGEROUS;
          } else if (geminiData.reasons.length > 0) {
            // Se a IA achou problemas mas não cravou que é golpe,
            // reduzimos o score proporcionalmente
            newScore = Math.max(0, newScore - (geminiData.reasons.length * 15));
            
            // Recalcula o nível de risco com base no novo score
            if (newScore < 40) newRiskLevel = RiskLevel.DANGEROUS;
            else if (newScore < 80) newRiskLevel = RiskLevel.SUSPICIOUS;
          }

          finalResult = {
            ...localResult,
            score: newScore,
            riskLevel: newRiskLevel,
            reasons: [...localResult.reasons, ...geminiData.reasons],
            summary: geminiData.summary // Usamos o resumo da IA que costuma ser mais explicativo
          };
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      setResult(finalResult);

    } catch (error) {
      console.error("Error analyzing:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12 font-sans">
      {/* Header Moderno */}
      <header className="bg-slate-900 text-white py-5 shadow-lg border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <ShieldIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide text-white">Detetive Digital</h1>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Verificador de Segurança</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 mt-10">
        
        {!result ? (
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Intro Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Análise de Segurança</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Utilize nossa ferramenta para verificar links ou mensagens suspeitas. 
                Nossa tecnologia analisa padrões de fraude, reputação de domínio e linguagem persuasiva.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-blue-600 mb-1"><LockIcon /></div>
                  <h3 className="font-semibold text-sm">Verificação de Link</h3>
                  <p className="text-xs text-slate-500">Checagem de protocolos de segurança e domínios falsos.</p>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-blue-600 mb-1"><AlertIcon /></div>
                  <h3 className="font-semibold text-sm">Detecção de Fraude</h3>
                  <p className="text-xs text-slate-500">Identificação de promessas falsas e senso de urgência.</p>
                </div>
                <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-blue-600 mb-1"><CheckCircleIcon /></div>
                  <h3 className="font-semibold text-sm">Relatório Claro</h3>
                  <p className="text-xs text-slate-500">Explicação detalhada sobre os riscos encontrados.</p>
                </div>
              </div>
            </div>

            <InputForm onAnalyze={handleAnalyze} isLoading={loading} />
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
             <ResultCard result={result} />
             
             <button 
               onClick={handleReset}
               className="group w-full py-4 px-6 rounded-lg text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
             >
               <RefreshIcon />
               Realizar nova análise
             </button>

             {/* Modern Safety Tips */}
             <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">Diretrizes de Segurança</h3>
                <div className="grid md:grid-cols-2 gap-4">
                   <div className="flex items-start gap-4 bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-md shrink-0">
                        <BankIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">Instituições Bancárias</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Bancos oficiais jamais solicitam senhas, tokens ou transferências de teste via WhatsApp ou SMS.</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-4 bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-md shrink-0">
                        <ClockIcon />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm mb-1">Senso de Urgência</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Golpistas criam situações de emergência para evitar que você pense. Pare, respire e verifique.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

      </main>
      
      <footer className="mt-16 text-center text-slate-400 text-xs py-8 border-t border-slate-200 bg-slate-50">
        <p className="font-medium">Detetive Digital &copy; {new Date().getFullYear()}</p>
        <p className="mt-2 opacity-75">Ferramenta auxiliar de análise. Sempre verifique com canais oficiais.</p>
      </footer>
    </div>
  );
};

export default App;