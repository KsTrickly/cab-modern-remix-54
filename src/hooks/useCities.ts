
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, state_code')
        .order('name');
      
      if (error) {
        console.error('Error fetching cities:', error);
        throw error;
      }
      
      return data || [];
    },
  });
};
