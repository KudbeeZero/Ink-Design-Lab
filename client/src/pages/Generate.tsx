import { useState } from "react";
import { useGenerateDesign } from "@/hooks/use-designs";
import { useLocation } from "wouter";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const STYLES = [
  "Blackwork",
  "Neo-traditional", 
  "Japanese Irezumi",
  "Realistic",
  "Minimalist",
  "Geometric",
  "Watercolor",
  "Cyberpunk",
  "Tribal",
  "Old School"
];

export default function Generate() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [, setLocation] = useLocation();
  
  const { mutate, isPending, error } = useGenerateDesign();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    
    mutate({ prompt, style }, {
      onSuccess: (data) => {
        // Just redirect to the try-on page for the new design
        setLocation(`/try-on/${data.id}`);
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display mb-4">Create Your Design</h1>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Describe your dream tattoo and select a style. Our AI will generate a unique design just for you.
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 relative overflow-hidden">
          {/* Subtle decorative border corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/50" />

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Describe your tattoo
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. A fierce dragon wrapped around a dagger with cherry blossoms..."
                className="w-full h-32 bg-black/50 border border-white/10 p-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-colors resize-none font-light"
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Select Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium border transition-all duration-200 text-center",
                      style === s
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-muted-foreground border-white/10 hover:border-white/30 hover:text-white"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-900/20 border border-red-900/50 p-4 flex items-center gap-3 text-red-200 text-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error.message}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending || !prompt}
              className={cn(
                "w-full py-5 text-lg font-bold uppercase tracking-[0.2em] transition-all duration-300 relative group overflow-hidden",
                isPending ? "bg-white/10 text-white/50 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"
              )}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3 relative z-10">
                  <Sparkles className="w-5 h-5" /> Generate Tattoo
                </span>
              )}
              
              {/* Shine effect on hover */}
              {!isPending && (
                <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-shine" />
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
