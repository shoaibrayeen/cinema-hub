import { useState, useMemo } from "react";
import { Tv } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterControls from "@/components/FilterControls";
import MediaCard from "@/components/MediaCard";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import { tvShowsData, getAllGenres, type Language } from "@/data/mediaData";

const TVShows = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("Korean");
  const [sortBy, setSortBy] = useState<"year-desc" | "year-asc" | "name">("year-desc");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const genres = useMemo(() => getAllGenres("tvshow"), []);
  
  const parseYear = (yearRange: string): number => {
    const match = yearRange.match(/^\d{4}/);
    return match ? parseInt(match[0]) : 0;
  };
  
  const sortShows = (shows: typeof tvShowsData.Korean) => {
    return [...shows].sort((a, b) => {
      if (sortBy === "year-desc") return parseYear(b.yearRange) - parseYear(a.yearRange);
      if (sortBy === "year-asc") return parseYear(a.yearRange) - parseYear(b.yearRange);
      return a.name.localeCompare(b.name);
    });
  };
  
  const filterShows = (shows: typeof tvShowsData.Korean) => {
    let filtered = shows;
    
    if (selectedGenre !== "all") {
      filtered = filtered.filter((show) => show.genre.includes(selectedGenre));
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter((show) => show.status === selectedStatus);
    }
    
    return sortShows(filtered);
  };
  
  const shows = useMemo(() => {
    return filterShows(tvShowsData[selectedLanguage] || []);
  }, [selectedLanguage, sortBy, selectedGenre, selectedStatus]);
  
  // Group by status for carousel view
  const watchedShows = shows.filter(s => s.status === "Watched");
  const watchingShows = shows.filter(s => s.status === "Watching");
  const plannedShows = shows.filter(s => s.status === "Planned");
  
  const totalShows = tvShowsData[selectedLanguage]?.length || 0;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-red shadow-glow">
              <Tv className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-4xl tracking-wide text-foreground">
                TV SHOWS
              </h1>
              <p className="text-sm text-muted-foreground">
                {shows.length} of {totalShows} {selectedLanguage} shows
              </p>
            </div>
          </div>
          
          {/* Filters */}
          <div className="mb-8">
            <FilterControls
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              genres={genres}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>
          
          {/* Content */}
          {shows.length > 0 ? (
            <div className="space-y-8">
              {/* Show carousels when status is "all" */}
              {selectedStatus === "all" ? (
                <>
                  {watchingShows.length > 0 && (
                    <HorizontalCarousel title="CURRENTLY WATCHING" itemCount={watchingShows.length}>
                      {watchingShows.map((show, index) => (
                        <MediaCard
                          key={`${show.name}-${show.yearRange}`}
                          name={show.name}
                          genre={show.genre}
                          year={show.yearRange}
                          seasons={show.seasons}
                          platform={show.platform}
                          status={show.status}
                          index={index}
                        />
                      ))}
                    </HorizontalCarousel>
                  )}
                  
                  {watchedShows.length > 0 && (
                    <HorizontalCarousel title="WATCHED" itemCount={watchedShows.length}>
                      {watchedShows.map((show, index) => (
                        <MediaCard
                          key={`${show.name}-${show.yearRange}`}
                          name={show.name}
                          genre={show.genre}
                          year={show.yearRange}
                          seasons={show.seasons}
                          platform={show.platform}
                          status={show.status}
                          index={index}
                        />
                      ))}
                    </HorizontalCarousel>
                  )}
                  
                  {plannedShows.length > 0 && (
                    <HorizontalCarousel title="WATCHLIST" itemCount={plannedShows.length}>
                      {plannedShows.map((show, index) => (
                        <MediaCard
                          key={`${show.name}-${show.yearRange}`}
                          name={show.name}
                          genre={show.genre}
                          year={show.yearRange}
                          seasons={show.seasons}
                          platform={show.platform}
                          status={show.status}
                          index={index}
                        />
                      ))}
                    </HorizontalCarousel>
                  )}
                </>
              ) : (
                /* Grid view when a specific status is selected */
                <div className="flex flex-wrap gap-4">
                  {shows.map((show, index) => (
                    <MediaCard
                      key={`${show.name}-${show.yearRange}`}
                      name={show.name}
                      genre={show.genre}
                      year={show.yearRange}
                      seasons={show.seasons}
                      platform={show.platform}
                      status={show.status}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Tv className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-xl text-muted-foreground">
                No TV shows found for selected filters
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TVShows;
