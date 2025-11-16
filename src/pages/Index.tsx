import { useState } from "react";
import { CameraCapture } from "@/components/CameraCapture";
import { FlyResult } from "@/components/FlyResult";
import { InstallPrompt } from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

interface FlyInfo {
  name: string;
  type: string;
  confidence: "high" | "medium" | "low";
  description: string;
  conditions: string;
  targetSpecies: string[];
  techniques: string;
  hookSize: string;
  similarPatterns?: string[];
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flyInfo, setFlyInfo] = useState<FlyInfo | null>(null);

  const handleCapture = async (imageData: string) => {
    setIsAnalyzing(true);
    setFlyInfo(null);

    try {
      const { data, error } = await supabase.functions.invoke('identify-fly', {
        body: { imageData }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setFlyInfo(data);
      toast.success("Fly identified successfully!");
    } catch (error) {
      console.error("Error identifying fly:", error);
      toast.error("Failed to identify fly. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFlyInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <InstallPrompt />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-3 tracking-tight">
            Fly Identifier
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Identify fly fishing lures instantly with AI-powered recognition
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {flyInfo ? (
            <>
              <Button
                onClick={handleReset}
                variant="outline"
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Identify Another Fly
              </Button>
              <FlyResult flyInfo={flyInfo} />
            </>
          ) : (
            <>
              <CameraCapture onCapture={handleCapture} isAnalyzing={isAnalyzing} />
              
              {isAnalyzing && (
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                  <p className="text-lg text-muted-foreground">
                    Analyzing fly pattern...
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-semibold text-foreground mb-3">How to Use</h2>
                <ol className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">1.</span>
                    <span>Tap the camera button to capture or upload a photo of your fly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">2.</span>
                    <span>Wait a few seconds while our AI analyzes the pattern</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary">3.</span>
                    <span>Get detailed information about the fly and how to use it</span>
                  </li>
                </ol>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pb-4 border-t border-border/50 pt-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="text-center">
              <div className="font-bold text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                genesoft
              </div>
              <div className="text-[10px] text-muted-foreground font-mono leading-tight">
                AI_Powered_by_AI_
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Genesoft Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
