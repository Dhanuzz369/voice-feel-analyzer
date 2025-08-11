import { AnalysisResult, EmotionData } from '@/hooks/useAnalysis';

const API_BASE_URL = 'http://localhost:5000';

export interface ApiResponse {
  emotion: string;
  confidence: number;
  emotions: {
    [key: string]: number;
  };
  duration?: string;
  processing_time?: string;
}

export const analyzeAudio = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // Convert API response to our format
    const allEmotions: EmotionData[] = Object.entries(data.emotions)
      .map(([emotion, confidence]) => ({ emotion, confidence: Math.round(confidence * 100) }))
      .sort((a, b) => b.confidence - a.confidence);

    const result: AnalysisResult = {
      id: Date.now().toString(),
      filename: file.name,
      primaryEmotion: data.emotion,
      confidence: Math.round(data.confidence * 100),
      allEmotions,
      timestamp: new Date().toLocaleString(),
      duration: data.duration || '0:00',
      processingTime: data.processing_time || '1.2s',
      audioUrl: URL.createObjectURL(file), // Create local URL for playback
    };

    return result;
  } catch (error) {
    console.error('Error analyzing audio:', error);
    throw new Error('Failed to analyze audio. Please check if the backend server is running on localhost:5000');
  }
};

export const downloadReport = (analysis: AnalysisResult, format: 'json' | 'pdf' = 'json') => {
  if (format === 'json') {
    const report = {
      filename: analysis.filename,
      timestamp: analysis.timestamp,
      primaryEmotion: analysis.primaryEmotion,
      confidence: analysis.confidence,
      allEmotions: analysis.allEmotions,
      duration: analysis.duration,
      processingTime: analysis.processingTime,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-analysis-${analysis.filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};