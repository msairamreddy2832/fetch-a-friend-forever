import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart } from "lucide-react";

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface MatchResultProps {
  match: Dog;
  onClose: () => void;
}

export const MatchResult = ({ match, onClose }: MatchResultProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            It's a Match!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <div className="relative">
            <img
              src={match.img}
              alt={match.name}
              className="w-48 h-48 mx-auto rounded-full object-cover border-4 border-gradient-to-r from-blue-600 to-orange-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-full">
              <Heart className="h-6 w-6 text-white fill-current" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-gray-900">{match.name}</h3>
            <p className="text-lg text-blue-600 font-semibold">{match.breed}</p>
            <p className="text-gray-600">
              {match.age} {match.age === 1 ? 'year' : 'years'} old • {match.zip_code}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-4 rounded-lg">
            <p className="text-gray-700 font-medium">
              🎉 Congratulations! Based on your favorites, we think {match.name} would be the perfect companion for you!
            </p>
          </div>
          
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
          >
            Amazing! Let's Connect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
