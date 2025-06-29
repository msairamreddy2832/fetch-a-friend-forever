import { Button } from "@/components/ui/button";
import { DogCard } from "./DogCard";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogGridProps {
  dogs: Dog[];
  favorites: Dog[];
  onFavoriteToggle: (dog: Dog) => void;
  isLoading: boolean;
  pagination: {
    total: number;
    next: string | null;
    prev: string | null;
  };
  onPageChange: (direction: 'next' | 'prev') => void;
}

export const DogGrid = ({ 
  dogs, 
  favorites, 
  onFavoriteToggle, 
  isLoading, 
  pagination, 
  onPageChange 
}: DogGridProps) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Dogs
          {pagination.total > 0 && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({pagination.total.toLocaleString()} total)
            </span>
          )}
        </h2>
      </div>

      {/* Results grid */}
      {dogs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🐕</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No dogs found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map(dog => (
              <DogCard
                key={dog.id}
                dog={dog}
                isFavorite={favorites.some(fav => fav.id === dog.id)}
                onFavoriteToggle={() => onFavoriteToggle(dog)}
              />
            ))}
          </div>

          {/* Pagination */}
          {(pagination.prev || pagination.next) && (
            <div className="flex justify-center gap-2 pt-8">
              <Button
                variant="outline"
                onClick={() => onPageChange('prev')}
                disabled={!pagination.prev}
                className="flex items-center gap-2"
              >
                <ChevronUp className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => onPageChange('next')}
                disabled={!pagination.next}
                className="flex items-center gap-2"
              >
                Next
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
