import { useState, useMemo } from "react";
import { Film } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterControls from "@/components/FilterControls";
import MediaCard from "@/components/MediaCard";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import { moviesData, getAllGenres, type Language, type WatchStatus } from "@/data/mediaData";

const Movies = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("English");
  const [sortBy, setSortBy] = useState<"year-desc" | "year-asc" | "name">("year-desc");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const genres = useMemo(() => getAllGenres("movie"), []);
  
  const sortMovies = (movies: typeof moviesData.English) => {
    return [...movies].sort((a, b) => {
      if (sortBy === "year-desc") return b.year - a.year;
      if (sortBy === "year-asc") return a.year - b.year;
      return a.name.localeCompare(b.name);
    });
  };
  
  const filterMovies = (movies: typeof moviesData.English) => {
    let filtered = movies;
    
    if (selectedGenre !== "all") {
      filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre));
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter((movie) => movie.status === selectedStatus);
    }
    
    return sortMovies(filtered);
  };
  
  const movies = useMemo(() => {
    return filterMovies(moviesData[selectedLanguage] || []);
  }, [selectedLanguage, sortBy, selectedGenre, selectedStatus]);
  
  // Group by status for carousel view
  const watchedMovies = movies.filter(m => m.status === "Watched");
  const watchingMovies = movies.filter(m => m.status === "Watching");
  const plannedMovies = movies.filter(m => m.status === "Planned");
  
  const totalMovies = moviesData[selectedLanguage]?.length || 0;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-red shadow-glow">
              <Film className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-4xl tracking-wide text-foreground">
                MOVIES
              </h1>
              <p className="text-sm text-muted-foreground">
                {movies.length} of {totalMovies} {selectedLanguage} movies
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
          {movies.length > 0 ? (
            <div className="space-y-8">
              {/* Show carousels when status is "all" */}
              {selectedStatus === "all" ? (
                <>
                  {watchingMovies.length > 0 && (
                    <HorizontalCarousel title="CURRENTLY WATCHING" itemCount={watchingMovies.length}>
                      {watchingMovies.map((movie, index) => (
                        <MediaCard
                          key={`${movie.name}-${movie.year}`}
                          name={movie.name}
                          genre={movie.genre}
                          year={movie.year}
                          platform={movie.platform}
                          status={movie.status}
                          index={index}
                        />
                      ))}
                    </HorizontalCarousel>
                  )}
                  
                  {watchedMovies.length > 0 && (
                    <HorizontalCarousel title="WATCHED" itemCount={watchedMovies.length}>
                      {watchedMovies.map((movie, index) => (
                        <MediaCard
                          key={`${movie.name}-${movie.year}`}
                          name={movie.name}
                          genre={movie.genre}
                          year={movie.year}
                          platform={movie.platform}
                          status={movie.status}
                          index={index}
                        />
                      ))}
                    </HorizontalCarousel>
                  )}
                  
                  {plannedMovies.length > 0 && (
                    <HorizontalCarousel title="WATCHLIST" itemCount={plannedMovies.length}>
                      {plannedMovies.map((movie, index) => (
                        <MediaCard
                          key={`${movie.name}-${movie.year}`}
                          name={movie.name}
                          genre={movie.genre}
                          year={movie.year}
                          platform={movie.platform}
                          status={movie.status}
                          index={index}
                        />
                      ))}
                    </HorizontalCarousel>
                  )}
                </>
              ) : (
                /* Grid view when a specific status is selected */
                <div className="flex flex-wrap gap-4">
                  {movies.map((movie, index) => (
                    <MediaCard
                      key={`${movie.name}-${movie.year}`}
                      name={movie.name}
                      genre={movie.genre}
                      year={movie.year}
                      platform={movie.platform}
                      status={movie.status}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Film className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-xl text-muted-foreground">
                No movies found for selected filters
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Movies;
