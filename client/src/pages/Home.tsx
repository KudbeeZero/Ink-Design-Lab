import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center py-20 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(20,20,20,0)_0%,rgba(0,0,0,1)_100%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
        </div>

        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black tracking-tighter mb-6 neon-glow">
              INK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">DNA</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light tracking-wide">
              Generate unique, AI-powered tattoo designs tailored to your vision. 
              Visualize them on your body instantly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/generate">
                <button className="group relative px-8 py-4 bg-white text-black text-lg font-bold uppercase tracking-widest hover:bg-gray-200 transition-all duration-300 min-w-[200px]">
                  <span className="flex items-center justify-center gap-2">
                    Start Inking <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 border border-white/50 scale-105 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </button>
              </Link>
              
              <Link href="/gallery">
                <button className="px-8 py-4 bg-transparent border border-white/20 text-white text-lg font-bold uppercase tracking-widest hover:bg-white/5 hover:border-white/50 transition-all duration-300 min-w-[200px]">
                  View Gallery
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="border-y border-white/10 bg-black/50 backdrop-blur-sm py-12">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature 
            icon={Zap} 
            title="Instant Generation" 
            desc="Describe your vision and watch AI bring it to life in seconds." 
          />
          <Feature 
            icon={Sparkles} 
            title="Unique Styles" 
            desc="From Neo-traditional to Cyberpunk, choose your aesthetic." 
          />
          <Feature 
            icon={Shield} 
            title="Try Before Ink" 
            desc="Use AR technology to visualize the tattoo on your skin." 
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="w-12 h-12 bg-white/5 rounded-none border border-white/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-display mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
