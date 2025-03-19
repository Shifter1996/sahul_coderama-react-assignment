export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: "movie" | "series" | "episode";
  Poster: string;
}

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: "True" | "False";
}

export interface OMDbResponse extends Movie {
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Ratings?: { Source: string; Value: string }[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
}

class OMDbClient {
  private apiKey: string;
  private baseUrl: string = "https://www.omdbapi.com/";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async fetchFromAPI<T>(params: Record<string, string>): Promise<T> {
    const url = new URL(this.baseUrl);
    params["apikey"] = this.apiKey;
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response.json();
  }
}

const client = new OMDbClient("API_KEY");

export async function getMovieByTitle(title: string, year?: string, plot: "short" | "full" = "short"): Promise<OMDbResponse> {
  return client.fetchFromAPI<OMDbResponse>({ t: title, y: year ?? "", plot });
}

export async function getMovieById(imdbID: string, plot: "short" | "full" = "short"): Promise<OMDbResponse> {
  return client.fetchFromAPI<OMDbResponse>({ i: imdbID, plot });
}

export async function searchMovies(query: string, page: number = 1): Promise<SearchResponse> {
  return client.fetchFromAPI<SearchResponse>({ s: query, page: page.toString() });
}