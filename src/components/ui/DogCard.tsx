import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export const DogCard = ({ dog, isFavorite, onFavoriteToggle }: DogCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={dog.img}
            alt={dog.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onFavoriteToggle}
          className={`absolute top-2 right-2 rounded-full p-2 ${
            isFavorite 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-white/80 hover:bg-white text-gray-700'
          } backdrop-blur-sm shadow-sm`}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`}
          />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {dog.name}
          </h3>
          
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-medium text-blue-600">{dog.breed}</p>
            <p>{dog.age} {dog.age === 1 ? 'year' : 'years'} old</p>
            <p>{dog.zip_code}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
