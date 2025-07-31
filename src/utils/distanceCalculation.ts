
import { supabase } from '@/integrations/supabase/client';

export interface DistanceResult {
  distance: number;
  warning?: string;
  error?: string;
}

export const calculateDistanceBetweenCities = async (pickupCity: string, destinationCity: string): Promise<DistanceResult> => {
  try {
    console.log(`Attempting to calculate distance between ${pickupCity} and ${destinationCity}`);
    
    const { data, error } = await supabase.functions.invoke('calculate-distance', {
      body: { pickupCity, destinationCity }
    });

    if (error) {
      console.error('Error calling distance function:', error);
      return { 
        distance: getDefaultDistance(pickupCity, destinationCity), 
        error: error.message, 
        warning: 'Using estimated distance due to API error' 
      };
    }

    console.log('Distance API response:', data);

    if (data?.distance && typeof data.distance === 'number' && data.distance > 0) {
      return {
        distance: data.distance,
        warning: data.warning,
        error: data.error
      };
    }

    // If no valid distance returned, use fallback
    const fallbackDistance = getDefaultDistance(pickupCity, destinationCity);
    return { 
      distance: fallbackDistance, 
      warning: data?.warning || 'No valid distance returned from API, using estimated distance' 
    };
    
  } catch (error) {
    console.error('Error calling distance function:', error);
    const fallbackDistance = getDefaultDistance(pickupCity, destinationCity);
    return { 
      distance: fallbackDistance, 
      error: String(error), 
      warning: 'Using estimated distance due to calculation error' 
    };
  }
};

// Enhanced fallback distance calculation
function getDefaultDistance(pickupCity: string, destinationCity: string): number {
  const cityDistances: { [key: string]: number } = {
    'delhi-mumbai': 1400, 'mumbai-delhi': 1400,
    'delhi-bangalore': 2100, 'bangalore-delhi': 2100,
    'mumbai-bangalore': 980, 'bangalore-mumbai': 980,
    'delhi-chennai': 2200, 'chennai-delhi': 2200,
    'mumbai-chennai': 1340, 'chennai-mumbai': 1340,
    'delhi-kolkata': 1500, 'kolkata-delhi': 1500,
    'varanasi-hyderabad': 1200, 'hyderabad-varanasi': 1200,
    'delhi-hyderabad': 1600, 'hyderabad-delhi': 1600,
    'mumbai-hyderabad': 700, 'hyderabad-mumbai': 700,
    'varanasi-delhi': 800, 'delhi-varanasi': 800,
    'varanasi-mumbai': 1200, 'mumbai-varanasi': 1200,
    'varanasi-bangalore': 1500, 'bangalore-varanasi': 1500,
    'varanasi-chennai': 1300, 'chennai-varanasi': 1300,
    'varanasi-kolkata': 700, 'kolkata-varanasi': 700,
  };
  
  const normalizeCity = (city: string) => {
    return city.toLowerCase().replace(/[^a-z\s]/g, '').trim().split(' ')[0];
  };
  
  const key1 = `${normalizeCity(pickupCity)}-${normalizeCity(destinationCity)}`;
  const key2 = `${normalizeCity(destinationCity)}-${normalizeCity(pickupCity)}`;
  
  return cityDistances[key1] || cityDistances[key2] || 500;
}
