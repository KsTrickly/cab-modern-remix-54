
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useVehicleData = () => {
  const { data: cities } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: vehicles, isLoading: isLoadingVehicles, error: vehiclesError } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error("Error fetching vehicles:", error);
        throw new Error("Failed to load vehicles");
      }
      return data || [];
    },
  });

  return {
    cities,
    vehicles,
    isLoadingVehicles,
    vehiclesError
  };
};
