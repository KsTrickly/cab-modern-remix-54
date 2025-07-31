
-- Add trip_type column to vehicle_rates table
ALTER TABLE public.vehicle_rates 
ADD COLUMN trip_type text NOT NULL DEFAULT 'round_trip';

-- Add constraint to ensure trip_type is either 'one_way' or 'round_trip'
ALTER TABLE public.vehicle_rates 
ADD CONSTRAINT vehicle_rates_trip_type_check 
CHECK (trip_type IN ('one_way', 'round_trip'));

-- Create index for better performance when filtering by trip_type
CREATE INDEX idx_vehicle_rates_trip_type ON public.vehicle_rates(trip_type);
