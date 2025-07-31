-- Create a function to generate sequential ticket IDs
CREATE OR REPLACE FUNCTION generate_sequential_ticket_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_number INTEGER;
  ticket_id TEXT;
BEGIN
  -- Get the next sequence number (starting from 7025010)
  SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 7025009) + 1 
  INTO next_number
  FROM bookings 
  WHERE id ~ '^RAC[0-9]+$';
  
  -- Generate the ticket ID
  ticket_id := 'RAC' || next_number::TEXT;
  
  RETURN ticket_id;
END;
$$;

-- Add a sequential ID column to bookings table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS ticket_id TEXT UNIQUE;

-- Create a trigger to auto-generate ticket IDs
CREATE OR REPLACE FUNCTION set_booking_ticket_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.ticket_id IS NULL THEN
    NEW.ticket_id := generate_sequential_ticket_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS set_booking_ticket_id_trigger ON public.bookings;
CREATE TRIGGER set_booking_ticket_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_ticket_id();