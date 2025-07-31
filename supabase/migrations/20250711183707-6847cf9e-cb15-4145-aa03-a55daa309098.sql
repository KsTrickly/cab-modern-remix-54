
-- Update the trip_type constraint to include airport and local options
ALTER TABLE public.vehicle_rates 
DROP CONSTRAINT IF EXISTS vehicle_rates_trip_type_check;

ALTER TABLE public.vehicle_rates 
ADD CONSTRAINT vehicle_rates_trip_type_check 
CHECK (trip_type IN ('one_way', 'round_trip', 'airport', 'local'));

-- Update existing records to have valid trip types (optional - you can modify as needed)
-- This ensures no existing data breaks the new constraint
UPDATE public.vehicle_rates 
SET trip_type = 'round_trip' 
WHERE trip_type NOT IN ('one_way', 'round_trip', 'airport', 'local');
