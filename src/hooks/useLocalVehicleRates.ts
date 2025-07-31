
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLocalVehicleRates = (pickupCityId: string | null, packageId: string | null) => {
  return useQuery({
    queryKey: ['localVehicleRates', pickupCityId, packageId],
    queryFn: async () => {
      if (!pickupCityId || !packageId) {
        return [];
      }

      const { data, error } = await supabase
        .from('vehicle_rates')
        .select(`
          *,
          pickup_city:cities!pickup_city_id(id, name),
          vehicle:vehicles(id, name, model, seating_capacity, image_url),
          package:local_packages!package_id(id, name, hours, kilometers)
        `)
        .eq('pickup_city_id', pickupCityId)
        .eq('package_id', packageId)
        .eq('trip_type', 'local')
        .eq('is_active', true);

      if (error) {
        console.error("Error fetching local vehicle rates:", error);
        throw new Error("Failed to load local vehicle rates.");
      }
      return data || [];
    },
  });
};
