import { Smile, Frown, Zap, AlertTriangle, Meh, Angry } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface EmotionData {
  emotion: string;
  confidence: number;
  icon: React.ReactNode;
  color: string;
}

const emotionIcons: Record<string, React.ReactNode> = {
  Happy: <Smile className="w-8 h-8" />,
  Sad: <Frown className="w-8 h-8" />,
  Angry: <Angry className="w-8 h-8" />,
  Fear: <AlertTriangle className="w-8 h-8" />,
  Surprise: <Zap className="w-8 h-8" />,
  Neutral: <Meh className="w-8 h-8" />,
};

const emotionColors: Record<string, string> = {
  Happy: "text-emotion-happy",
  Sad: "text-emotion-sad",
  Angry: "text-emotion-angry",
  Fear: "text-emotion-fear",
  Surprise: "text-emotion-surprise",
  Neutral: "text-emotion-neutral",
};

interface EmotionResultProps {
  primaryEmotion: string;
  confidence: number;
  allEmotions: { emotion: string; confidence: number }[];
}

export function EmotionResult({ primaryEmotion, confidence, allEmotions }: EmotionResultProps) {
  return (
    <Card className="analysis-card">
      <CardHeader>
        <CardTitle className="text-xl">Emotion Analysis Results</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Primary Emotion */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={`p-6 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 ${emotionColors[primaryEmotion]}`}>
              {emotionIcons[primaryEmotion]}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-bold">{primaryEmotion}</h3>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {confidence}% Confidence
            </Badge>
          </div>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            The primary emotion detected in the audio sample shows {confidence}% confidence level based on our AI analysis.
          </p>
        </div>

        {/* Emotion Breakdown */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Detailed Breakdown</h4>
          
          <div className="space-y-3">
            {allEmotions
              .sort((a, b) => b.confidence - a.confidence)
              .map((emotion) => (
                <div key={emotion.emotion} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`${emotionColors[emotion.emotion]} flex-shrink-0`}>
                        {emotionIcons[emotion.emotion]}
                      </div>
                      <span className="font-medium">{emotion.emotion}</span>
                    </div>
                    <span className="text-sm font-mono font-semibold">
                      {emotion.confidence}%
                    </span>
                  </div>
                  <Progress
                    value={emotion.confidence}
                    className="h-2"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="p-4 bg-muted rounded-lg">
          <h5 className="font-semibold mb-2">Analysis Summary</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our AI model has analyzed the vocal patterns, tone, pitch, and speech characteristics 
            to determine the emotional state. The {primaryEmotion.toLowerCase()} emotion was detected 
            with high confidence based on multiple acoustic features.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}