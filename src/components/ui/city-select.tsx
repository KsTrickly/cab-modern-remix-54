
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCities } from "@/hooks/useCities";

interface CitySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CitySelect = ({ value, onValueChange, placeholder = "Select a city", className }: CitySelectProps) => {
  const { data: cities, isLoading, error } = useCities();

  if (error) {
    console.error('Error loading cities:', error);
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? "Loading cities..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-y-auto">
        {cities?.map((city) => (
          <SelectItem 
            key={city.id} 
            value={city.id}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            {city.name} {city.state_code && `(${city.state_code})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
