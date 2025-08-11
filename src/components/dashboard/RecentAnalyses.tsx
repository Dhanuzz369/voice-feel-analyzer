import { Play, BarChart3, Download, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Analysis {
  id: string;
  filename: string;
  emotion: string;
  confidence: number;
  timestamp: string;
  duration: string;
}

const mockAnalyses: Analysis[] = [
  {
    id: "1",
    filename: "meeting_recording.wav",
    emotion: "Neutral",
    confidence: 92,
    timestamp: "2 hours ago",
    duration: "2:34"
  },
  {
    id: "2", 
    filename: "presentation_clip.mp3",
    emotion: "Happy",
    confidence: 87,
    timestamp: "1 day ago",
    duration: "1:12"
  },
  {
    id: "3",
    filename: "interview_sample.wav",
    emotion: "Nervous",
    confidence: 78,
    timestamp: "3 days ago",
    duration: "4:56"
  }
];

const getEmotionColor = (emotion: string) => {
  const colors: Record<string, string> = {
    Happy: "bg-emotion-happy text-white",
    Sad: "bg-emotion-sad text-white", 
    Angry: "bg-emotion-angry text-white",
    Fear: "bg-emotion-fear text-white",
    Surprise: "bg-emotion-surprise text-white",
    Neutral: "bg-emotion-neutral text-white",
    Nervous: "bg-destructive text-destructive-foreground"
  };
  return colors[emotion] || "bg-muted text-muted-foreground";
};

export function RecentAnalyses() {
  return (
    <Card className="analysis-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Analyses</CardTitle>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          View All
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {mockAnalyses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No analyses yet. Upload your first audio file to get started!</p>
          </div>
        ) : (
          mockAnalyses.map((analysis) => (
            <div
              key={analysis.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-primary">
                  <Play className="w-4 h-4" />
                </Button>
                
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{analysis.filename}</p>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{analysis.timestamp}</span>
                    <span>•</span>
                    <span>{analysis.duration}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <Badge 
                    className={`${getEmotionColor(analysis.emotion)} mb-1`}
                    variant="secondary"
                  >
                    {analysis.emotion}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {analysis.confidence}% confidence
                  </p>
                </div>
                
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}