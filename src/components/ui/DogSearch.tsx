import { useState, useEffect } from "react";
import { DogFilters } from "./DogFilters";
import { DogGrid } from "./DogGrid";
import { FavoritesList } from "./FavoritesList";
import { MatchResult } from "./MatchResult";
import { Button } from "@/components/ui/button";
import { Heart, User, LogOut, Dog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogSearchProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export const DogSearch = ({ user, onLogout }: DogSearchProps) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [breeds, setBreeds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchParams, setSearchParams] = useState({
    breeds: [] as string[],
    sort: 'breed:asc',
    size: 25,
    from: undefined as string | undefined,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    next: null as string | null,
    prev: null as string | null,
  });
  const { toast } = useToast();

  // Load breeds on mount
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include'
        });
        if (response.ok) {
          const breedsData = await response.json();
          setBreeds(breedsData);
        }
      } catch (error) {
        console.error('Error loading breeds:', error);
      }
    };

    loadBreeds();
  }, []);

  // Initial search
  useEffect(() => {
    searchDogs();
  }, []);

  const searchDogs = async (params = searchParams) => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      if (params.breeds.length > 0) {
        params.breeds.forEach(breed => queryParams.append('breeds', breed));
      }
      queryParams.append('sort', params.sort);
      queryParams.append('size', params.size.toString());
      if (params.from) {
        queryParams.append('from', params.from);
      }

      const response = await fetch(
        `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams}`,
        { credentials: 'include' }
      );

      if (response.ok) {
        const searchResult = await response.json();
        
        // Fetch dog details
        const dogsResponse = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(searchResult.resultIds),
        });

        if (dogsResponse.ok) {
          const dogsData = await dogsResponse.json();
          setDogs(dogsData);
          setPagination({
            total: searchResult.total,
            next: searchResult.next,
            prev: searchResult.prev,
          });
        }
      }
    } catch (error) {
      console.error('Error searching dogs:', error);
      toast({
        title: "Search failed",
        description: "Failed to load dogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: { breeds: string[]; sort: string }) => {
    const newParams = { ...searchParams, ...filters, from: undefined };
    setSearchParams(newParams);
    searchDogs(newParams);
  };

  const handlePageChange = (direction: 'next' | 'prev') => {
    const cursor = direction === 'next' ? pagination.next : pagination.prev;
    if (cursor) {
      const newParams = { ...searchParams, from: cursor };
      setSearchParams(newParams);
      searchDogs(newParams);
    }
  };

  const handleFavoriteToggle = (dog: Dog) => {
    const isFavorite = favorites.some(fav => fav.id === dog.id);
    if (isFavorite) {
      setFavorites(favorites.filter(fav => fav.id !== dog.id));
    } else {
      setFavorites([...favorites, dog]);
    }
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      toast({
        title: "No favorites selected",
        description: "Please add some dogs to your favorites first!",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(favorites.map(dog => dog.id)),
      });

      if (response.ok) {
        const matchResult = await response.json();
        const matchedDog = favorites.find(dog => dog.id === matchResult.match);
        if (matchedDog) {
          setMatch(matchedDog);
          toast({
            title: "Match found!",
            description: `We found your perfect companion: ${matchedDog.name}!`,
          });
        }
      }
    } catch (error) {
      console.error('Error generating match:', error);
      toast({
        title: "Match failed",
        description: "Failed to generate match. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header with cute logo */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-lg shadow-md transform rotate-6">
                  <Dog className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-400 to-red-500 p-1 rounded-full shadow-sm">
                  <Heart className="h-2 w-2 text-white fill-current" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Fetch</h1>
                <p className="text-xs text-gray-500 -mt-1">Find your perfect companion 🐾</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFavorites(!showFavorites)}
                className="flex items-center gap-2 border-orange-200 hover:border-orange-300 hover:bg-orange-50"
              >
                <Heart className={`h-4 w-4 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                Favorites ({favorites.length})
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                <User className="h-4 w-4" />
                {user?.name}
              </div>
              
              <Button variant="ghost" onClick={onLogout} size="sm" className="hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            <DogFilters
              breeds={breeds}
              onFilterChange={handleFilterChange}
              isLoading={isLoading}
            />

            {favorites.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Favorites ({favorites.length})
                  </h3>
                  <Button
                    onClick={handleGenerateMatch}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    size="sm"
                  >
                    Find My Match!
                  </Button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {favorites.slice(0, 3).map(dog => (
                    <div key={dog.id} className="flex items-center gap-2 text-sm">
                      <img src={dog.img} alt={dog.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="truncate">{dog.name}</span>
                    </div>
                  ))}
                  {favorites.length > 3 && (
                    <p className="text-xs text-gray-500">+{favorites.length - 3} more</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {showFavorites ? (
              <FavoritesList
                favorites={favorites}
                onRemove={(dog) => handleFavoriteToggle(dog)}
                onGenerateMatch={handleGenerateMatch}
                onBackToSearch={() => setShowFavorites(false)}
              />
            ) : (
              <DogGrid
                dogs={dogs}
                favorites={favorites}
                onFavoriteToggle={handleFavoriteToggle}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Match Modal */}
      {match && (
        <MatchResult
          match={match}
          onClose={() => setMatch(null)}
        />
      )}
    </div>
  );
};
