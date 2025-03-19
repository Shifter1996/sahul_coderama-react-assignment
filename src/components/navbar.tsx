import { NavLink } from "react-router-dom"
import { Film, Heart, Search } from "lucide-react"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10 px-6">
          <NavLink to="/" className="flex items-center space-x-2">
            <Film className="h-6 w-6" />
            <span className="inline-block font-bold">MovieApp</span>
          </NavLink>
          <nav className="flex gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/60"} transition-colors hover:text-foreground`
              }
            >
              <Search className="mr-1 h-4 w-4" />
              Search
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/60"} transition-colors hover:text-foreground`
              }
            >
              <Heart className="mr-1 h-4 w-4" />
              Favorites
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  )
}

