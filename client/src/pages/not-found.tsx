import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center p-8 border border-white/10 bg-secondary/50 backdrop-blur-sm max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-16 w-16 text-accent" />
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page you're looking for has vanished into the void.
        </p>

        <Link href="/">
          <button className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
