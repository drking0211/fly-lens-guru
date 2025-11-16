import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  isAnalyzing: boolean;
}

export const CameraCapture = ({ onCapture, isAnalyzing }: CameraCaptureProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onCapture(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Captured fly"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {!isAnalyzing && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleClearPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <button
          onClick={handleCameraClick}
          disabled={isAnalyzing}
          className="w-full aspect-square rounded-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-[var(--shadow-soft)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera className="w-20 h-20 text-primary-foreground" />
          <span className="text-xl font-semibold text-primary-foreground">
            Capture Fly
          </span>
        </button>
      )}
    </div>
  );
};
