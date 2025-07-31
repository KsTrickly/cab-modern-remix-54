
-- First, let's create separate tables for different trip types to better organize the data

-- Create a table for round trip bookings
CREATE TABLE public.round_trip_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  pickup_city_id UUID REFERENCES public.cities(id) NOT NULL,
  destination_city_id UUID REFERENCES public.cities(id) NOT NULL,
  additional_city_id UUID REFERENCES public.cities(id),
  return_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for one way trip bookings
CREATE TABLE public.oneway_trip_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  pickup_city_id UUID REFERENCES public.cities(id) NOT NULL,
  destination_city_id UUID REFERENCES public.cities(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for local trip bookings
CREATE TABLE public.local_trip_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  pickup_city_id UUID REFERENCES public.cities(id) NOT NULL,
  package_id TEXT REFERENCES public.local_packages(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for airport transfer bookings
CREATE TABLE public.airport_trip_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) NOT NULL,
  pickup_city_id UUID REFERENCES public.cities(id) NOT NULL,
  airport_name TEXT NOT NULL,
  transfer_type TEXT NOT NULL CHECK (transfer_type IN ('going-to', 'coming-from')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trip_type column to bookings table if it doesn't exist
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS trip_type TEXT DEFAULT 'round';

-- Add package_id column to bookings table for easier reference
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS package_id TEXT REFERENCES public.local_packages(id);

-- Add airport_name column to bookings table for easier reference
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS airport_name TEXT;

-- Add additional_city_id to bookings table for easier reference
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS additional_city_id UUID REFERENCES public.cities(id);

-- Enable RLS for new tables
ALTER TABLE public.round_trip_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oneway_trip_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_trip_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_trip_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to trip booking tables
CREATE POLICY "Allow public read access to round_trip_bookings" 
  ON public.round_trip_bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to oneway_trip_bookings" 
  ON public.oneway_trip_bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to local_trip_bookings" 
  ON public.local_trip_bookings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access to airport_trip_bookings" 
  ON public.airport_trip_bookings 
  FOR SELECT 
  USING (true);

-- Create policies for admin full access to trip booking tables
CREATE POLICY "Allow admin full access to round_trip_bookings" 
  ON public.round_trip_bookings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to oneway_trip_bookings" 
  ON public.oneway_trip_bookings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to local_trip_bookings" 
  ON public.local_trip_bookings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow admin full access to airport_trip_bookings" 
  ON public.airport_trip_bookings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create policies for public insert to trip booking tables
CREATE POLICY "Allow public insert to round_trip_bookings" 
  ON public.round_trip_bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert to oneway_trip_bookings" 
  ON public.oneway_trip_bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert to local_trip_bookings" 
  ON public.local_trip_bookings 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public insert to airport_trip_bookings" 
  ON public.airport_trip_bookings 
  FOR INSERT 
  WITH CHECK (true);
