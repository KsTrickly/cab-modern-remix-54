
-- Ensure all required columns exist in bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS destination_address TEXT,
ADD COLUMN IF NOT EXISTS number_of_persons INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS advance_amount NUMERIC,
ADD COLUMN IF NOT EXISTS advance_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS trip_type TEXT DEFAULT 'round',
ADD COLUMN IF NOT EXISTS package_id TEXT REFERENCES public.local_packages(id),
ADD COLUMN IF NOT EXISTS airport_name TEXT,
ADD COLUMN IF NOT EXISTS additional_city_id UUID REFERENCES public.cities(id),
ADD COLUMN IF NOT EXISTS ticket_id TEXT UNIQUE;

-- Create a comprehensive booking details table to store all form data
CREATE TABLE IF NOT EXISTS public.booking_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  
  -- Personal Information
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  number_of_persons INTEGER NOT NULL DEFAULT 1,
  
  -- Address Information
  pickup_address TEXT NOT NULL,
  destination_address TEXT,
  
  -- Trip Details
  pickup_city_id UUID REFERENCES public.cities(id),
  destination_city_id UUID REFERENCES public.cities(id),
  additional_city_id UUID REFERENCES public.cities(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  package_id TEXT REFERENCES public.local_packages(id),
  airport_name TEXT,
  transfer_type TEXT,
  
  -- Date and Time
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  return_date DATE,
  number_of_days INTEGER NOT NULL,
  number_of_nights INTEGER DEFAULT 0,
  
  -- Fare Breakdown
  base_fare NUMERIC NOT NULL DEFAULT 0,
  extra_km_charge NUMERIC DEFAULT 0,
  day_driver_allowance NUMERIC DEFAULT 0,
  night_charge NUMERIC DEFAULT 0,
  gst NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  advance_amount NUMERIC NOT NULL,
  
  -- Trip Type and Status
  trip_type TEXT NOT NULL DEFAULT 'round',
  booking_status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  advance_paid BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for booking_details
ALTER TABLE public.booking_details ENABLE ROW LEVEL SECURITY;

-- Create policies for booking_details
CREATE POLICY "Allow public read access to booking_details" 
  ON public.booking_details 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert to booking_details" 
  ON public.booking_details 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to booking_details" 
  ON public.booking_details 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_booking_details_booking_id ON public.booking_details(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_details_trip_type ON public.booking_details(trip_type);
CREATE INDEX IF NOT EXISTS idx_booking_details_pickup_date ON public.booking_details(pickup_date);

-- Update the ticket_id generation function to be more robust
CREATE OR REPLACE FUNCTION generate_sequential_ticket_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  new_ticket_id TEXT;
BEGIN
  -- Get the next sequence number (starting from 7025010)
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_id FROM 4) AS INTEGER)), 7025009) + 1 
  INTO next_number
  FROM bookings
  WHERE ticket_id ~ '^RAC[0-9]+$' AND ticket_id IS NOT NULL;
  
  -- Generate the ticket ID
  new_ticket_id := 'RAC' || next_number::TEXT;
  
  RETURN new_ticket_id;
END;
$$;

-- Update the trigger function to handle the booking table properly
CREATE OR REPLACE FUNCTION set_booking_ticket_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only set ticket_id if it's null
  IF NEW.ticket_id IS NULL THEN
    NEW.ticket_id := generate_sequential_ticket_id();
  END IF;
  
  -- Set default values for required fields
  IF NEW.booking_status IS NULL THEN
    NEW.booking_status := 'pending';
  END IF;
  
  IF NEW.payment_status IS NULL THEN
    NEW.payment_status := 'pending';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS set_booking_ticket_id_trigger ON public.bookings;
CREATE TRIGGER set_booking_ticket_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_ticket_id();

-- Update the updated_at timestamp trigger for booking_details
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_booking_details_updated_at
  BEFORE UPDATE ON public.booking_details
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
