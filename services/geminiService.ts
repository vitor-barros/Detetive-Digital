import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReason } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeContentWithGemini = async (text: string): Promise<{ reasons: AnalysisReason[], summary: string, isScam: boolean } | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analise o seguinte texto ou link em busca de sinais de golpe, phishing ou fraude digital voltado para o público brasileiro.
      
      Texto para análise: "${text}"

      Responda estritamente em JSON seguindo este schema. Seja direto e explique como se falasse com uma pessoa idosa.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_scam: { type: Type.BOOLEAN, description: "True se for provavel golpe" },
            risk_summary: { type: Type.STRING, description: "Um resumo de 1 ou 2 frases simples explicando o veredito" },
            detected_issues: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Explicação de um ponto suspeito específico"
              }
            }
          },
          required: ["is_scam", "risk_summary", "detected_issues"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;

    const data = JSON.parse(jsonText);
    
    const geminiReasons: AnalysisReason[] = data.detected_issues.map((issue: string, index: number) => ({
      id: `gemini_${index}`,
      message: issue,
      type: 'ai'
    }));

    return {
      reasons: geminiReasons,
      summary: data.risk_summary,
      isScam: data.is_scam
    };

  } catch (error) {
    console.error("Gemini analysis failed", error);
    return null;
  }
};