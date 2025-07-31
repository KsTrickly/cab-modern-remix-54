-- Create enhanced leads table for lead popup data
CREATE TABLE public.discount_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mobile_number TEXT NOT NULL,
  vehicle_name TEXT NOT NULL,
  vehicle_id UUID,
  pickup_city_id UUID,
  destination_city_id UUID,
  trip_type TEXT,
  pickup_date DATE,
  return_date DATE,
  lead_source TEXT DEFAULT 'discount_popup',
  coupon_requested BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'not_interested')),
  notes TEXT,
  contacted_at TIMESTAMP WITH TIME ZONE,
  converted_to_booking_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for performance
CREATE INDEX idx_discount_leads_mobile_number ON public.discount_leads(mobile_number);
CREATE INDEX idx_discount_leads_created_at ON public.discount_leads(created_at);
CREATE INDEX idx_discount_leads_status ON public.discount_leads(status);

-- Enable Row Level Security
ALTER TABLE public.discount_leads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since leads can be created by anonymous users)
CREATE POLICY "Allow public insert to discount_leads" 
ON public.discount_leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public read access to discount_leads" 
ON public.discount_leads 
FOR SELECT 
USING (true);

-- Allow admin full access
CREATE POLICY "Allow admin full access to discount_leads" 
ON public.discount_leads 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_discount_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_discount_leads_updated_at
BEFORE UPDATE ON public.discount_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_discount_leads_updated_at();

-- Update the existing leads table to be more comprehensive (if we want to keep it)
-- Add missing columns to existing leads table if needed
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS pickup_city_id UUID,
ADD COLUMN IF NOT EXISTS destination_city_id UUID,
ADD COLUMN IF NOT EXISTS trip_type TEXT,
ADD COLUMN IF NOT EXISTS pickup_date DATE,
ADD COLUMN IF NOT EXISTS return_date DATE,
ADD COLUMN IF NOT EXISTS lead_source TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'not_interested')),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS converted_to_booking_id UUID;