import { Design } from "@shared/schema";
import { Link } from "wouter";
import { Eye, Camera, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface DesignCardProps {
  design: Design;
}

export function DesignCard({ design }: DesignCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative aspect-square overflow-hidden bg-secondary border border-white/5 shadow-lg hover:shadow-2xl hover:border-white/20 transition-all duration-500"
    >
      <img 
        src={design.imageUrl} 
        alt={design.prompt} 
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h3 className="font-display text-lg text-white line-clamp-1 mb-1">{design.style} Style</h3>
        <p className="text-xs text-gray-300 mb-4 line-clamp-2 font-mono uppercase tracking-wide opacity-80">{design.prompt}</p>
        
        <div className="flex gap-2">
          <Link href={`/try-on/${design.id}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 px-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
              <Camera className="w-3 h-3" /> Try On
            </button>
          </Link>
        </div>
        
        <div className="absolute top-4 right-4 text-[10px] font-mono text-white/50 border border-white/10 px-2 py-1 bg-black/50 backdrop-blur-sm">
           {format(new Date(design.createdAt), "MM.dd.yy")}
        </div>
      </div>
    </motion.div>
  );
}
