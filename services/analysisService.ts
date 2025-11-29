import { AnalysisResult, AnalysisReason, RiskLevel } from '../types';
import { BLACKLISTED_DOMAINS, SUSPICIOUS_EXTENSIONS, SCAM_KEYWORDS, PRIZE_KEYWORDS } from '../constants';

const extractUrl = (text: string): string | null => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
};

export const analyzeContentLocal = (text: string): AnalysisResult => {
  const reasons: AnalysisReason[] = [];
  let score = 100; // 100 = Seguro/Confiável, 0 = Perigoso
  let riskLevel = RiskLevel.SAFE;

  const lowerText = text.toLowerCase();
  const url = extractUrl(text);

  // --- 1. Keyword Analysis ---
  let urgentCount = 0;
  SCAM_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) urgentCount++;
  });

  let prizeCount = 0;
  PRIZE_KEYWORDS.forEach(keyword => {
    if (lowerText.includes(keyword)) prizeCount++;
  });

  if (urgentCount > 0) {
    score -= urgentCount * 15;
    reasons.push({
      id: 'urgent_words',
      message: `Encontramos ${urgentCount} palavra(s) que indicam urgência ou ameaça (comum em golpes).`,
      type: 'keyword'
    });
  }

  if (prizeCount > 0) {
    score -= prizeCount * 15;
    reasons.push({
      id: 'prize_words',
      message: `Encontramos ${prizeCount} termo(s) prometendo prêmios ou dinheiro fácil.`,
      type: 'keyword'
    });
  }

  // --- 2. URL Analysis ---
  if (url) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // Check Blacklist
      if (BLACKLISTED_DOMAINS.some(d => domain.includes(d))) {
        score -= 100; // Penalidade máxima
        reasons.push({
          id: 'blacklist',
          message: `O domínio ${domain} está em nossa lista de sites perigosos conhecidos.`,
          type: 'blacklist'
        });
      }

      // Check Protocol
      if (urlObj.protocol === 'http:') {
        score -= 20;
        reasons.push({
          id: 'http',
          message: 'O link não usa conexão segura (HTTPS). Sites oficiais de bancos usam sempre HTTPS.',
          type: 'protocol'
        });
      }

      // Check Numbers in Domain
      const numCount = (domain.match(/\d/g) || []).length;
      if (numCount > 3) {
        score -= 25;
        reasons.push({
          id: 'numbers_domain',
          message: 'O endereço do site contém muitos números, o que é muito suspeito.',
          type: 'domain'
        });
      }

      // Check Hyphens
      const hyphenCount = (domain.match(/-/g) || []).length;
      if (hyphenCount > 2) {
        score -= 20;
        reasons.push({
          id: 'hyphens_domain',
          message: 'O endereço contém muitos hífens (-), técnica comum para imitar sites oficiais.',
          type: 'domain'
        });
      }

      // Check Extension
      if (SUSPICIOUS_EXTENSIONS.some(ext => domain.endsWith(ext))) {
        score -= 30;
        reasons.push({
          id: 'suspicious_extension',
          message: `O site termina com uma extensão incomum (${domain.split('.').pop()}), raramente usada por empresas sérias.`,
          type: 'domain'
        });
      }

      // Check IP address usage
      const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
      if (ipRegex.test(domain)) {
        score -= 80;
        reasons.push({
          id: 'ip_address',
          message: 'O link aponta para um endereço numérico (IP) em vez de um nome de site. Isso é extremamente perigoso.',
          type: 'domain'
        });
      }

      // Check shortened URLs (Simple check based on common domains)
      const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd'];
      if (shorteners.some(s => domain.includes(s))) {
        score -= 15;
        reasons.push({
          id: 'shortener',
          message: 'Link encurtado detectado. Golpistas usam isso para esconder o destino real.',
          type: 'heuristic'
        });
      }

    } catch (e) {
      score -= 10;
      reasons.push({
        id: 'invalid_url',
        message: 'O link parece estar mal formatado ou quebrado.',
        type: 'heuristic'
      });
    }
  } else if (lowerText.length < 10) {
    // Very short text without URL
    // Não penalizamos drasticamente, mas avisamos
    reasons.push({
      id: 'short_text',
      message: 'O texto é muito curto para uma análise precisa.',
      type: 'heuristic'
    });
  }

  // Garantir que o score fique entre 0 e 100
  score = Math.max(0, Math.min(100, score));

  // --- Determine Risk Level ---
  // Lógica Invertida:
  // 0 - 39: PERIGOSO (Score baixo = Segurança baixa)
  // 40 - 79: SUSPEITO
  // 80 - 100: SEGURO
  
  if (score < 40) {
    riskLevel = RiskLevel.DANGEROUS;
  } else if (score < 80) {
    riskLevel = RiskLevel.SUSPICIOUS;
  } else {
    riskLevel = RiskLevel.SAFE;
  }

  // Summary Logic
  let summary = '';
  if (riskLevel === RiskLevel.DANGEROUS) {
    summary = 'CUIDADO! O nível de segurança é muito baixo. Há fortes indícios de tentativa de golpe.';
  } else if (riskLevel === RiskLevel.SUSPICIOUS) {
    summary = 'ATENÇÃO. O nível de segurança é moderado. Encontramos sinais suspeitos, tenha cautela.';
  } else {
    summary = 'Nenhum sinal de fraude foi detectado nos padrões analisados. O conteúdo parece legítimo.';
  }

  return {
    riskLevel,
    score,
    reasons,
    summary,
    analyzedUrl: url || undefined
  };
};