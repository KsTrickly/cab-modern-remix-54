
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useLocalPackages = () => {
  return useQuery({
    queryKey: ['localPackages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('local_packages')
        .select('*')
        .order('hours', { ascending: true });

      if (error) {
        console.error("Error fetching local packages:", error);
        throw new Error("Failed to load local packages.");
      }
      return data || [];
    },
  });
};
