-- Fix the function search path security issues
CREATE OR REPLACE FUNCTION generate_sequential_ticket_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  ticket_id TEXT;
BEGIN
  -- Get the next sequence number (starting from 7025010)
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_id FROM 4) AS INTEGER)), 7025009) + 1 
  INTO next_number
  FROM bookings 
  WHERE ticket_id ~ '^RAC[0-9]+$';
  
  -- Generate the ticket ID
  ticket_id := 'RAC' || next_number::TEXT;
  
  RETURN ticket_id;
END;
$$;

CREATE OR REPLACE FUNCTION set_booking_ticket_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.ticket_id IS NULL THEN
    NEW.ticket_id := generate_sequential_ticket_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.calculate_distance_between_cities(pickup_city_name text, destination_city_name text)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  distance_km NUMERIC DEFAULT 0;
BEGIN
  -- This function will be called from the edge function
  -- For now, return 0 as placeholder
  RETURN distance_km;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_discount_leads_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;