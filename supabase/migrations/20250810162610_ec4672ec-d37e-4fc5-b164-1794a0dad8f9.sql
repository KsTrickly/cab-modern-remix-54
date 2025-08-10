-- Add instructions column to bookings for editable ticket instructions
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS instructions text;