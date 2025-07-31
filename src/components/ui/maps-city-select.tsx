
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCities } from '@/hooks/useCities';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MapsCitySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface CityLocation {
  lat: number;
  lng: number;
}

export const MapsCitySelect = ({ 
  value, 
  onValueChange, 
  placeholder = "Search destination", 
  className 
}: MapsCitySelectProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState<{ id: string; name: string } | null>(null);
  const sessionToken = useRef(new Date().getTime().toString());
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { data: cities } = useCities();

  // Set selected city name when value changes
  useEffect(() => {
    if (value && cities) {
      const city = cities.find(c => c.id === value);
      if (city) {
        setSelectedCity({ id: city.id, name: city.name });
        setSearchValue(city.name);
      } else if (value.startsWith('google_maps_') && selectedCity) {
        // Keep the Google Maps selected city if it's already set
        setSearchValue(selectedCity.name);
      }
    } else if (!value) {
      setSelectedCity(null);
      setSearchValue('');
    }
  }, [value, cities]);

  // Debounced search for place predictions
  useEffect(() => {
    if (!searchValue.trim() || searchValue.length < 1) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);
    const timeoutId = setTimeout(async () => {
      await searchPlaces(searchValue);
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchPlaces = async (input: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('maps-autocomplete', {
        body: {
          action: 'autocomplete',
          input,
          sessionToken: sessionToken.current
        }
      });

      if (error) throw error;

      if (data?.predictions) {
        setPredictions(data.predictions);
      }
    } catch (error) {
      console.error('Place search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search locations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<{ location: CityLocation; addressComponents: any[]; formattedAddress: string } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('maps-autocomplete', {
        body: {
          action: 'placeDetails',
          placeId,
          sessionToken: sessionToken.current
        }
      });

      if (error) throw error;

      if (data?.result?.geometry?.location) {
        return {
          location: {
            lat: data.result.geometry.location.lat,
            lng: data.result.geometry.location.lng
          },
          addressComponents: data.result.address_components || [],
          formattedAddress: data.result.formatted_address || ''
        };
      }
    } catch (error) {
      console.error('Place details error:', error);
    }
    return null;
  };

  const extractCityFromAddress = (addressComponents: any[], fullAddress: string): string | null => {
    if (!cities) return null;

    // Try to extract city from Google Maps address components
    const cityTypes = ['locality', 'administrative_area_level_2', 'administrative_area_level_1'];
    
    for (const component of addressComponents) {
      const componentCity = component.long_name;
      for (const type of cityTypes) {
        if (component.types.includes(type)) {
          // Check if this component matches any city in our database
          const matchedCity = cities.find(city => 
            city.name.toLowerCase() === componentCity.toLowerCase() ||
            componentCity.toLowerCase().includes(city.name.toLowerCase()) ||
            city.name.toLowerCase().includes(componentCity.toLowerCase())
          );
          if (matchedCity) {
            return matchedCity.id;
          }
        }
      }
    }

    // Fallback: try to match from the full address string
    const addressLower = fullAddress.toLowerCase();
    const matchedCity = cities.find(city => 
      addressLower.includes(city.name.toLowerCase())
    );
    
    return matchedCity?.id || null;
  };

  const handlePlaceSelect = async (prediction: PlacePrediction) => {
    setShowSuggestions(false);
    setIsLoading(true);
    setSearchValue(prediction.structured_formatting.main_text);
    
    try {
      const placeDetails = await getPlaceDetails(prediction.place_id);
      
      if (placeDetails) {
        const cityId = extractCityFromAddress(
          placeDetails.addressComponents, 
          placeDetails.formattedAddress
        );
        
        if (cityId) {
          // Found matching city in database
          const matchedCity = cities?.find(c => c.id === cityId);
          if (matchedCity) {
            setSelectedCity({ id: matchedCity.id, name: matchedCity.name });
            onValueChange(matchedCity.id);
            
            toast({
              title: "Address Mapped",
              description: `Selected ${matchedCity.name} for your booking`,
            });
          }
        } else {
          // No matching city in database, use Google Maps data for common rates
          const cityName = prediction.structured_formatting.main_text;
          // Store city name in the ID for easier extraction
          setSelectedCity({ id: `google_maps_${cityName}_${prediction.place_id}`, name: cityName });
          onValueChange(`google_maps_${cityName}_${prediction.place_id}`);
          
          toast({
            title: "Location Selected",
            description: `Using ${cityName} with common rates for pricing`,
          });
        }
        
        setPredictions([]);
      }
      
      // Generate new session token for next search
      sessionToken.current = new Date().getTime().toString();
      
    } catch (error) {
      console.error('Place selection error:', error);
      toast({
        title: "Selection Error",
        description: "Failed to process location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectCitySelect = (cityId: string) => {
    const city = cities?.find(c => c.id === cityId);
    if (city) {
      setSelectedCity({ id: city.id, name: city.name });
      setSearchValue(city.name);
      onValueChange(cityId);
      setShowSuggestions(false);
      setPredictions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    if (newValue.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputFocus = () => {
    if (searchValue.trim()) {
      setShowSuggestions(true);
    }
  };

  // Check if search value matches a city directly
  const directCityMatch = cities?.find(city => 
    city.name.toLowerCase() === searchValue.toLowerCase()
  );

  // Filter cities based on search value
  const filteredCities = cities?.filter(city => 
    !searchValue || 
    city.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-10 pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      </div>
      
      {showSuggestions && (searchValue.trim() || predictions.length > 0) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
            </div>
          )}
          
          {/* Show direct city match first if it exists */}
          {directCityMatch && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                Exact Match
              </div>
              <button
                onClick={() => handleDirectCitySelect(directCityMatch.id)}
                className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center gap-2 bg-blue-50 font-medium"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">{directCityMatch.name}</span>
                {directCityMatch.state_code && (
                  <span className="text-xs text-blue-600">
                    ({directCityMatch.state_code})
                  </span>
                )}
              </button>
            </div>
          )}
          
          {predictions.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                Suggested Locations
              </div>
              {predictions.map((prediction) => (
                <button
                  key={prediction.place_id}
                  onClick={() => handlePlaceSelect(prediction)}
                  className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <div className="font-medium text-sm truncate">{prediction.structured_formatting.main_text}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {prediction.structured_formatting.secondary_text}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {!isLoading && predictions.length === 0 && searchValue.length >= 1 && filteredCities && filteredCities.length > 0 && !directCityMatch && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                Available Cities
              </div>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleDirectCitySelect(city.id)}
                  className="w-full text-left px-3 py-2 hover:bg-muted/50 flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{city.name}</span>
                  {city.state_code && (
                    <span className="text-xs text-muted-foreground">
                      ({city.state_code})
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          
          {!isLoading && predictions.length === 0 && searchValue.length >= 1 && (!filteredCities || filteredCities.length === 0) && (
            <div className="px-3 py-4 text-sm text-muted-foreground text-center">
              No locations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
