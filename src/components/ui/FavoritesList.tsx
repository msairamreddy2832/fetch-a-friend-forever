
import { Button } from "@/components/ui/button";
import { DogCard } from "./DogCard";
import { ArrowLeft } from "lucide-react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface FavoritesListProps {
  favorites: Dog[];
  onRemove: (dog: Dog) => void;
  onGenerateMatch: () => void;
  onBackToSearch: () => void;
}

export const FavoritesList = ({ 
  favorites, 
  onRemove, 
  onGenerateMatch, 
  onBackToSearch 
}: FavoritesListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBackToSearch} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Favorites ({favorites.length})
          </h2>
        </div>
        
        {favorites.length > 0 && (
          <Button
            onClick={onGenerateMatch}
            className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-lg px-6 py-2"
          >
            Find My Perfect Match! 🎯
          </Button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-600">Start browsing and add some dogs to your favorites!</p>
          <Button onClick={onBackToSearch} className="mt-4" variant="outline">
            Browse Dogs
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(dog => (
            <DogCard
              key={dog.id}
              dog={dog}
              isFavorite={true}
              onFavoriteToggle={() => onRemove(dog)}
            />
          ))}
        </div>
      )}
    </div>
  );
};