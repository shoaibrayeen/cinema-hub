import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, type Language } from "@/data/mediaData";
import { Globe, ArrowUpDown, Filter, Eye } from "lucide-react";

interface FilterControlsProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  sortBy: "year-desc" | "year-asc" | "name";
  onSortChange: (sort: "year-desc" | "year-asc" | "name") => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  genres: string[];
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
}

const FilterControls = ({
  selectedLanguage,
  onLanguageChange,
  sortBy,
  onSortChange,
  selectedGenre,
  onGenreChange,
  genres,
  selectedStatus,
  onStatusChange,
}: FilterControlsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-card/50 rounded-lg border border-border/30 backdrop-blur-sm">
      {/* Language Filter */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <Select value={selectedLanguage} onValueChange={(v) => onLanguageChange(v as Language)}>
          <SelectTrigger className="w-[130px] h-9 bg-background border-border/50 text-sm">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang} className="text-sm">
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Status Filter */}
      {onStatusChange && (
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <Select value={selectedStatus || "all"} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[120px] h-9 bg-background border-border/50 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              <SelectItem value="all" className="text-sm">All Status</SelectItem>
              <SelectItem value="Watched" className="text-sm">Watched</SelectItem>
              <SelectItem value="Watching" className="text-sm">Watching</SelectItem>
              <SelectItem value="Planned" className="text-sm">Planned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Genre Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-primary" />
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-[130px] h-9 bg-background border-border/50 text-sm">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50 max-h-[300px]">
            <SelectItem value="all" className="text-sm">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre} className="text-sm">
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Sort */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="h-4 w-4 text-primary" />
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as "year-desc" | "year-asc" | "name")}>
          <SelectTrigger className="w-[140px] h-9 bg-background border-border/50 text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-50">
            <SelectItem value="year-desc" className="text-sm">Year (Newest)</SelectItem>
            <SelectItem value="year-asc" className="text-sm">Year (Oldest)</SelectItem>
            <SelectItem value="name" className="text-sm">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FilterControls;
