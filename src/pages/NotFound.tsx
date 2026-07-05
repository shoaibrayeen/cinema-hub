import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, Home, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Clapperboard = () => (
  <svg viewBox="0 0 220 170" className="w-56 md:w-64 h-auto mx-auto mb-8" aria-hidden="true">
    {/* Clap stick (animated) */}
    <g>
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 28 78; -22 28 78; 0 28 78; -22 28 78; 0 28 78; 0 28 78"
        keyTimes="0; 0.08; 0.16; 0.24; 0.32; 1"
        dur="3.5s"
        repeatCount="indefinite"
      />
      <rect x="20" y="56" width="180" height="24" rx="4" fill="#262626" stroke="#3f3f3f" />
      <polygon points="30,56 62,56 46,80 14,80" fill="#f5f5f5" transform="translate(10,0)" />
      <polygon points="94,56 126,56 110,80 78,80" fill="#f5f5f5" transform="translate(10,0)" />
      <polygon points="158,56 190,56 174,80 142,80" fill="#f5f5f5" transform="translate(10,0)" />
    </g>

    {/* Board */}
    <rect x="20" y="82" width="180" height="76" rx="6" fill="#262626" stroke="#3f3f3f" />
    <line x1="20" y1="108" x2="200" y2="108" stroke="#3f3f3f" strokeWidth="1" />
    <line x1="110" y1="108" x2="110" y2="134" stroke="#3f3f3f" strokeWidth="1" />
    <line x1="20" y1="134" x2="200" y2="134" stroke="#3f3f3f" strokeWidth="1" />

    <text x="30" y="100" fontSize="10" fill="#9a9a9a" letterSpacing="1">SCENE</text>
    <text x="78" y="100" fontSize="11" fill="#f5f5f5" fontWeight="600">NOT FOUND</text>

    <text x="30" y="126" fontSize="10" fill="#9a9a9a" letterSpacing="1">TAKE</text>
    <text x="68" y="127" fontSize="13" fill="#DC2828" fontWeight="700">404</text>
    <text x="120" y="126" fontSize="10" fill="#9a9a9a" letterSpacing="1">ROLL</text>
    <text x="155" y="127" fontSize="11" fill="#f5f5f5" fontWeight="600">∞</text>

    <text x="30" y="151" fontSize="10" fill="#9a9a9a" letterSpacing="1">DIR.</text>
    <text x="62" y="151" fontSize="10" fill="#f5f5f5">React Router</text>
  </svg>
);

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <Clapperboard />

          <h1 className="font-display text-7xl md:text-8xl tracking-wider text-foreground mb-4">
            4<span className="text-gradient-red">0</span>4
          </h1>

          <p className="text-xl md:text-2xl text-foreground font-semibold mb-3">
            CUT! This scene ended up on the cutting room floor.
          </p>

          <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Either the reel went missing, the director hated it, or you typed a URL
            that was never in the script. The show must go on though — pick your next scene:
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="bg-gradient-red hover:opacity-90 text-primary-foreground shadow-glow group h-12 px-8">
                <Home className="mr-2 h-5 w-5" />
                Return to Home
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/movies">
              <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 hover:border-primary h-12 px-8">
                <Play className="mr-2 h-4 w-4 fill-current" />
                Browse Movies
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
