import { useState, useCallback } from "react";
import { Upload, FileAudio, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "@/hooks/useAnalysis";
import { analyzeAudio } from "@/services/api";

interface UploadAreaProps {
  onFileSelect?: (file: File) => void;
}

export function UploadArea({ onFileSelect }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addAnalysis, setAnalyzing, isAnalyzing, setError } = useAnalysis();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      setSelectedFile(audioFile);
      onFileSelect(audioFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive"
      });
    }
  }, [onFileSelect, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const removeFile = () => {
    setSelectedFile(null);
  };

  const analyzeFile = async () => {
    if (!selectedFile) return;

    try {
      setAnalyzing(true);
      setError(null);
      
      toast({
        title: "Analysis started",
        description: "Your audio file is being processed...",
      });

      const result = await analyzeAudio(selectedFile);
      addAnalysis(result);
      
      toast({
        title: "Analysis complete",
        description: `Detected emotion: ${result.primaryEmotion} (${result.confidence}% confidence)`,
      });
      
      navigate('/results');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze audio';
      setError(errorMessage);
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="p-8">
      {!selectedFile ? (
        <div
          className={`upload-area p-12 rounded-xl text-center transition-all ${
            isDragOver ? "drag-over" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Upload Audio File</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Drag and drop your audio file here, or click to browse. 
                Supports MP3, WAV, FLAC, and other common audio formats.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-primary hover:bg-primary-hover"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FileAudio className="mr-2 h-4 w-4" />
                Choose File
              </Button>
              
              <input
                id="file-input"
                type="file"
                accept="audio/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Maximum file size: 50MB
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-3">
              <FileAudio className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent-hover text-accent-foreground px-8"
              onClick={analyzeFile}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Emotion'
              )}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}