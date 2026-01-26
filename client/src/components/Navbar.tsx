import { Link, useLocation } from "wouter";
import { PenTool, Camera, Grid } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/generate", label: "Generate", icon: PenTool },
    { href: "/gallery", label: "Gallery", icon: Grid },
    // { href: "/try-on", label: "Try On", icon: Camera }, // Hidden until we have an ID
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-3xl font-display font-black tracking-wider text-white group-hover:text-white/90 transition-colors">
            INK <span className="text-accent">DNA</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300",
                  "hover:bg-white/5",
                  isActive 
                    ? "text-white border-b-2 border-accent" 
                    : "text-muted-foreground hover:text-white"
                )}
              >
                <item.icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-current")} />
                <span className="hidden sm:inline-block uppercase tracking-widest text-xs font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
