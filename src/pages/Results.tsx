import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { EmotionResult } from "@/components/analysis/EmotionResult";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Share, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "@/hooks/useAnalysis";
import { downloadReport } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentAnalysis } = useAnalysis();

  useEffect(() => {
    if (!currentAnalysis) {
      navigate('/dashboard');
    }
  }, [currentAnalysis, navigate]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownloadReport = () => {
    if (currentAnalysis) {
      downloadReport(currentAnalysis, 'json');
      toast({
        title: "Report downloaded",
        description: "Analysis report has been saved as JSON file",
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentAnalysis) {
    return null;
  }

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
                 <Button variant="outline" onClick={handleDownloadReport}>
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
                       <h3 className="font-semibold text-xl">{currentAnalysis.filename}</h3>
                       <p className="text-muted-foreground">Duration: {currentAnalysis.duration}</p>
                     </div>

                     {/* Hidden Audio Element */}
                     {currentAnalysis.audioUrl && (
                       <audio
                         ref={audioRef}
                         src={currentAnalysis.audioUrl}
                         onTimeUpdate={handleTimeUpdate}
                         onLoadedMetadata={handleLoadedMetadata}
                         onEnded={() => setIsPlaying(false)}
                         className="hidden"
                       />
                     )}

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
                           <div 
                             className="bg-primary h-2 rounded-full transition-all" 
                             style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                           />
                         </div>
                         <div className="flex justify-between text-sm text-muted-foreground">
                           <span>{formatTime(currentTime)}</span>
                           <span>{currentAnalysis.duration}</span>
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
                         <p className="font-semibold">{currentAnalysis.processingTime || '1.2s'}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

               {/* Right Column - Emotion Results */}
               <div>
                 <EmotionResult
                   primaryEmotion={currentAnalysis.primaryEmotion}
                   confidence={currentAnalysis.confidence}
                   allEmotions={currentAnalysis.allEmotions}
                 />
               </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}