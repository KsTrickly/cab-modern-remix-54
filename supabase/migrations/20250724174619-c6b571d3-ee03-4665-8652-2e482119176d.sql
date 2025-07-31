-- Fix the ticket_id generation trigger to avoid ambiguous column reference
DROP TRIGGER IF EXISTS set_booking_ticket_id_trigger ON public.bookings;

-- Drop and recreate the function with proper column qualification
CREATE OR REPLACE FUNCTION public.set_booking_ticket_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.ticket_id IS NULL THEN
    NEW.ticket_id := generate_sequential_ticket_id();
  END IF;
  RETURN NEW;
END;
$function$;

-- Recreate the trigger
CREATE TRIGGER set_booking_ticket_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_booking_ticket_id();