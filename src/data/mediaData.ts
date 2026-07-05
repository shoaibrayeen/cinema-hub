export const LANGUAGES = [
  "English",
  "Hindi",
  "French",
  "Korean",
  "Turkish",
  "Spanish",
  "Tamil",
  "Telugu",
  "Malayalam",
  "Kannada",
  "Indonesian",
  "Filipino",
  "Norwegian",
  "Polish",
  "Vietnamese",
] as const;

export type Language = (typeof LANGUAGES)[number];

export type Platform = "Netflix" | "Prime" | "Disney+" | "HBO" | "Apple TV+" | "Hotstar" | "YouTube" | "Theater" | "Other";

export type WatchStatus = "Watched" | "Watching" | "Planned";

export interface Movie {
  name: string;
  genre: string[];
  year: number;
  playtime: string;
  language: Language;
  platform?: Platform;
  status?: WatchStatus;
}

export interface TVShow {
  name: string;
  genre: string[];
  yearRange: string;
  language: Language;
  seasons: number;
  platform?: Platform;
  status?: WatchStatus;
}

export const moviesData: Record<string, Movie[]> = {
  Vietnamese: [
    { name: "Mai", genre: ["Drama", "Romance"], year: 2024, playtime: "2h 11m", language: "Vietnamese", platform: "Netflix", status: "Watched" },
    { name: "Black Rose (Chiếm Đoạt)", genre: ["Drama", "Mystery", "Thriller"], year: 2023, playtime: "1h 53m", language: "Vietnamese", platform: "Netflix", status: "Watched" }
  ],
  Indonesian: [
    { name: "Dilan 1983: Wo Ai Ni", genre: ["Drama", "Romance"], year: 2024, playtime: "1h 56m", language: "Indonesian", platform: "Netflix", status: "Watched" },
  ],
  Filipino: [
    { name: "I Love Lizzy", genre: ["Drama", "Romance"], year: 2023, playtime: "1h 42m", language: "Filipino", platform: "Netflix", status: "Watched" },
  ],
  Spanish: [
    { name: "Y Tu Mamá También", genre: ["Drama", "Comedy"], year: 2001, playtime: "1h 46m", language: "Spanish", platform: "Netflix", status: "Watched" },
    { name: "Through My Window", genre: ["Drama", "Romance"], year: 2022, playtime: "1h 53m", language: "Spanish", platform: "Netflix", status: "Watched" },
    { name: "Through My Window: Across the Sea", genre: ["Drama", "Romance"], year: 2023, playtime: "1h 50m", language: "Spanish", platform: "Netflix", status: "Watched" },
    { name: "Through My Window 3: Looking at You", genre: ["Drama", "Romance"], year: 2024, playtime: "1h 45m", language: "Spanish", platform: "Netflix", status: "Watched" },
    { name: "Bad Influence", genre: ["Drama", "Romance"], year: 2024, playtime: "1h 41m", language: "Spanish", platform: "Netflix", status: "Watched" },
    { name: "A Widow's Game", genre: ["Crime", "Drama", "Thriller"], year: 2024, playtime: "2h 02m", language: "Spanish", platform: "Netflix", status: "Watched" },
  ],
  Turkish: [
    { name: "Art of Love", genre: ["Action", "Romance"], year: 2024, playtime: "1h 39m", language: "Turkish", platform: "Netflix", status: "Watched" },
    { name: "A True Gentleman", genre: ["Drama", "Romance"], year: 2024, playtime: "1h 50m", language: "Turkish", platform: "Netflix", status: "Watched" },
    { name: "Chasing the Wind", genre: ["Drama", "Romance"], year: 2024, playtime: "1h 36m", language: "Turkish", platform: "Netflix", status: "Watched" },
    { name: "Last Call for Istanbul", genre: ["Drama", "Romance"], year: 2023, playtime: "1h 31m", language: "Turkish", platform: "Netflix", status: "Watched" },
    { name: "Private Lesson", genre: ["Comedy", "Romance"], year: 2022, playtime: "1h 37m", language: "Turkish", platform: "Netflix", status: "Watched" },
  ],
  Polish: [
    { name: "Filip", genre: ["Drama", "War"], year: 2022, playtime: "2h 00m", language: "Polish", platform: "Netflix", status: "Watched" },
  ],
  Telugu: [
    { name: "Sita Ramam", genre: ["Drama", "Romance"], year: 2022, playtime: "2h 43m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Jaanu", genre: ["Drama", "Romance"], year: 2020, playtime: "2h 31m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "V", genre: ["Action", "Thriller"], year: 2020, playtime: "2h 20m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Kuberaa", genre: ["Action", "Drama"], year: 2025, playtime: "2h 45m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "The Girlfriend", genre: ["Romance", "Thriller"], year: 2025, playtime: "2h 20m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "They Call Him OG", genre: ["Action", "Crime"], year: 2025, playtime: "2h 34m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Lucky Baskhar", genre: ["Drama", "Thriller"], year: 2024, playtime: "2h 30m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "HIT: The First Case", genre: ["Crime", "Thriller"], year: 2020, playtime: "2h 05m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "HIT: The Second Case", genre: ["Crime", "Thriller"], year: 2022, playtime: "2h 00m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "HIT: The Third Case", genre: ["Action", "Thriller"], year: 2025, playtime: "2h 15m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Kingdom", genre: ["Action", "Spy"], year: 2025, playtime: "2h 32m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Hi Nanna", genre: ["Drama", "Romance"], year: 2023, playtime: "2h 35m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Jersey", genre: ["Drama", "Sports"], year: 2019, playtime: "2h 37m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Major", genre: ["Action", "Biography"], year: 2022, playtime: "2h 30m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Kalki 2898 AD", genre: ["Sci-Fi", "Action"], year: 2024, playtime: "3h 01m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Arjun Reddy", genre: ["Drama", "Romance"], year: 2017, playtime: "3h 10m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Kushi", genre: ["Comedy", "Romance"], year: 2023, playtime: "2h 45m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Magadheera", genre: ["Action", "Fantasy"], year: 2009, playtime: "2h 37m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Maharshi", genre: ["Action", "Drama"], year: 2019, playtime: "2h 56m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "RRR", genre: ["Action", "Drama"], year: 2022, playtime: "3h 07m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Arya", genre: ["Action", "Romance"], year: 2004, playtime: "2h 31m", language: "Telugu", platform: "Other", status: "Watched" },
    { name: "Arya 2", genre: ["Action", "Romance"], year: 2009, playtime: "2h 41m", language: "Telugu", platform: "Other", status: "Watched" },
    { name: "Baahubali: The Beginning", genre: ["Action", "Fantasy"], year: 2015, playtime: "2h 39m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Baahubali 2: The Conclusion", genre: ["Action", "Fantasy"], year: 2017, playtime: "2h 47m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Guntur Kaaram", genre: ["Action", "Drama"], year: 2024, playtime: "2h 39m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Ghaati", genre: ["Action", "Crime"], year: 2025, playtime: "2h 35m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Daaku Maharaaj", genre: ["Action", "Drama"], year: 2025, playtime: "2h 28m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "The Ghost", genre: ["Action", "Thriller"], year: 2022, playtime: "2h 18m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Dear Comrade", genre: ["Action", "Romance"], year: 2019, playtime: "2h 50m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "The Family Star", genre: ["Action", "Drama"], year: 2024, playtime: "2h 43m", language: "Telugu", platform: "Disney+", status: "Watched" },
    { name: "Geetha Govindam", genre: ["Comedy", "Romance"], year: 2018, playtime: "2h 22m", language: "Telugu", platform: "Other", status: "Watched" },
    { name: "Liger", genre: ["Action", "Sports"], year: 2022, playtime: "2h 20m", language: "Telugu", platform: "Disney+", status: "Watched" },
    { name: "World Famous Lover", genre: ["Drama", "Romance"], year: 2020, playtime: "2h 27m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Mr Bachchan", genre: ["Action", "Crime"], year: 2024, playtime: "2h 38m", language: "Telugu", platform: "Netflix", status: "Watched" },
    { name: "Ala Vaikunthapurramuloo", genre: ["Action", "Drama"], year: 2020, playtime: "2h 43m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Evaru", genre: ["Mystery", "Thriller"], year: 2019, playtime: "1h 58m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "NOTA", genre: ["Action", "Drama"], year: 2018, playtime: "2h 30m", language: "Telugu", platform: "Prime", status: "Watched" },
    { name: "Salaar: Part 1 – Ceasefire", genre: ["Action", "Crime"], year: 2023, playtime: "2h 55m", language: "Telugu", platform: "Netflix", status: "Watched" }
  ],
  Malayalam: [
    { name: "Premam", genre: ["Comedy", "Romance"], year: 2015, playtime: "2h 36m", language: "Malayalam", platform: "Disney+", status: "Watched" },
    { name: "Hridayam", genre: ["Drama", "Romance"], year: 2022, playtime: "2h 52m", language: "Malayalam", platform: "Disney+", status: "Watched" },
    { name: "Aadujeevitham: The Goat Life", genre: ["Adventure", "Drama"], year: 2024, playtime: "2h 53m", language: "Malayalam", platform: "Netflix", status: "Watched" },
    { name: "L2: Empuraan", genre: ["Action", "Crime"], year: 2025, playtime: "2h 59m", language: "Malayalam", platform: "Disney+", status: "Watched" },
    { name: "Lucifer", genre: ["Action", "Crime"], year: 2019, playtime: "2h 55m", language: "Malayalam", platform: "Prime", status: "Watched" },
    { name: "Thudarum", genre: ["Action", "Thriller"], year: 2025, playtime: "2h 45m", language: "Malayalam", platform: "Disney+", status: "Watched" },
    { name: "Lokah Chapter 1: Chandra", genre: ["Action", "Sci-Fi"], year: 2025, playtime: "2h 40m", language: "Malayalam", platform: "Disney+", status: "Watched" }
  ],
  Kannada: [
    { name: "K.G.F: Chapter 1", genre: ["Action", "Drama"], year: 2018, playtime: "2h 35m", language: "Kannada", platform: "Prime", status: "Watched" },
    { name: "Bagheera", genre: ["Action", "Thriller"], year: 2024, playtime: "2h 38m", language: "Kannada", platform: "Netflix", status: "Watched" }
  ],
  Hindi: [
    // --- Direct Additions Requested ---
    { name: "Pathaan", genre: ["Action", "Thriller"], year: 2023, playtime: "2h 26m", language: "Hindi", platform: "Theater", status: "Watched" },
    { name: "Happy Patel: Khatarnak Jasoos", genre: ["Action", "Comedy"], year: 2026, playtime: "2h 01m", language: "Hindi", platform: "Theater", status: "Watched" },
    { name: "Tamasha", genre: ["Drama", "Romance"], year: 2015, playtime: "2h 19m", language: "Hindi", platform: "Other", status: "Watched" },

    // --- Social Drama & Classics ---
    { name: "3 Idiots", genre: ["Comedy", "Drama"], year: 2009, playtime: "2h 50m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Dangal", genre: ["Biography", "Sports"], year: 2016, playtime: "2h 41m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "October", genre: ["Drama", "Romance"], year: 2018, playtime: "1h 55m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Jawaani Jaaneman", genre: ["Comedy", "Drama"], year: 2020, playtime: "1h 59m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Thappad", genre: ["Drama"], year: 2020, playtime: "2h 22m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "The Sky Is Pink", genre: ["Biography", "Drama"], year: 2019, playtime: "2h 29m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Udaan", genre: ["Drama"], year: 2010, playtime: "2h 18m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Dil Bechara", genre: ["Drama", "Romance"], year: 2020, playtime: "1h 41m", language: "Hindi", platform: "Disney+", status: "Watched" },
    { name: "Laila Majnu", genre: ["Drama", "Romance"], year: 2018, playtime: "2h 20m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Mimi", genre: ["Comedy", "Drama"], year: 2021, playtime: "2h 12m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Rockstar", genre: ["Drama", "Music"], year: 2011, playtime: "2h 39m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Barfi!", genre: ["Comedy", "Drama"], year: 2012, playtime: "2h 31m", language: "Hindi", platform: "Other", status: "Watched" },

    // --- Action & Thrillers ---
    { name: "Kites", genre: ["Action", "Romance"], year: 2010, playtime: "2h 10m", language: "Hindi", platform: "Theater", status: "Watched" },
    { name: "Kaabil", genre: ["Action", "Thriller"], year: 2017, playtime: "2h 19m", language: "Hindi", platform: "Disney+", status: "Watched" },
    { name: "Agneepath", genre: ["Action", "Crime"], year: 2012, playtime: "2h 54m", language: "Hindi", platform: "Theater", status: "Watched" },
    { name: "Vikram Vedha", genre: ["Action", "Crime", "Thriller"], year: 2022, playtime: "2h 36m", language: "Hindi", platform: "Disney+", status: "Watched" },
    { name: "Raees", genre: ["Action", "Crime"], year: 2017, playtime: "2h 23m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Jawan", genre: ["Action", "Thriller"], year: 2023, playtime: "2h 49m", language: "Hindi", platform: "Theater", status: "Watched" },
    { name: "Main Tera Hero", genre: ["Action", "Comedy"], year: 2014, playtime: "2h 08m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Chennai Express", genre: ["Action", "Comedy"], year: 2013, playtime: "2h 21m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Action Jackson", genre: ["Action", "Thriller"], year: 2014, playtime: "2h 24m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Happy New Year", genre: ["Action", "Comedy"], year: 2014, playtime: "3h 00m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Kisi Ka Bhai Kisi Ki Jaan", genre: ["Action", "Comedy"], year: 2023, playtime: "2h 25m", language: "Hindi", platform: "Other", status: "Watched" },

    // --- Cop Universe ---
    { name: "Singham", genre: ["Action", "Crime"], year: 2011, playtime: "2h 22m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Singham Returns", genre: ["Action", "Crime"], year: 2014, playtime: "2h 22m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Singham Again", genre: ["Action", "Drama"], year: 2024, playtime: "2h 24m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Simmba", genre: ["Action", "Comedy"], year: 2018, playtime: "2h 38m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Sooryavanshi", genre: ["Action", "Crime"], year: 2021, playtime: "2h 25m", language: "Hindi", platform: "Netflix", status: "Watched" },

    // --- Spy & War Universe ---
    { name: "Ek Tha Tiger", genre: ["Action", "Thriller"], year: 2012, playtime: "2h 12m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Tiger Zinda Hai", genre: ["Action", "Thriller"], year: 2017, playtime: "2h 41m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Tiger 3", genre: ["Action", "Thriller"], year: 2023, playtime: "2h 35m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Fighter", genre: ["Action", "Thriller"], year: 2024, playtime: "2h 47m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Sky Force", genre: ["Action", "Historical"], year: 2025, playtime: "2h 05m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Uri: The Surgical Strike", genre: ["Action", "War"], year: 2019, playtime: "2h 18m", language: "Hindi", platform: "Theater", status: "Watched" },
    { name: "Kesari", genre: ["Action", "War"], year: 2019, playtime: "2h 30m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Tanhaji", genre: ["Action", "History"], year: 2020, playtime: "2h 15m", language: "Hindi", platform: "Disney+", status: "Watched" },

    // --- The 'Dabangg', 'Race', 'Villain' & 'Baaghi' Franchises ---
    { name: "Dabangg", genre: ["Action", "Comedy"], year: 2010, playtime: "2h 06m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Dabangg 2", genre: ["Action", "Comedy"], year: 2012, playtime: "2h 00m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Dabangg 3", genre: ["Action", "Comedy"], year: 2019, playtime: "2h 40m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Race", genre: ["Action", "Crime"], year: 2008, playtime: "2h 35m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Race 2", genre: ["Action", "Crime"], year: 2013, playtime: "2h 30m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Race 3", genre: ["Action", "Thriller"], year: 2018, playtime: "2h 40m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Ek Villain", genre: ["Action", "Thriller"], year: 2014, playtime: "2h 09m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Ek Villain Returns", genre: ["Action", "Thriller"], year: 2022, playtime: "2h 08m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Baaghi", genre: ["Action", "Thriller"], year: 2016, playtime: "2h 13m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Baaghi 2", genre: ["Action", "Thriller"], year: 2018, playtime: "2h 25m", language: "Hindi", platform: "Disney+", status: "Watched" },
    { name: "Baaghi 3", genre: ["Action", "Thriller"], year: 2020, playtime: "2h 27m", language: "Hindi", platform: "Disney+", status: "Watched" },
    { name: "Heropanti", genre: ["Action", "Romance"], year: 2014, playtime: "2h 26m", language: "Hindi", platform: "Other", status: "Watched" },

    // --- Espionage & Crime Thrillers ---
    { name: "Naam Shabana", genre: ["Action", "Thriller"], year: 2017, playtime: "2h 27m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Aiyaary", genre: ["Action", "Thriller"], year: 2018, playtime: "2h 40m", language: "Hindi", platform: "Disney+", status: "Watched" },
    { name: "Baby", genre: ["Action", "Thriller"], year: 2015, playtime: "2h 39m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Wazir", genre: ["Action", "Crime", "Thriller"], year: 2016, playtime: "1h 43m", language: "Hindi", platform: "Prime", status: "Watched" },
    { name: "Force", genre: ["Action", "Crime"], year: 2011, playtime: "2h 17m", language: "Hindi", platform: "YouTube", status: "Watched" },
    { name: "Force 2", genre: ["Action", "Thriller"], year: 2016, playtime: "2h 07m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Malang", genre: ["Action", "Thriller"], year: 2020, playtime: "2h 15m", language: "Hindi", platform: "Netflix", status: "Watched" },
    { name: "Satyameva Jayate", genre: ["Action", "Crime"], year: 2018, playtime: "2h 21m", language: "Hindi", platform: "Other", status: "Watched" },
    { name: "Satyameva Jayate 2", genre: ["Action", "Crime"], year: 2021, playtime: "2h 18m", language: "Hindi", platform: "Prime", status: "Watched" }
  ],
  Chinese: [
    { name: "A Choo", genre: ["Romance", "Drama", "Sci-Fi"], year: 2020, playtime: "1h 42m", language: "Chinese", platform: "Netflix", status: "Watched" }
  ],
  Tamil: [
    { name: "96", genre: ["Drama", "Romance"], year: 2018, playtime: "2h 38m", language: "Tamil", platform: "YouTube", status: "Watched" },
    { name: "Coolie", genre: ["Action", "Thriller"], year: 2025, playtime: "2h 49m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Thadam", genre: ["Crime", "Thriller"], year: 2019, playtime: "2h 20m", language: "Tamil", platform: "Other", status: "Watched" },
    { name: "Master", genre: ["Action", "Thriller"], year: 2021, playtime: "2h 59m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Vikram", genre: ["Action", "Thriller"], year: 2022, playtime: "2h 54m", language: "Tamil", platform: "Disney+", status: "Watched" },
    { name: "Dude", genre: ["Romance", "Action", "Comedy"], year: 2025, playtime: "2h 19m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Madharaasi", genre: ["Action", "Thriller"], year: 2025, playtime: "2h 48m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Dragon", genre: ["Comedy", "Drama"], year: 2025, playtime: "2h 35m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Beast", genre: ["Action", "Thriller"], year: 2022, playtime: "2h 35m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Meiyazhagan", genre: ["Drama"], year: 2024, playtime: "2h 57m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Jai Bhim", genre: ["Legal", "Drama"], year: 2021, playtime: "2h 44m", language: "Tamil", platform: "Other", status: "Watched" },
    { name: "The Greatest of All Time", genre: ["Action", "Sci-Fi"], year: 2024, playtime: "3h 03m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Indian", genre: ["Action", "Thriller"], year: 1996, playtime: "3h 05m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Indian 2", genre: ["Action", "Drama"], year: 2024, playtime: "3h 00m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Maharaja", genre: ["Action", "Thriller"], year: 2024, playtime: "2h 22m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Jailer", genre: ["Action", "Crime"], year: 2023, playtime: "2h 48m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Raayan", genre: ["Action", "Crime"], year: 2024, playtime: "2h 25m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Vaathi", genre: ["Action", "Drama"], year: 2023, playtime: "2h 19m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Captain Miller", genre: ["Action", "Adventure"], year: 2024, playtime: "2h 37m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Soorarai Pottru", genre: ["Biography", "Drama"], year: 2020, playtime: "2h 33m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Bigil", genre: ["Action", "Sports"], year: 2019, playtime: "2h 59m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Mersal", genre: ["Action", "Thriller"], year: 2017, playtime: "2h 51m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Sarkar", genre: ["Action", "Drama"], year: 2018, playtime: "2h 44m", language: "Tamil", platform: "Disney+", status: "Watched" },
    { name: "Leo", genre: ["Action", "Crime"], year: 2023, playtime: "2h 44m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Thiruchitrambalam", genre: ["Comedy", "Romance"], year: 2022, playtime: "2h 13m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Vettaiyan", genre: ["Action", "Drama"], year: 2024, playtime: "2h 43m", language: "Tamil", platform: "Prime", status: "Watched" },
    { name: "Thunivu", genre: ["Action", "Heist"], year: 2023, playtime: "2h 26m", language: "Tamil", platform: "Netflix", status: "Watched" },
    { name: "Varisu", genre: ["Action", "Drama"], year: 2023, playtime: "2h 50m", language: "Tamil", platform: "Prime", status: "Watched" }
  ],
  French: [
    { name: "Sentinelle", genre: ["Action", "Thriller"], year: 2021, playtime: "1h 20m", language: "French", platform: "Netflix", status: "Watched" }
  ],
  Norwegian: [
    { name: "Sentimental Value", genre: ["Comedy", "Drama"], year: 2025, playtime: "2h 13m", language: "Norwegian", platform: "Other", status: "Watched" }
  ],
  Korean: [
    { name: "Tune in for Love", genre: ["Romance", "Drama"], year: 2019, playtime: "2h 02m", language: "Korean", platform: "Netflix", status: "Watched" },
    { name: "The Thieves", genre: ["Action", "Crime", "Heist"], year: 2012, playtime: "2h 16m", language: "Korean", platform: "Prime", status: "Watched" },
    { name: "The Negotiation", genre: ["Action", "Crime", "Thriller"], year: 2018, playtime: "1h 54m", language: "Korean", platform: "Prime", status: "Watched" },
    { name: "#Alive", genre: ["Horror", "Sci-Fi", "Thriller"], year: 2020, playtime: "1h 38m", language: "Korean", platform: "Netflix", status: "Watched" },
    { name: "On Your Wedding Day", genre: ["Romance", "Drama"], year: 2018, playtime: "1h 50m", language: "Korean", platform: "Other", status: "Watched" }
  ],
  English: [
    { name: "Jerry Maguire", genre: ["Comedy", "Drama", "Romance"], year: 1996, playtime: "2h 19m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Vanilla Sky", genre: ["Sci-Fi", "Thriller", "Romance"], year: 2001, playtime: "2h 16m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Edge of Tomorrow", genre: ["Action", "Sci-Fi", "Adventure"], year: 2014, playtime: "1h 53m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Knight and Day", genre: ["Action", "Comedy", "Romance"], year: 2010, playtime: "1h 49m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Fight Club", genre: ["Drama", "Thriller"], year: 1999, playtime: "2h 19m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Once Upon a Time in Hollywood", genre: ["Comedy", "Drama"], year: 2019, playtime: "2h 41m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Meet Joe Black", genre: ["Drama", "Fantasy", "Romance"], year: 1998, playtime: "3h 01m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "Mr. & Mrs. Smith", genre: ["Action", "Comedy", "Crime"], year: 2005, playtime: "2h 00m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Bullet Train", genre: ["Action", "Comedy", "Thriller"], year: 2022, playtime: "2h 06m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Babylon", genre: ["Comedy", "Drama", "History"], year: 2022, playtime: "3h 09m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Interstellar", genre: ["Adventure", "Drama", "Sci-Fi"], year: 2014, playtime: "2h 49m", language: "English", platform: "Prime", status: "Watched" },
    { name: "The Batman", genre: ["Action", "Crime", "Mystery"], year: 2022, playtime: "2h 56m", language: "English", platform: "Theater", status: "Watched" },
    { name: "Batman Begins", genre: ["Action", "Crime", "Drama"], year: 2005, playtime: "2h 20m", language: "English", platform: "Other", status: "Watched" },
    { name: "The Dark Knight", genre: ["Action", "Crime", "Drama"], year: 2008, playtime: "2h 32m", language: "English", platform: "Prime", status: "Watched" },
    { name: "The Dark Knight Rises", genre: ["Action", "Drama", "Thriller"], year: 2012, playtime: "2h 44m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Batman v Superman: Dawn of Justice", genre: ["Action", "Adventure", "Sci-Fi"], year: 2016, playtime: "2h 31m", language: "English", platform: "Theater", status: "Watched" },
    { name: "Man of Steel", genre: ["Action", "Adventure", "Sci-Fi"], year: 2013, playtime: "2h 23m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Mission: Impossible", genre: ["Action", "Adventure", "Thriller"], year: 1996, playtime: "1h 50m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Mission: Impossible 2", genre: ["Action", "Adventure", "Thriller"], year: 2000, playtime: "2h 03m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Mission: Impossible III", genre: ["Action", "Adventure", "Thriller"], year: 2006, playtime: "2h 06m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Mission: Impossible – Ghost Protocol", genre: ["Action", "Adventure", "Thriller"], year: 2011, playtime: "2h 12m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Mission: Impossible – Rogue Nation", genre: ["Action", "Adventure", "Thriller"], year: 2015, playtime: "2h 11m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Mission: Impossible – Fallout", genre: ["Action", "Adventure", "Thriller"], year: 2018, playtime: "2h 27m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Mission: Impossible – Dead Reckoning Part One", genre: ["Action", "Adventure", "Thriller"], year: 2023, playtime: "2h 43m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Mission: Impossible – The Final Reckoning", genre: ["Action", "Adventure", "Thriller"], year: 2025, playtime: "2h 50m", language: "English", platform: "Prime", status: "Watched" },
    { name: "The Gorge", genre: ["Action", "Sci-Fi", "Romance"], year: 2025, playtime: "2h 07m", language: "English", platform: "Apple TV+", status: "Watched" },
    { name: "The Flash", genre: ["Action", "Sci-Fi"], year: 2023, playtime: "2h 24m", language: "English", platform: "Theater", status: "Watched" },
    { name: "We Live in Time", genre: ["Drama", "Romance"], year: 2024, playtime: "1h 48m", language: "English", platform: "Other", status: "Watched" },
    { name: "F1", genre: ["Action", "Drama", "Sports"], year: 2025, playtime: "2h 35m", language: "English", platform: "Other", status: "Watched" },
    { name: "People We Meet on Vacation", genre: ["Romance", "Comedy"], year: 2026, playtime: "1h 45m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Rip", genre: ["Crime", "Thriller"], year: 2026, playtime: "2h 13m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Birds of Prey", genre: ["Action", "Adventure"], year: 2020, playtime: "1h 49m", language: "English", platform: "Theater", status: "Watched" },
    { name: "Prisoners", genre: ["Crime", "Drama", "Mystery"], year: 2013, playtime: "2h 33m", language: "English", platform: "Other", status: "Watched" },
    { name: "All the Bright Places", genre: ["Drama", "Romance"], year: 2020, playtime: "1h 47m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Forrest Gump", genre: ["Drama", "Romance"], year: 1994, playtime: "2h 22m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Five Feet Apart", genre: ["Drama", "Romance"], year: 2019, playtime: "1h 56m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "A Star Is Born", genre: ["Drama", "Music", "Romance"], year: 2018, playtime: "2h 16m", language: "English", platform: "Other", status: "Watched" },
    { name: "The Maze Runner", genre: ["Action", "Sci-Fi"], year: 2014, playtime: "1h 53m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "Maze Runner: The Scorch Trials", genre: ["Action", "Sci-Fi"], year: 2015, playtime: "2h 12m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "Maze Runner: The Death Cure", genre: ["Action", "Sci-Fi"], year: 2018, playtime: "2h 23m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "The Half of It", genre: ["Comedy", "Drama", "Romance"], year: 2020, playtime: "1h 44m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "La La Land", genre: ["Comedy", "Drama", "Music"], year: 2016, playtime: "2h 08m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "50 First Dates", genre: ["Comedy", "Romance"], year: 2004, playtime: "1h 39m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Me Before You", genre: ["Drama", "Romance"], year: 2016, playtime: "1h 50m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Eternal Sunshine of the Spotless Mind", genre: ["Drama", "Romance", "Sci-Fi"], year: 2004, playtime: "1h 48m", language: "English", platform: "Other", status: "Watched" },
    { name: "Silver Linings Playbook", genre: ["Comedy", "Drama", "Romance"], year: 2012, playtime: "2h 02m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Crazy, Stupid, Love.", genre: ["Comedy", "Drama", "Romance"], year: 2011, playtime: "1h 58m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "Marriage Story", genre: ["Drama", "Romance"], year: 2019, playtime: "2h 17m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Perks of Being a Wallflower", genre: ["Drama", "Romance"], year: 2012, playtime: "1h 43m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Edge of Seventeen", genre: ["Comedy", "Drama"], year: 2016, playtime: "1h 44m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "To All the Boys I've Loved Before", genre: ["Comedy", "Romance"], year: 2018, playtime: "1h 39m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "To All the Boys: P.S. I Still Love You", genre: ["Comedy", "Romance"], year: 2020, playtime: "1h 41m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "To All the Boys: Always and Forever", genre: ["Comedy", "Romance"], year: 2021, playtime: "1h 49m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Perfect Date", genre: ["Comedy", "Romance"], year: 2019, playtime: "1h 30m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Notebook", genre: ["Drama", "Romance"], year: 2004, playtime: "2h 03m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Jack Reacher", genre: ["Action", "Thriller"], year: 2012, playtime: "2h 10m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Jack Reacher: Never Go Back", genre: ["Action", "Thriller"], year: 2016, playtime: "1h 58m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "He's Just Not That Into You", genre: ["Comedy", "Romance"], year: 2009, playtime: "2h 09m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "The Old Guard", genre: ["Action", "Fantasy"], year: 2020, playtime: "2h 05m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Old Guard 2", genre: ["Action", "Fantasy"], year: 2025, playtime: "2h 10m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Extraction", genre: ["Action", "Thriller"], year: 2020, playtime: "1h 56m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Extraction 2", genre: ["Action", "Thriller"], year: 2023, playtime: "2h 02m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Before We Go", genre: ["Comedy", "Drama", "Romance"], year: 2014, playtime: "1h 35m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Good Will Hunting", genre: ["Drama", "Romance"], year: 1997, playtime: "2h 06m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "It's Kind of a Funny Story", genre: ["Comedy", "Drama", "Romance"], year: 2010, playtime: "1h 41m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Blue Valentine", genre: ["Drama", "Romance"], year: 2010, playtime: "1h 52m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Enola Holmes", genre: ["Action", "Adventure", "Crime"], year: 2020, playtime: "2h 03m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Enola Holmes 2", genre: ["Action", "Adventure", "Crime"], year: 2022, playtime: "2h 09m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Pursuit of Happyness", genre: ["Biography", "Drama"], year: 2006, playtime: "1h 57m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Wonder", genre: ["Drama", "Family"], year: 2017, playtime: "1h 53m", language: "English", platform: "Prime", status: "Watched" },
    { name: "A Quiet Place", genre: ["Horror", "Sci-Fi"], year: 2018, playtime: "1h 30m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "A Quiet Place Part II", genre: ["Horror", "Sci-Fi"], year: 2020, playtime: "1h 37m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "10 Things I Hate About You", genre: ["Comedy", "Romance"], year: 1999, playtime: "1h 37m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "The Theory of Everything", genre: ["Biography", "Drama", "Romance"], year: 2014, playtime: "2h 03m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Love, Rosie", genre: ["Comedy", "Romance"], year: 2014, playtime: "1h 42m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Mulan", genre: ["Action", "Adventure", "Drama"], year: 2020, playtime: "1h 55m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "Tenet", genre: ["Action", "Sci-Fi", "Thriller"], year: 2020, playtime: "2h 30m", language: "English", platform: "Theater", status: "Watched" },
    { name: "Wonder Woman 1984", genre: ["Action", "Adventure", "Fantasy"], year: 2020, playtime: "2h 31m", language: "English", platform: "Theater", status: "Watched" },
    { name: "Zack Snyder's Justice League", genre: ["Action", "Adventure", "Fantasy"], year: 2021, playtime: "4h 02m", language: "English", platform: "Other", status: "Watched" },
    { name: "American Assassin", genre: ["Action", "Thriller"], year: 2017, playtime: "1h 52m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Love and Monsters", genre: ["Action", "Adventure", "Comedy"], year: 2020, playtime: "1h 49m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Hacksaw Ridge", genre: ["Biography", "Drama", "History"], year: 2016, playtime: "2h 19m", language: "English", platform: "Prime", status: "Watched" },
    { name: "Black Widow", genre: ["Action", "Adventure", "Sci-Fi"], year: 2021, playtime: "2h 14m", language: "English", platform: "Theater", status: "Watched" },
    { name: "The Tuxedo", genre: ["Action", "Comedy", "Sci-Fi"], year: 2002, playtime: "1h 38m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Top Gun", genre: ["Action", "Drama"], year: 1986, playtime: "1h 50m", language: "English", platform: "Netflix", status: "Watched" },
    { name: "Top Gun: Maverick", genre: ["Action", "Drama"], year: 2022, playtime: "2h 10m", language: "English", platform: "Theater", status: "Watched" },
    { name: "The Greatest Showman", genre: ["Biography", "Drama", "Musical"], year: 2017, playtime: "1h 45m", language: "English", platform: "Disney+", status: "Watched" },
    { name: "Then Came You", genre: ["Adventure", "Comedy", "Drama"], year: 2018, playtime: "1h 37m", language: "English", platform: "Prime", status: "Watched" }
  ]
};

export const tvShowsData: Record<Language, TVShow[]> = {
  English: [
    { name: "Breaking Bad", genre: ["Crime", "Drama"], yearRange: "2008-2013", language: "English", seasons: 5, platform: "Netflix", status: "Watched" },
    { name: "Game of Thrones", genre: ["Fantasy", "Drama"], yearRange: "2011-2019", language: "English", seasons: 8, platform: "HBO", status: "Watched" },
    { name: "Stranger Things", genre: ["Sci-Fi", "Horror"], yearRange: "2016-2025", language: "English", seasons: 5, platform: "Netflix", status: "Watching" },
    { name: "The Office", genre: ["Comedy"], yearRange: "2005-2013", language: "English", seasons: 9, platform: "Netflix", status: "Watched" },
    { name: "Friends", genre: ["Comedy", "Romance"], yearRange: "1994-2004", language: "English", seasons: 10, platform: "HBO", status: "Watched" },
    { name: "The Last of Us", genre: ["Drama", "Action"], yearRange: "2023-Present", language: "English", seasons: 2, platform: "HBO", status: "Watching" },
    { name: "House of the Dragon", genre: ["Fantasy", "Drama"], yearRange: "2022-Present", language: "English", seasons: 2, platform: "HBO", status: "Watching" },
    { name: "True Detective", genre: ["Crime", "Drama"], yearRange: "2014-Present", language: "English", seasons: 4, platform: "HBO", status: "Planned" },
  ],
  Hindi: [
    { name: "Sacred Games", genre: ["Crime", "Thriller"], yearRange: "2018-2019", language: "Hindi", seasons: 2, platform: "Netflix", status: "Watched" },
    { name: "Mirzapur", genre: ["Crime", "Action"], yearRange: "2018-Present", language: "Hindi", seasons: 3, platform: "Prime", status: "Watched" },
    { name: "Panchayat", genre: ["Comedy", "Drama"], yearRange: "2020-Present", language: "Hindi", seasons: 3, platform: "Prime", status: "Watching" },
    { name: "Scam 1992", genre: ["Biography", "Crime"], yearRange: "2020", language: "Hindi", seasons: 1, platform: "Hotstar", status: "Watched" },
    { name: "Family Man", genre: ["Action", "Drama"], yearRange: "2019-Present", language: "Hindi", seasons: 2, platform: "Prime", status: "Watched" },
    { name: "Kota Factory", genre: ["Drama"], yearRange: "2019-Present", language: "Hindi", seasons: 2, platform: "Netflix", status: "Planned" },
  ],
  French: [
    { name: "Lupin", genre: ["Crime", "Drama"], yearRange: "2021-Present", language: "French", seasons: 3, platform: "Netflix", status: "Watched" },
    { name: "Call My Agent!", genre: ["Comedy", "Drama"], yearRange: "2015-2020", language: "French", seasons: 4, platform: "Netflix", status: "Watching" },
    { name: "The Bureau", genre: ["Drama", "Thriller"], yearRange: "2015-2020", language: "French", seasons: 5, platform: "Prime", status: "Planned" },
    { name: "Marseille", genre: ["Drama", "Thriller"], yearRange: "2016-2018", language: "French", seasons: 2, platform: "Netflix", status: "Planned" },
  ],
  Korean: [
    { name: "Squid Game", genre: ["Thriller", "Drama"], yearRange: "2021-Present", language: "Korean", seasons: 2, platform: "Netflix", status: "Watched" },
    { name: "Crash Landing on You", genre: ["Romance", "Comedy"], yearRange: "2019-2020", language: "Korean", seasons: 1, platform: "Netflix", status: "Watched" },
    { name: "Goblin", genre: ["Fantasy", "Romance"], yearRange: "2016-2017", language: "Korean", seasons: 1, platform: "Netflix", status: "Watched" },
    { name: "Kingdom", genre: ["Horror", "Historical"], yearRange: "2019-2020", language: "Korean", seasons: 2, platform: "Netflix", status: "Watched" },
    { name: "Vincenzo", genre: ["Crime", "Comedy"], yearRange: "2021", language: "Korean", seasons: 1, platform: "Netflix", status: "Watched" },
    { name: "Reply 1988", genre: ["Drama", "Comedy"], yearRange: "2015-2016", language: "Korean", seasons: 1, platform: "Netflix", status: "Watching" },
    { name: "My Name", genre: ["Action", "Crime"], yearRange: "2021", language: "Korean", seasons: 1, platform: "Netflix", status: "Watching" },
    { name: "All of Us Are Dead", genre: ["Horror", "Action"], yearRange: "2022-Present", language: "Korean", seasons: 2, platform: "Netflix", status: "Planned" },
    { name: "The Glory", genre: ["Drama", "Thriller"], yearRange: "2022-2023", language: "Korean", seasons: 2, platform: "Netflix", status: "Watched" },
    { name: "Moving", genre: ["Action", "Fantasy"], yearRange: "2023", language: "Korean", seasons: 1, platform: "Disney+", status: "Planned" },
  ],
  Turkish: [
    { name: "Resurrection: Ertuğrul", genre: ["Historical", "Action"], yearRange: "2014-2019", language: "Turkish", seasons: 5, platform: "Netflix", status: "Watching" },
    { name: "The Protector", genre: ["Fantasy", "Action"], yearRange: "2018-2020", language: "Turkish", seasons: 4, platform: "Netflix", status: "Watched" },
    { name: "Magnificent Century", genre: ["Historical", "Drama"], yearRange: "2011-2014", language: "Turkish", seasons: 4, platform: "Netflix", status: "Planned" },
    { name: "Ethos", genre: ["Drama"], yearRange: "2020", language: "Turkish", seasons: 1, platform: "Netflix", status: "Planned" },
  ],
  Spanish: [
    { name: "Money Heist", genre: ["Crime", "Thriller"], yearRange: "2017-2021", language: "Spanish", seasons: 5, platform: "Netflix", status: "Watched" },
    { name: "Elite", genre: ["Drama", "Thriller"], yearRange: "2018-Present", language: "Spanish", seasons: 8, platform: "Netflix", status: "Watching" },
    { name: "The Paper House: Korea", genre: ["Crime", "Thriller"], yearRange: "2022", language: "Spanish", seasons: 1, platform: "Netflix", status: "Planned" },
    { name: "Vis a Vis", genre: ["Drama", "Thriller"], yearRange: "2015-2019", language: "Spanish", seasons: 4, platform: "Netflix", status: "Planned" },
  ],
  Mexican: [
    { name: "Dark Desire", genre: ["Thriller", "Drama"], yearRange: "2020-2022", language: "Mexican", seasons: 2, platform: "Netflix", status: "Watching" },
    { name: "Who Killed Sara?", genre: ["Mystery", "Thriller"], yearRange: "2021-2022", language: "Mexican", seasons: 3, platform: "Netflix", status: "Watched" },
    { name: "Control Z", genre: ["Drama", "Thriller"], yearRange: "2020-2022", language: "Mexican", seasons: 3, platform: "Netflix", status: "Planned" },
    { name: "Narcos: Mexico", genre: ["Crime", "Drama"], yearRange: "2018-2021", language: "Mexican", seasons: 3, platform: "Netflix", status: "Watched" },
  ],
  Tamil: [
    { name: "Suzhal: The Vortex", genre: ["Mystery", "Thriller"], yearRange: "2022", language: "Tamil", seasons: 1, platform: "Prime", status: "Watched" },
    { name: "The Family Man", genre: ["Action", "Drama"], yearRange: "2019-Present", language: "Tamil", seasons: 2, platform: "Prime", status: "Watching" },
    { name: "Vadhandhi: The Fable of Velonie", genre: ["Mystery", "Thriller"], yearRange: "2022", language: "Tamil", seasons: 1, platform: "Prime", status: "Planned" },
  ],
  Telugu: [
    { name: "Rana Naidu", genre: ["Crime", "Drama"], yearRange: "2023", language: "Telugu", seasons: 1, platform: "Netflix", status: "Watching" },
    { name: "Modern Love Hyderabad", genre: ["Romance", "Drama"], yearRange: "2022", language: "Telugu", seasons: 1, platform: "Prime", status: "Watched" },
    { name: "Loser", genre: ["Drama", "Sports"], yearRange: "2020-2022", language: "Telugu", seasons: 2, platform: "Prime", status: "Planned" },
  ],
  Malayalam: [
    { name: "Karikku", genre: ["Comedy"], yearRange: "2017-Present", language: "Malayalam", seasons: 4, platform: "YouTube", status: "Watching" },
    { name: "Kuthukku Pidicha Kadhaas", genre: ["Anthology", "Drama"], yearRange: "2023", language: "Malayalam", seasons: 1, platform: "Hotstar", status: "Planned" },
    { name: "Ariyippu", genre: ["Drama"], yearRange: "2022", language: "Malayalam", seasons: 1, platform: "Netflix", status: "Planned" },
  ],
  Kannada: [
    { name: "Auto Shankar", genre: ["Crime", "Drama"], yearRange: "2019", language: "Kannada", seasons: 1, platform: "Prime", status: "Watched" },
    { name: "Humble Politician Nograj", genre: ["Comedy", "Political"], yearRange: "2018", language: "Kannada", seasons: 1, platform: "Prime", status: "Watching" },
    { name: "Kempegowda", genre: ["Action", "Drama"], yearRange: "2019", language: "Kannada", seasons: 1, platform: "Prime", status: "Planned" },
  ],
  Indonesian: [
    { name: "The Big 4", genre: ["Action", "Comedy"], yearRange: "2022", language: "Indonesian", seasons: 1, platform: "Netflix", status: "Watched" },
    { name: "Hellbound", genre: ["Horror", "Fantasy"], yearRange: "2021", language: "Indonesian", seasons: 1, platform: "Netflix", status: "Watching" },
    { name: "Detektif Jaga Malam", genre: ["Mystery", "Comedy"], yearRange: "2023", language: "Indonesian", seasons: 1, platform: "Netflix", status: "Planned" },
  ],
  Filipino: [
    { name: "Ang Probinsyano", genre: ["Action", "Drama"], yearRange: "2015-2022", language: "Filipino", seasons: 7, platform: "Netflix", status: "Watched" },
    { name: "Darna", genre: ["Action", "Fantasy"], yearRange: "2022-2023", language: "Filipino", seasons: 1, platform: "Netflix", status: "Watching" },
    { name: "Dirty Linen", genre: ["Drama", "Thriller"], yearRange: "2023", language: "Filipino", seasons: 1, platform: "Netflix", status: "Planned" },
  ],
};

// Helper functions for dynamic stats
export const getStats = () => {
  const allMovies = Object.values(moviesData).flat();
  const allShows = Object.values(tvShowsData).flat();
  
  const movieGenres = new Set<string>();
  const showGenres = new Set<string>();
  
  allMovies.forEach(m => m.genre.forEach(g => movieGenres.add(g)));
  allShows.forEach(s => s.genre.forEach(g => showGenres.add(g)));
  
  const allGenres = new Set([...movieGenres, ...showGenres]);
  
  return {
    languages: LANGUAGES.length,
    movies: allMovies.length,
    tvShows: allShows.length,
    genres: allGenres.size,
  };
};

export const getAllGenres = (type: "movie" | "tvshow"): string[] => {
  const data = type === "movie" ? moviesData : tvShowsData;
  const genres = new Set<string>();
  
  Object.values(data).forEach((items) => {
    items.forEach((item) => {
      item.genre.forEach((g) => genres.add(g));
    });
  });
  
  return Array.from(genres).sort();
};

export const getPlatformColor = (platform: Platform): string => {
  const colors: Record<Platform, string> = {
    Netflix: "platform-netflix",
    Prime: "platform-prime",
    "Disney+": "platform-disney",
    HBO: "platform-hbo",
    "Apple TV+": "platform-apple",
    Hotstar: "platform-hotstar",
    YouTube: "platform-youtube",
    Theater: "platform-other",
    Other: "platform-other",
  };
  return colors[platform] || "platform-other";
};
