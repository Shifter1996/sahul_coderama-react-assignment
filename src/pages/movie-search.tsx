import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { searchMovies } from "@/lib/api/omdb_api"
import { useMovieContext } from "@/context/movie-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { SEARCH_PAGE_SIZE } from "@/lib/utils"

export default function MovieSearch() {
  const navigate = useNavigate()
  const { searchState, setSearchState } = useMovieContext()
  const [searchInput, setSearchInput] = useState(searchState.query)
  const [currentPage, setCurrentPage] = useState(searchState.page)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["movies", searchState.query, currentPage],
    queryFn: () => searchMovies(searchState.query, currentPage),
    enabled: searchState.query !== "",
  })

  const totalPages = data?.totalResults ? Math.ceil(Number(data.totalResults) / SEARCH_PAGE_SIZE) : 0;

  // Update search state when page changes
  useEffect(() => {
    setSearchState(prev => ({... prev, page: currentPage}));
  }, [currentPage, setSearchState])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setCurrentPage(1)
      setSearchState({
        query: searchInput,
        page: 1,
      })
      refetch()
    }
  }

  const handleMovieClick = (id: string) => {
    navigate(`/movie/${id}`)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  return (
    <div className="container p-6" ref={containerRef}>
      <h1 className="text-2xl font-bold mb-6">Movie Search</h1>

      <form onSubmit={handleSearch} className="flex w-full max-w-lg gap-2 mb-8">
        <Input
          type="text"
          placeholder="Search for movies..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {searchState.query && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Showing results for "{searchState.query}"</p>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-12" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {!isLoading && data?.Search && data.Search.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poster</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Genre</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.Search.map((movie) => (
                <TableRow
                  key={movie.imdbID}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleMovieClick(movie.imdbID)}
                >
                  <TableCell>
                    <img
                      src={movie.Poster || "/placeholder.svg"}
                      alt={`${movie.Title} poster`}
                      className="h-16 w-auto object-cover rounded"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{movie.Title}</TableCell>
                  <TableCell>{movie.Year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : searchState.query ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No movies found for "{searchState.query}"</p>
        </div>
      ) : null}
    </div>
  )
}

