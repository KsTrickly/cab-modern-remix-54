-- Add extra_per_km_rate column to bookings table for custom per km charges
ALTER TABLE public.bookings 
ADD COLUMN extra_per_km_rate numeric;