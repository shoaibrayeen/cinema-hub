import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Cpu, Globe, Trophy, ExternalLink, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
          
          <div className="container relative mx-auto px-4 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Play className="h-4 w-4 text-primary fill-current" />
              <span className="text-sm text-primary font-medium">Your Personal Watchlist</span>
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl tracking-wider text-foreground mb-6">
              CINEMA<span className="text-gradient-red">HUB</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A curated collection of movies and TV shows from around the world.
              Discover stories across languages, genres, and streaming platforms.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/movies">
                <Button size="lg" className="bg-gradient-red hover:opacity-90 text-primary-foreground shadow-glow group h-12 px-8">
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Browse Movies
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/tv-shows">
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 hover:border-primary h-12 px-8">
                  Explore TV Shows
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* About Me Card */}
            <div className="bg-gradient-card border border-border/30 rounded-xl p-6 shadow-card hover:border-primary/30 transition-colors">
              <h2 className="font-display text-3xl tracking-wide mb-4">
                ABOUT <span className="text-gradient-red">ME</span>
              </h2>
              
              <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                <p>
                  I am <span className="text-foreground font-semibold">Mohd Shoaib Rayeen</span>, 
                  a Senior Software Engineer specializing in Backend Architecture, AI Integrations, 
                  and Scalable Distributed Systems.
                </p>
                
                <p>
                  Currently focused on Contractual Metadata Extraction through LLM, MCP Integration 
                  and Agentic AI Integration. Passionate about creating resilient, high-performance 
                  solutions that serve millions of users globally.
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {["Backend Architecture", "AI Integrations", "Distributed Systems", "LLM"].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs bg-muted rounded-full text-muted-foreground border border-border/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <a
                  href="https://shoaibrayeen.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View My Portfolio</span>
                </a>
              </div>
            </div>
            
            {/* Hobbies Card */}
            <div className="bg-gradient-card border border-border/30 rounded-xl p-6 shadow-card hover:border-primary/30 transition-colors">
              <h2 className="font-display text-3xl tracking-wide mb-4">
                HOBBIES & <span className="text-gradient-red">INTERESTS</span>
              </h2>
              
              <p className="text-muted-foreground text-sm mb-4">
                Beyond coding, I find joy in diverse activities that keep me balanced, 
                inspired, and connected to different cultures.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/20 hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Trophy className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Sports Enthusiast</h3>
                    <p className="text-xs text-muted-foreground">
                      Passionate about Cricket, Carrom, and Badminton
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/20 hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">World Cinema</h3>
                    <p className="text-xs text-muted-foreground">
                      Exploring stories from Korean dramas to European art films
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/20 hover:border-primary/30 transition-colors">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cpu className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground text-sm">Tech Explorer</h3>
                    <p className="text-xs text-muted-foreground">
                      Always learning new technologies and building side projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
