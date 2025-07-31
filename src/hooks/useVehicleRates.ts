import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistanceBetweenCities } from '@/utils/distanceCalculation';

export const useVehicleRatesWithFallback = (
  pickupCityId: string | null, 
  destinationCityId: string | null,
  pickupCityName?: string,
  destinationCityName?: string,
  tripType: string = 'round_trip'
) => {
  return useQuery({
    queryKey: ['vehicleRatesWithFallback', pickupCityId, destinationCityId, tripType, pickupCityName, destinationCityName],
    queryFn: async () => {
      if (!pickupCityId) {
        console.log('No pickup city ID provided');
        return [];
      }

      console.log('Fetching rates for:', { pickupCityId, destinationCityId, tripType });

      // Check if destination is a Google Maps location (not in database)
      const isGoogleMapsDestination = destinationCityId?.startsWith('google_maps_');
      
      // Always use fallback for Google Maps destinations or when no specific rates exist
      if (!isGoogleMapsDestination && destinationCityId) {
        const { data: specificRates, error: specificError } = await supabase
          .from('vehicle_rates')
          .select(`
            *,
            pickup_city:cities!pickup_city_id(id, name),
            destination_city:cities!destination_city_id(id, name),
            vehicle:vehicles(id, name, model, seating_capacity, image_url, vehicle_type, is_active),
            package:local_packages!package_id(id, name, hours, kilometers)
          `)
          .eq('pickup_city_id', pickupCityId)
          .eq('destination_city_id', destinationCityId)
          .eq('trip_type', tripType)
          .eq('is_active', true);

        if (specificError) {
          console.error("Error fetching specific rates:", specificError);
        }

        // If we have specific rates, return them
        if (specificRates && specificRates.length > 0) {
          console.log('Using specific rates:', specificRates);
          return { rates: specificRates, distanceInfo: null };
        }
      }

      // Fallback to common rates with distance calculation
      const reason = isGoogleMapsDestination 
        ? 'Google Maps destination detected' 
        : !destinationCityId 
        ? 'No destination city in database' 
        : 'No specific rates found';
      console.log(`${reason}, using common rates with distance calculation`);
      
      const { data: commonRates, error: commonError } = await supabase
        .from('common_rates')
        .select(`
          *,
          pickup_city:cities!pickup_city_id(id, name),
          vehicle:vehicles(id, name, model, seating_capacity, image_url, vehicle_type, is_active)
        `)
        .eq('pickup_city_id', pickupCityId)
        .eq('trip_type', tripType)
        .eq('is_active', true);

      if (commonError) {
        console.error("Error fetching common rates:", commonError);
        throw new Error("Failed to load vehicle rates");
      }

      if (!commonRates || commonRates.length === 0) {
        console.log('No common rates found');
        return { rates: [], distanceInfo: null };
      }

      console.log('Found common rates:', commonRates);

      // Calculate distance if we have city names
      let distanceResult = { distance: 300, warning: 'Using default distance' };
      if (pickupCityName && destinationCityName && tripType !== 'local') {
        console.log('Calculating distance between:', pickupCityName, 'and', destinationCityName);
        const result = await calculateDistanceBetweenCities(pickupCityName, destinationCityName);
        distanceResult = {
          distance: result.distance,
          warning: result.warning || 'Distance calculated successfully'
        };
        console.log(`Distance calculation result:`, distanceResult);
      }

      // Transform common rates to match vehicle_rates structure
      const transformedRates = commonRates.map(rate => ({
        id: rate.id,
        pickup_city_id: rate.pickup_city_id,
        destination_city_id: destinationCityId,
        vehicle_id: rate.vehicle_id,
        total_running_km: tripType === 'round_trip' ? distanceResult.distance * 2 : distanceResult.distance,
        daily_km_limit: rate.daily_km_limit,
        per_km_charges: rate.per_km_charges,
        extra_per_km_charge: rate.extra_per_km_charge,
        day_driver_allowance: rate.day_driver_allowance,
        night_charge: rate.night_charge,
        extra_per_hour_charge: rate.extra_per_hour_charge,
        base_fare: rate.base_fare || 0,
        trip_type: rate.trip_type,
        is_active: rate.is_active,
        created_at: rate.created_at,
        updated_at: rate.updated_at,
        pickup_city: rate.pickup_city,
        destination_city: destinationCityName ? { id: destinationCityId, name: destinationCityName } : null,
        vehicle: rate.vehicle,
        package: null,
        package_id: null
      }));

      console.log('Using common rates with calculated distance:', transformedRates);
      return { rates: transformedRates, distanceInfo: distanceResult };
    },
    enabled: !!pickupCityId,
  });
};

// Keep the original hook for backward compatibility
export const useVehicleRates = (pickupCityId: string | null, destinationCityId: string | null) => {
  return useQuery({
    queryKey: ['vehicleRates', pickupCityId, destinationCityId],
    queryFn: async () => {
      if (!pickupCityId || !destinationCityId) {
        return [];
      }

      const { data, error } = await supabase
        .from('vehicle_rates')
        .select(`
          *,
          pickup_city:cities!pickup_city_id(id, name),
          destination_city:cities!destination_city_id(id, name),
          vehicle:vehicles(id, name, model),
          package:local_packages!package_id(id, name, hours, kilometers)
        `)
        .eq('pickup_city_id', pickupCityId)
        .eq('destination_city_id', destinationCityId)
        .eq('is_active', true);

      if (error) {
        console.error("Error fetching vehicle rates:", error);
        throw new Error("Failed to load vehicle list.");
      }
      return data || [];
    },
  });
};
