
-- Create a table for local packages
CREATE TABLE public.local_packages (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  hours INTEGER NOT NULL,
  kilometers INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the local packages
INSERT INTO public.local_packages (id, name, hours, kilometers) VALUES 
('4hr_40km', '4hr/40 km', 4, 40),
('6hr_60km', '6hr/60 km', 6, 60),
('8hr_80km', '8hr/80 km', 8, 80),
('12hr_120km', '12hr/120 km', 12, 120);

-- Add a package_id column to vehicle_rates for local trips
ALTER TABLE public.vehicle_rates 
ADD COLUMN package_id TEXT REFERENCES public.local_packages(id);

-- Enable RLS for local_packages table
ALTER TABLE public.local_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to local_packages
CREATE POLICY "Allow public read access to local_packages" 
  ON public.local_packages 
  FOR SELECT 
  USING (true);

-- Create policy for admin full access to local_packages
CREATE POLICY "Allow admin full access to local_packages" 
  ON public.local_packages 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);
