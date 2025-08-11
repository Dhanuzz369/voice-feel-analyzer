import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UploadArea } from "@/components/dashboard/UploadArea";
import { RecentAnalyses } from "@/components/dashboard/RecentAnalyses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileAudio, TrendingUp, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Analyses",
    value: "156",
    icon: FileAudio,
    change: "+12% from last month"
  },
  {
    title: "Accuracy Rate",
    value: "94.2%",
    icon: Brain,
    change: "+2.1% improvement"
  },
  {
    title: "Processing Time", 
    value: "1.3s",
    icon: TrendingUp,
    change: "-0.4s faster"
  },
  {
    title: "Active Users",
    value: "2,847",
    icon: Users,
    change: "+8% this week"
  }
];

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

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
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground">Analyze emotions in speech with AI</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="analysis-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg">
                        <stat.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Action Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Upload Section */}
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-semibold">Analyze Your Audio</h2>
                    <p className="text-muted-foreground">
                      Upload an audio file to detect emotions using our advanced AI model
                    </p>
                  </div>
                  <UploadArea />
                </div>

                {/* Quick Start Guide */}
                <Card className="analysis-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="w-5 h-5" />
                      <span>How it works</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <FileAudio className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold">1. Upload</h4>
                        <p className="text-sm text-muted-foreground">
                          Select or drag your audio file
                        </p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-6 h-6 text-accent" />
                        </div>
                        <h4 className="font-semibold">2. Analyze</h4>
                        <p className="text-sm text-muted-foreground">
                          AI processes vocal patterns
                        </p>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold">3. Results</h4>
                        <p className="text-sm text-muted-foreground">
                          Get detailed emotion insights
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Analyses Sidebar */}
              <div className="space-y-6">
                <RecentAnalyses />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}