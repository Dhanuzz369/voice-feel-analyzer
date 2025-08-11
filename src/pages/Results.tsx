import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EmotionResult } from "@/components/analysis/EmotionResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Share, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demonstration
const mockAnalysis = {
  filename: "presentation_recording.wav",
  primaryEmotion: "Happy",
  confidence: 87,
  duration: "3:42",
  allEmotions: [
    { emotion: "Happy", confidence: 87 },
    { emotion: "Neutral", confidence: 9 },
    { emotion: "Surprise", confidence: 4 }
  ]
};

export default function Results() {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const downloadReport = () => {
    // Mock download functionality
    console.log("Downloading report...");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1">
          {/* Header */}
          <header className="border-b bg-card/30 backdrop-blur-sm sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/dashboard")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Audio Player & Waveform */}
              <div className="space-y-6">
                <Card className="analysis-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Audio Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* File Info */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-xl">{mockAnalysis.filename}</h3>
                      <p className="text-muted-foreground">Duration: {mockAnalysis.duration}</p>
                    </div>

                    {/* Audio Player */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Button
                          onClick={togglePlay}
                          size="lg"
                          className="w-16 h-16 rounded-full bg-primary hover:bg-primary-hover"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8 ml-1" />
                          )}
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "35%" }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>1:18</span>
                          <span>{mockAnalysis.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Waveform Visualization */}
                    <div className="waveform-container p-6">
                      <h4 className="font-semibold mb-4">Audio Waveform</h4>
                      <div className="h-32 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-lg flex items-end justify-center space-x-1 p-4">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <div
                            key={i}
                            className="bg-primary rounded-full w-1"
                            style={{
                              height: `${Math.random() * 60 + 20}%`,
                              opacity: i < 17 ? 0.5 : 1
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Metadata */}
                <Card className="analysis-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Analysis Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">File Format</p>
                        <p className="font-semibold">WAV</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Sample Rate</p>
                        <p className="font-semibold">44.1 kHz</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Channels</p>
                        <p className="font-semibold">Mono</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Processing Time</p>
                        <p className="font-semibold">1.2s</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Emotion Results */}
              <div>
                <EmotionResult
                  primaryEmotion={mockAnalysis.primaryEmotion}
                  confidence={mockAnalysis.confidence}
                  allEmotions={mockAnalysis.allEmotions}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}