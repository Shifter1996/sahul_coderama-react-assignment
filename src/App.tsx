import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { MovieProvider } from "./context/movie-context"
import Navbar from "./components/navbar"
import MovieSearch from "./pages/movie-search"
import MovieDetail from "./pages/movie-detail"
import FavoriteMovies from "./pages/favorite-movies"
import { Toaster } from "sonner"

const queryClient = new QueryClient();

export default function App() {
  // const [searchTerm, setSearchTerm] = useState(decodeURIComponent(window.location.hash.slice(1)));
  // const { isLoading, data: forexData } = useQuery({ queryKey: ['forexData', searchTerm], queryFn: () => getForexData(searchTerm) });

  // const updateSearchTearm = (newSearchTerm: string) => {
  //   setSearchTerm(newSearchTerm);
  //   window.location.hash = encodeURIComponent(newSearchTerm);
  // };

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MovieProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">
              <Routes>
                <Route path="/" element={<MovieSearch />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/favorites" element={<FavoriteMovies />} />
              </Routes>
              </div>
            </div>
            <Toaster />
          </MovieProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

