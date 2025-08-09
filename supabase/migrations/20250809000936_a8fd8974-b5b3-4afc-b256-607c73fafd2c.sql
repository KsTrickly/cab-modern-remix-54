-- Add an optional admin-editable override for total kilometers used in ticket fare calculations
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS total_km_override numeric;

COMMENT ON COLUMN public.bookings.total_km_override IS 'Optional admin override for total kilometers shown in ticket fare calculation and on the ticket UI.';