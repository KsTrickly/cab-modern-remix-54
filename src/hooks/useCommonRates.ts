
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCommonRates = (pickupCityId: string | null, vehicleId: string | null, tripType: string = 'round_trip') => {
  return useQuery({
    queryKey: ['commonRates', pickupCityId, vehicleId, tripType],
    queryFn: async () => {
      if (!pickupCityId || !vehicleId) {
        return null;
      }

      const { data, error } = await supabase
        .from('common_rates')
        .select(`
          *,
          pickup_city:cities!pickup_city_id(id, name),
          vehicle:vehicles(id, name, model)
        `)
        .eq('pickup_city_id', pickupCityId)
        .eq('vehicle_id', vehicleId)
        .eq('trip_type', tripType)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error("Error fetching common rates:", error);
        return null;
      }
      return data;
    },
    enabled: !!pickupCityId && !!vehicleId,
  });
};
