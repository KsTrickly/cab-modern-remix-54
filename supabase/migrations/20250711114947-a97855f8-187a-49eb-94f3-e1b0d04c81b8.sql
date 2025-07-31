
-- Create table for cities
CREATE TABLE public.cities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  state_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for vehicles
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  seating_capacity INTEGER,
  image_url TEXT,
  vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('sedan', 'suv', 'hatchback', 'luxury')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for city-vehicle rate configurations
CREATE TABLE public.vehicle_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pickup_city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  destination_city_id UUID REFERENCES public.cities(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  total_running_km DECIMAL(10,2) NOT NULL,
  daily_km_limit DECIMAL(10,2) NOT NULL,
  per_km_charges DECIMAL(10,2) NOT NULL,
  extra_per_km_charge DECIMAL(10,2) NOT NULL,
  day_driver_allowance DECIMAL(10,2) NOT NULL,
  night_charge DECIMAL(10,2) NOT NULL,
  base_fare DECIMAL(10,2) GENERATED ALWAYS AS (daily_km_limit * per_km_charges) STORED,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(pickup_city_id, destination_city_id, vehicle_id)
);

-- Create table for bookings
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_phone TEXT NOT NULL,
  pickup_city_id UUID REFERENCES public.cities(id),
  destination_city_id UUID REFERENCES public.cities(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  return_date DATE,
  number_of_days INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample cities
INSERT INTO public.cities (name, state_code) VALUES 
('Delhi', 'DL'),
('Mumbai', 'MH'),
('Bangalore', 'KA'),
('Chennai', 'TN'),
('Kolkata', 'WB'),
('Hyderabad', 'TS'),
('Pune', 'MH'),
('Ahmedabad', 'GJ'),
('Jaipur', 'RJ'),
('Lucknow', 'UP');

-- Insert sample vehicles
INSERT INTO public.vehicles (name, model, seating_capacity, vehicle_type, image_url) VALUES 
('Maruti Dzire', 'Dzire VXI', 4, 'sedan', '/lovable-uploads/placeholder-car.jpg'),
('Toyota Innova', 'Innova Crysta', 7, 'suv', '/lovable-uploads/placeholder-car.jpg'),
('Hyundai i20', 'Elite i20', 5, 'hatchback', '/lovable-uploads/placeholder-car.jpg'),
('Honda City', 'City VX', 5, 'sedan', '/lovable-uploads/placeholder-car.jpg'),
('Mahindra Scorpio', 'Scorpio S11', 8, 'suv', '/lovable-uploads/placeholder-car.jpg');

-- Add RLS policies
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for now, we'll add admin authentication later)
CREATE POLICY "Allow public read access to cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vehicles" ON public.vehicles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to vehicle_rates" ON public.vehicle_rates FOR SELECT USING (true);
CREATE POLICY "Allow public insert to bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to bookings" ON public.bookings FOR SELECT USING (true);

-- Admin policies (we'll enhance these when we add authentication)
CREATE POLICY "Allow admin full access to cities" ON public.cities FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to vehicle_rates" ON public.vehicle_rates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access to bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
