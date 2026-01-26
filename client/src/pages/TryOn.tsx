import { useState, useRef, useCallback } from "react";
import { useDesign } from "@/hooks/use-designs";
import { useRoute } from "wouter";
import Webcam from "react-webcam";
import Draggable from "react-draggable";
import { Loader2, ZoomIn, ZoomOut, RotateCw, RefreshCcw, Camera, Download, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function TryOn() {
  const [, params] = useRoute("/try-on/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: design, isLoading, error } = useDesign(id);
  
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.85);
  const webcamRef = useRef<Webcam>(null);
  
  const [cameraEnabled, setCameraEnabled] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    );
  }

  if (error || !design) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-display mb-4">Design Not Found</h2>
        <Link href="/gallery" className="text-accent hover:underline">Return to Gallery</Link>
      </div>
    );
  }

  const handleCapture = useCallback(() => {
    // In a real app, we'd compose the images.
    // Here we just trigger a "Saved" toast or similar action
    alert("In a production app, this would capture the composite image!");
  }, [webcamRef]);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden bg-black">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 bg-secondary/30 border-r border-white/10 p-6 flex flex-col gap-8 z-20 backdrop-blur-md overflow-y-auto">
        <div>
          <Link href="/gallery" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-white mb-6 uppercase tracking-wider transition-colors">
            <ChevronLeft className="w-3 h-3" /> Back to Gallery
          </Link>
          
          <h2 className="text-2xl font-display mb-1 text-white">Try On Studio</h2>
          <p className="text-xs text-muted-foreground line-clamp-2">{design.prompt}</p>
        </div>

        <div className="bg-black/40 p-4 border border-white/5 rounded-none">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Tattoo Controls</h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Size</span>
                <span>{Math.round(scale * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.2" 
                max="3" 
                step="0.1" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-white/10 appearance-none rounded-full cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rotation</span>
                <span>{rotation}°</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                step="5" 
                value={rotation} 
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full accent-white h-1 bg-white/10 appearance-none rounded-full cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Opacity</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05" 
                value={opacity} 
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-white h-1 bg-white/10 appearance-none rounded-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button 
            onClick={() => setCameraEnabled(!cameraEnabled)}
            className="w-full py-3 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" /> 
            {cameraEnabled ? "Disable Camera" : "Enable Camera"}
          </button>
          
          <button 
            onClick={handleCapture}
            className="w-full py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" /> Capture Photo
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 relative bg-black/80 flex items-center justify-center overflow-hidden">
        {cameraEnabled ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            videoConstraints={{ facingMode: "user" }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm uppercase tracking-widest">
            Camera Disabled
          </div>
        )}

        {/* Draggable Tattoo Overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Draggable bounds="parent">
            <div 
              className="absolute top-1/2 left-1/2 cursor-move pointer-events-auto origin-center touch-none"
              style={{
                transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
                opacity: opacity,
              }}
            >
              <img 
                src={design.imageUrl} 
                alt="Tattoo Overlay" 
                className="max-w-[300px] pointer-events-none mix-blend-multiply filter contrast-125 brightness-90"
                style={{ 
                  // mixBlendMode: 'multiply' works best on light skin, 'screen' on dark skin or black backgrounds. 
                  // For a general "ink" look on camera, 'multiply' with some opacity usually simulates ink better.
                  mixBlendMode: 'multiply'
                }}
              />
              
              {/* Visual guide for selection */}
              <div className="absolute inset-0 border border-white/30 rounded-none pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </Draggable>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-xs text-white/70 pointer-events-none">
          Drag to move • Use controls to resize
        </div>
      </div>
    </div>
  );
}
