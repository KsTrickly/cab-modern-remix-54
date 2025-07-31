
-- Fix the ambiguous ticket_id reference in the trigger function
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
  SELECT COALESCE(MAX(CAST(SUBSTRING(b.ticket_id FROM 4) AS INTEGER)), 7025009) + 1 
  INTO next_number
  FROM bookings b
  WHERE b.ticket_id ~ '^RAC[0-9]+$';
  
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

-- Recreate the trigger to ensure it uses the updated function
DROP TRIGGER IF EXISTS set_booking_ticket_id_trigger ON public.bookings;
CREATE TRIGGER set_booking_ticket_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_ticket_id();
