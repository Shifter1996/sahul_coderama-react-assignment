import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import MovieDetail from "@/pages/movie-detail"
import { useParams } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getMovieById, OMDbResponse } from "@/lib/api/omdb_api"
import { useMovieContext } from "@/context/movie-context"

// Mock the modules
vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(),
}))

vi.mock("@/lib/api/omdb_api", () => ({
    getMovieById: vi.fn(),
}))  

vi.mock("@/context/movie-context", () => ({
  useMovieContext: vi.fn(),
}))


// Sample movie data for testing
const mockMovie : OMDbResponse = {
  imdbID: "tt0111161",
  Title: "The Shawshank Redemption",
  Year: "1994",
  Genre: "Drama",
  Plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
  Director: "Frank Darabont",
  Actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
  Type: "movie",
  Poster: "https://example.com/poster.jpg",
}

// Create a wrapper component with QueryClientProvider
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false }
        },
    })

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
};

// These are just couple example tests, there's a lot of stuff that can be tested here
// however first I'd first try to rework the component to better isolate tested parts
describe("MovieDetail Component", () => {

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useParams).mockReturnValue({ id: "321325354654" })
    vi.mocked(useMovieContext).mockReturnValue({
      isFavorite: () => false,
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
      favorites: [],
      searchState: { query: "", page: 1 },
      setSearchState: vi.fn(),
    })
  })

  it("should show error message when movie is not found", async () => {
    // Mock the API to reject with an error
    vi.mocked(getMovieById).mockRejectedValue(new Error("Movie not found"))

    render(<MovieDetail />, { wrapper: createWrapper() })

    // Wait for the error state to be rendered
    await waitFor(() => {
      expect(screen.getByText("Movie not found")).toBeInTheDocument()
    })
    expect(screen.getByText("Sorry, we couldn't find the movie you're looking for.")).toBeInTheDocument()
  })

  it("should render movie details correctly", async () => {
    vi.mocked(getMovieById).mockResolvedValue(mockMovie)

    render(<MovieDetail />, { wrapper: createWrapper() })

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText("The Shawshank Redemption")).toBeInTheDocument()
    })

    expect(screen.getByText("1994")).toBeInTheDocument()
    expect(screen.getByText("Drama")).toBeInTheDocument()
    expect(screen.getByText("Plot")).toBeInTheDocument()
    expect(screen.getByText("Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.")).toBeInTheDocument()
    expect(screen.getByText("Director")).toBeInTheDocument()
    expect(screen.getByText("Frank Darabont")).toBeInTheDocument()
    expect(screen.getByText("Cast")).toBeInTheDocument()
    expect(screen.getByText("Tim Robbins, Morgan Freeman, Bob Gunton")).toBeInTheDocument()

    const poster = screen.getByAltText("The Shawshank Redemption poster")
    expect(poster).toBeInTheDocument()
    expect(poster.getAttribute("src")).toBe("https://example.com/poster.jpg")
  })
})

