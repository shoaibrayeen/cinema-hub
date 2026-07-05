import { Badge } from "@/components/ui/badge";
import { Calendar, Hash, Play, Check, Clock, Bookmark } from "lucide-react";
import { type Platform, type WatchStatus, getPlatformColor } from "@/data/mediaData";

interface MediaCardProps {
  name: string;
  genre: string[];
  year: number | string;
  seasons?: number;
  platform?: Platform;
  status?: WatchStatus;
  index: number;
}

const statusConfig: Record<WatchStatus, { icon: typeof Check; label: string; className: string }> = {
  Watched: { icon: Check, label: "Watched", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  Watching: { icon: Play, label: "Watching", className: "bg-primary/20 text-primary border-primary/30" },
  Planned: { icon: Bookmark, label: "Planned", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
};

const MediaCard = ({ name, genre, year, seasons, platform, status, index }: MediaCardProps) => {
  const StatusIcon = status ? statusConfig[status].icon : null;
  
  return (
    <div
      className="group relative flex-shrink-0 w-[280px] bg-gradient-card border border-border/30 rounded-lg overflow-hidden shadow-card transition-all duration-300 hover:shadow-hover hover:border-primary/40 hover:-translate-y-1 hover:scale-[1.02] animate-fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Top gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="p-4 space-y-3">
        {/* Header with platform and status */}
        <div className="flex items-start justify-between gap-2">
          {platform && (
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${getPlatformColor(platform)} text-white`}>
              {platform}
            </span>
          )}
          {status && StatusIcon && (
            <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded border ${statusConfig[status].className}`}>
              <StatusIcon className="h-3 w-3" />
              {status}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-foreground leading-tight min-h-[2.5rem] line-clamp-2 text-sm">
          {name}
        </h3>
        
        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {genre.slice(0, 2).map((g) => (
            <Badge
              key={g}
              variant="secondary"
              className="text-[10px] font-medium bg-muted/80 text-muted-foreground border-0 px-2 py-0"
            >
              {g}
            </Badge>
          ))}
          {genre.length > 2 && (
            <Badge variant="secondary" className="text-[10px] bg-muted/50 text-muted-foreground border-0 px-2 py-0">
              +{genre.length - 2}
            </Badge>
          )}
        </div>
        
        {/* Footer metadata */}
        <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground border-t border-border/30">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{year}</span>
          </div>
          
          {seasons !== undefined && (
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              <span>{seasons}S</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Hover play icon overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-glow">
          <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
