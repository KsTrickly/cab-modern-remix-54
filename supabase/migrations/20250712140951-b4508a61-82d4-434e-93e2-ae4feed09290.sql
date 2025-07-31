
-- Add new columns to the bookings table for the booking form data
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS destination_address TEXT,
ADD COLUMN IF NOT EXISTS number_of_persons INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS advance_amount NUMERIC,
ADD COLUMN IF NOT EXISTS advance_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Update the booking_status column to have more specific statuses
ALTER TABLE public.bookings 
ALTER COLUMN booking_status SET DEFAULT 'draft';
