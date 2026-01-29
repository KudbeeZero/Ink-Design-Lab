import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import Home from "@/pages/Home";
import Generate from "@/pages/Generate";
import Gallery from "@/pages/Gallery";
import TryOn from "@/pages/TryOn";
import NotFound from "@/pages/not-found";

function LandingPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white">
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-12 bg-gradient-to-br from-[#111] to-[#050505] border-r border-[#1a1a1a]">
        <h1 className="text-8xl font-tattoo text-[#FF0000] mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">INK DNA</h1>
        <p className="text-xl text-gray-400 font-display text-center max-w-md">
          Evolve your skin. AI-powered tattoo synthesis and real-time visualization.
        </p>
      </div>
      <div className="lg:w-1/2 flex flex-col justify-center items-center p-12">
        <div className="max-w-sm w-full space-y-8 text-center">
          <h2 className="text-3xl font-display text-white">Access the Studio</h2>
          <p className="text-gray-400">Log in with your Replit account to start generating and trying on unique ink.</p>
          <a 
            href="/api/login" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#FF0000] text-white hover:bg-[#CC0000] h-12 px-8 py-2 w-full active-elevate-2 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
          >
            Log In with Replit
          </a>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <Loader2 className="h-12 w-12 animate-spin text-[#FF0000]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/generate" component={Generate} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/try-on/:id" component={TryOn} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
