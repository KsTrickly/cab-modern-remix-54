
-- Check if the column exists and add it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vehicle_rates' 
        AND column_name = 'extra_per_hour_charge'
    ) THEN
        ALTER TABLE public.vehicle_rates 
        ADD COLUMN extra_per_hour_charge numeric DEFAULT 0;
        
        ALTER TABLE public.vehicle_rates 
        ALTER COLUMN extra_per_hour_charge SET NOT NULL;
    END IF;
END $$;
