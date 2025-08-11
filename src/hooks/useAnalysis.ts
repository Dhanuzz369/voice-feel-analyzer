import { create } from 'zustand';

export interface EmotionData {
  emotion: string;
  confidence: number;
}

export interface AnalysisResult {
  id: string;
  filename: string;
  primaryEmotion: string;
  confidence: number;
  allEmotions: EmotionData[];
  timestamp: string;
  duration?: string;
  audioUrl?: string;
  processingTime?: string;
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null;
  recentAnalyses: AnalysisResult[];
  isAnalyzing: boolean;
  error: string | null;
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  addAnalysis: (analysis: AnalysisResult) => void;
  setAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentAnalysis: () => void;
}

export const useAnalysis = create<AnalysisState>((set, get) => ({
  currentAnalysis: null,
  recentAnalyses: [
    {
      id: '1',
      filename: 'meeting_audio.wav',
      primaryEmotion: 'Neutral',
      confidence: 92,
      allEmotions: [
        { emotion: 'Neutral', confidence: 92 },
        { emotion: 'Calm', confidence: 5 },
        { emotion: 'Happy', confidence: 3 }
      ],
      timestamp: '2024-01-15 10:30 AM',
      duration: '2:45'
    },
    {
      id: '2',
      filename: 'presentation_clip.mp3',
      primaryEmotion: 'Happy',
      confidence: 87,
      allEmotions: [
        { emotion: 'Happy', confidence: 87 },
        { emotion: 'Excited', confidence: 8 },
        { emotion: 'Neutral', confidence: 5 }
      ],
      timestamp: '2024-01-14 3:15 PM',
      duration: '1:20'
    }
  ],
  isAnalyzing: false,
  error: null,
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  addAnalysis: (analysis) => {
    const { recentAnalyses } = get();
    set({ 
      recentAnalyses: [analysis, ...recentAnalyses].slice(0, 10),
      currentAnalysis: analysis 
    });
  },
  setAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setError: (error) => set({ error }),
  clearCurrentAnalysis: () => set({ currentAnalysis: null }),
}));