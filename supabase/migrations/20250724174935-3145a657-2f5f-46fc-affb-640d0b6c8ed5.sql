-- Fix the generate_sequential_ticket_id function to avoid ambiguous column reference
CREATE OR REPLACE FUNCTION public.generate_sequential_ticket_id()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_number INTEGER;
  ticket_id TEXT;
BEGIN
  -- Get the next sequence number (starting from 7025010)
  -- Properly qualify the column name to avoid ambiguity
  SELECT COALESCE(MAX(CAST(SUBSTRING(bookings.ticket_id FROM 4) AS INTEGER)), 7025009) + 1 
  INTO next_number
  FROM public.bookings 
  WHERE bookings.ticket_id ~ '^RAC[0-9]+$';
  
  -- Generate the ticket ID
  ticket_id := 'RAC' || next_number::TEXT;
  
  RETURN ticket_id;
END;
$function$