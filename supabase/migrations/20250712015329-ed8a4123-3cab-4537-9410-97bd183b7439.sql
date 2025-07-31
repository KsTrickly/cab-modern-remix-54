
-- Modify the vehicle_rates table to handle local packages and add extra_per_hour_charge
ALTER TABLE public.vehicle_rates 
ALTER COLUMN destination_city_id TYPE text;

-- Add the new extra_per_hour_charge column
ALTER TABLE public.vehicle_rates 
ADD COLUMN extra_per_hour_charge numeric DEFAULT 0;

-- Update the column to be NOT NULL with default value
ALTER TABLE public.vehicle_rates 
ALTER COLUMN extra_per_hour_charge SET NOT NULL;
