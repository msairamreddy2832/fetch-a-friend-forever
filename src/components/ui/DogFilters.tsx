import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DogFiltersProps {
  breeds: string[];
  onFilterChange: (filters: { breeds: string[]; sort: string }) => void;
  isLoading: boolean;
}

export const DogFilters = ({ breeds, onFilterChange, isLoading }: DogFiltersProps) => {
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('breed:asc');
  const [breedSearch, setBreedSearch] = useState('');

  const filteredBreeds = breeds.filter(breed =>
    breed.toLowerCase().includes(breedSearch.toLowerCase())
  );

  const handleBreedToggle = (breed: string) => {
    const updated = selectedBreeds.includes(breed)
      ? selectedBreeds.filter(b => b !== breed)
      : [...selectedBreeds, breed];
    
    setSelectedBreeds(updated);
    onFilterChange({ breeds: updated, sort: sortBy });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    onFilterChange({ breeds: selectedBreeds, sort: newSort });
  };

  const clearAllFilters = () => {
    setSelectedBreeds([]);
    setSortBy('breed:asc');
    setBreedSearch('');
    onFilterChange({ breeds: [], sort: 'breed:asc' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sort */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Sort by
            </label>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breed:asc">Breed (A-Z)</SelectItem>
                <SelectItem value="breed:desc">Breed (Z-A)</SelectItem>
                <SelectItem value="name:asc">Name (A-Z)</SelectItem>
                <SelectItem value="name:desc">Name (Z-A)</SelectItem>
                <SelectItem value="age:asc">Age (Young to Old)</SelectItem>
                <SelectItem value="age:desc">Age (Old to Young)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Breed Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Breed ({selectedBreeds.length} selected)
            </label>
            
            {/* Search breeds */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search breeds..."
                value={breedSearch}
                onChange={(e) => setBreedSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Breed list */}
            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-md p-2">
              {filteredBreeds.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  {breedSearch ? 'No breeds found' : 'Loading breeds...'}
                </p>
              ) : (
                filteredBreeds.map(breed => (
                  <div key={breed} className="flex items-center space-x-2">
                    <Checkbox
                      id={breed}
                      checked={selectedBreeds.includes(breed)}
                      onCheckedChange={() => handleBreedToggle(breed)}
                    />
                    <label
                      htmlFor={breed}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {breed}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          {(selectedBreeds.length > 0 || sortBy !== 'breed:asc') && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full"
              disabled={isLoading}
            >
              Clear All Filters
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
