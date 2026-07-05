import { Film, Tv, Globe, Tag, ExternalLink } from "lucide-react";
import { getStats } from "@/data/mediaData";

const Footer = () => {
  const stats = getStats();
  
  return (
    <footer className="border-t border-border/30 bg-card/30 mt-16">
      {/* Stats Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="p-2 rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-display text-2xl text-foreground">{stats.languages}</div>
              <div className="text-xs text-muted-foreground">Languages</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="p-2 rounded-lg bg-primary/10">
              <Film className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-display text-2xl text-foreground">{stats.movies}</div>
              <div className="text-xs text-muted-foreground">Movies</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="p-2 rounded-lg bg-primary/10">
              <Tv className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-display text-2xl text-foreground">{stats.tvShows}</div>
              <div className="text-xs text-muted-foreground">TV Shows</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="p-2 rounded-lg bg-primary/10">
              <Tag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-display text-2xl text-foreground">{stats.genres}</div>
              <div className="text-xs text-muted-foreground">Genres</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="border-t border-border/20 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© 2020-Present by Shoaib.</p>
          <a
            href="https://shoaibrayeen.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            <span>Portfolio</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
