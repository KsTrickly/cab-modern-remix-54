-- Add an editable destination field to bookings
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS destination_name text;