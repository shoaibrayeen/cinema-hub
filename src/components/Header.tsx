import { Link, useLocation } from "react-router-dom";
import { Film, Tv, Home, Play } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/95 to-transparent">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-red rounded-lg shadow-glow group-hover:scale-105 transition-transform">
            <Play className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="font-display text-2xl tracking-wider text-foreground">
            CINEMAHUB
          </span>
        </Link>
        
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isActive("/")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link
            to="/movies"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isActive("/movies")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Film className="h-4 w-4" />
            <span className="hidden sm:inline">Movies</span>
          </Link>
          
          <Link
            to="/tv-shows"
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              isActive("/tv-shows")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Tv className="h-4 w-4" />
            <span className="hidden sm:inline">TV Shows</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
