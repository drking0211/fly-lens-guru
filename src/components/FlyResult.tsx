import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fish, Droplets, Clock, Target } from "lucide-react";

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

interface FlyResultProps {
  flyInfo: FlyInfo;
}

export const FlyResult = ({ flyInfo }: FlyResultProps) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-secondary text-secondary-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl text-primary">{flyInfo.name}</CardTitle>
              <p className="text-muted-foreground mt-1">{flyInfo.type}</p>
            </div>
            <Badge className={getConfidenceColor(flyInfo.confidence)}>
              {flyInfo.confidence} confidence
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{flyInfo.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Droplets className="w-5 h-5" />
                <h3 className="font-semibold">Conditions</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {flyInfo.conditions}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Fish className="w-5 h-5" />
                <h3 className="font-semibold">Target Species</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {flyInfo.targetSpecies.map((species, idx) => (
                  <Badge key={idx} variant="secondary">
                    {species}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-5 h-5" />
              <h3 className="font-semibold">Techniques</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {flyInfo.techniques}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <h3 className="font-semibold">Hook Size</h3>
            </div>
            <p className="text-sm text-muted-foreground">{flyInfo.hookSize}</p>
          </div>

          {flyInfo.similarPatterns && flyInfo.similarPatterns.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Similar Patterns</h3>
              <div className="flex flex-wrap gap-2">
                {flyInfo.similarPatterns.map((pattern, idx) => (
                  <Badge key={idx} variant="outline">
                    {pattern}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
