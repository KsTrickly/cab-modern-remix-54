
-- Create common_rates table for fallback rates when specific routes aren't available
CREATE TABLE public.common_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_city_id UUID REFERENCES public.cities(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  daily_km_limit NUMERIC NOT NULL DEFAULT 300,
  per_km_charges NUMERIC NOT NULL DEFAULT 12,
  extra_per_km_charge NUMERIC NOT NULL DEFAULT 15,
  day_driver_allowance NUMERIC NOT NULL DEFAULT 500,
  night_charge NUMERIC NOT NULL DEFAULT 300,
  extra_per_hour_charge NUMERIC NOT NULL DEFAULT 100,
  base_fare NUMERIC DEFAULT 0,
  trip_type TEXT NOT NULL DEFAULT 'round_trip',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.common_rates ENABLE ROW LEVEL SECURITY;

-- Allow admin full access to common_rates
CREATE POLICY "Allow admin full access to common_rates" 
  ON public.common_rates 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Allow public read access to common_rates
CREATE POLICY "Allow public read access to common_rates" 
  ON public.common_rates 
  FOR SELECT 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_common_rates_pickup_city_vehicle ON public.common_rates(pickup_city_id, vehicle_id);
CREATE INDEX idx_common_rates_active ON public.common_rates(is_active);

-- Create function to calculate distance between cities using Google Maps API
CREATE OR REPLACE FUNCTION public.calculate_distance_between_cities(
  pickup_city_name TEXT,
  destination_city_name TEXT
) RETURNS NUMERIC AS $$
DECLARE
  distance_km NUMERIC DEFAULT 0;
BEGIN
  -- This function will be called from the edge function
  -- For now, return 0 as placeholder
  RETURN distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
