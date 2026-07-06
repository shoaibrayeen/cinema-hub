import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { triggerAddMediaWorkflow, getKnownLanguageKeys, findDuplicateEntry } from "@/lib/githubWorkflow";
import { OTHER_LANGUAGE, resolveLanguage } from "@/lib/adminFormUtils";
import { AlertTriangle } from "lucide-react";

const PLATFORMS = ["Netflix", "Prime", "Disney+", "HBO", "Apple TV+", "Hotstar", "YouTube", "Theater", "Other"] as const;
const STATUSES = ["Watched", "Watching", "Planned"] as const;

const sharedFields = {
  name: z.string().trim().min(1, "Name is required"),
  genreInput: z.string().trim().min(1, "At least one genre is required"),
  language: z.string().trim().min(1, "Language is required"),
  newLanguage: z.string().trim().optional(),
  platform: z.string().optional(),
  status: z.string().optional(),
};

const movieFormSchema = z
  .object({
    ...sharedFields,
    year: z.coerce.number().int().min(1900, "Enter a valid year").max(2100, "Enter a valid year"),
    playtime: z.string().trim().min(1, "Playtime is required"),
  })
  .refine((data) => data.language !== OTHER_LANGUAGE || !!data.newLanguage?.trim(), {
    message: "Enter the new language name",
    path: ["newLanguage"],
  });

const tvShowFormSchema = z
  .object({
    ...sharedFields,
    yearRange: z.string().trim().min(1, "Year range is required"),
    seasons: z.coerce.number().int().min(1, "Enter at least 1 season").max(100, "Enter a valid season count"),
  })
  .refine((data) => data.language !== OTHER_LANGUAGE || !!data.newLanguage?.trim(), {
    message: "Enter the new language name",
    path: ["newLanguage"],
  });

type MovieFormValues = z.infer<typeof movieFormSchema>;
type TVShowFormValues = z.infer<typeof tvShowFormSchema>;

const movieDefaults: MovieFormValues = {
  name: "",
  genreInput: "",
  language: "",
  newLanguage: "",
  platform: "",
  status: "Watched",
  year: new Date().getFullYear(),
  playtime: "",
};

const tvShowDefaults: TVShowFormValues = {
  name: "",
  genreInput: "",
  language: "",
  newLanguage: "",
  platform: "",
  status: "Watched",
  yearRange: "",
  seasons: 1,
};

interface AddMediaFormProps {
  token: string;
}

const AddMediaForm = ({ token }: AddMediaFormProps) => {
  const [mediaType, setMediaType] = useState<"movie" | "tvshow">("movie");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const movieForm = useForm<MovieFormValues>({ resolver: zodResolver(movieFormSchema), defaultValues: movieDefaults });
  const tvForm = useForm<TVShowFormValues>({ resolver: zodResolver(tvShowFormSchema), defaultValues: tvShowDefaults });

  const movieLanguages = getKnownLanguageKeys("moviesData");
  const tvLanguages = getKnownLanguageKeys("tvShowsData");

  const movieLanguageValue = movieForm.watch("language");
  const movieNameValue = movieForm.watch("name");
  const movieDuplicate =
    movieNameValue && movieLanguageValue
      ? findDuplicateEntry("moviesData", resolveLanguage(movieLanguageValue, movieForm.watch("newLanguage")), movieNameValue)
      : false;

  const tvLanguageValue = tvForm.watch("language");
  const tvNameValue = tvForm.watch("name");
  const tvDuplicate =
    tvNameValue && tvLanguageValue
      ? findDuplicateEntry("tvShowsData", resolveLanguage(tvLanguageValue, tvForm.watch("newLanguage")), tvNameValue)
      : false;

  const onSubmitMovie = async (values: MovieFormValues) => {
    setIsSubmitting(true);
    try {
      const inputs: Record<string, string> = {
        mediaType: "movie",
        name: values.name.trim(),
        genre: values.genreInput,
        language: resolveLanguage(values.language, values.newLanguage),
        year: String(values.year),
        playtime: values.playtime.trim(),
      };
      if (values.platform) inputs.platform = values.platform;
      if (values.status) inputs.status = values.status;

      await triggerAddMediaWorkflow(token, inputs);
      movieForm.reset(movieDefaults);
      toast({
        title: "Workflow triggered",
        description: "A pull request will appear in a minute or two. Check the repo's Pull Requests tab, review it, and merge to publish.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Couldn't trigger workflow",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitTVShow = async (values: TVShowFormValues) => {
    setIsSubmitting(true);
    try {
      const inputs: Record<string, string> = {
        mediaType: "tvshow",
        name: values.name.trim(),
        genre: values.genreInput,
        language: resolveLanguage(values.language, values.newLanguage),
        yearRange: values.yearRange.trim(),
        seasons: String(values.seasons),
      };
      if (values.platform) inputs.platform = values.platform;
      if (values.status) inputs.status = values.status;

      await triggerAddMediaWorkflow(token, inputs);
      tvForm.reset(tvShowDefaults);
      toast({
        title: "Workflow triggered",
        description: "A pull request will appear in a minute or two. Check the repo's Pull Requests tab, review it, and merge to publish.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Couldn't trigger workflow",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs value={mediaType} onValueChange={(v) => setMediaType(v as "movie" | "tvshow")} className="w-full max-w-lg">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="movie">Movie</TabsTrigger>
        <TabsTrigger value="tvshow">TV Show</TabsTrigger>
      </TabsList>

      <TabsContent value="movie">
        <Form {...movieForm}>
          <form onSubmit={movieForm.handleSubmit(onSubmitMovie)} className="space-y-4 pt-4">
            <FormField
              control={movieForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={movieForm.control}
              name="genreInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input placeholder="Action, Drama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={movieForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={movieForm.control}
                name="playtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Playtime</FormLabel>
                    <FormControl>
                      <Input placeholder="2h 15m" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={movieForm.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border z-50">
                      {movieLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                      <SelectItem value={OTHER_LANGUAGE}>Other (type new)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {movieLanguageValue === OTHER_LANGUAGE && (
              <FormField
                control={movieForm.control}
                name="newLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New language name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={movieForm.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border z-50">
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={movieForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border z-50">
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {movieDuplicate && (
              <p className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                An entry named "{movieNameValue}" already exists under this language. Submitting will add a duplicate.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Triggering..." : "Add movie"}
            </Button>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="tvshow">
        <Form {...tvForm}>
          <form onSubmit={tvForm.handleSubmit(onSubmitTVShow)} className="space-y-4 pt-4">
            <FormField
              control={tvForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={tvForm.control}
              name="genreInput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <FormControl>
                    <Input placeholder="Drama, Thriller" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={tvForm.control}
                name="yearRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year range</FormLabel>
                    <FormControl>
                      <Input placeholder="2024-Present" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tvForm.control}
                name="seasons"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seasons</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={tvForm.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border-border z-50">
                      {tvLanguages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                      <SelectItem value={OTHER_LANGUAGE}>Other (type new)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {tvLanguageValue === OTHER_LANGUAGE && (
              <FormField
                control={tvForm.control}
                name="newLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New language name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={tvForm.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border z-50">
                        {PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={tvForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border z-50">
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {tvDuplicate && (
              <p className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                An entry named "{tvNameValue}" already exists under this language. Submitting will add a duplicate.
              </p>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Triggering..." : "Add TV show"}
            </Button>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
};

export default AddMediaForm;
