export enum RiskLevel {
  SAFE = 'SAFE',
  SUSPICIOUS = 'SUSPICIOUS',
  DANGEROUS = 'DANGEROUS',
  UNKNOWN = 'UNKNOWN'
}

export interface AnalysisReason {
  id: string;
  message: string;
  type: 'protocol' | 'domain' | 'keyword' | 'blacklist' | 'heuristic' | 'ai';
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  score: number; // 0 to 100
  reasons: AnalysisReason[];
  summary: string;
  analyzedUrl?: string;
}

export interface GeminiAnalysisResponse {
  riskLevel: string;
  reasoning: string;
  isScam: boolean;
}