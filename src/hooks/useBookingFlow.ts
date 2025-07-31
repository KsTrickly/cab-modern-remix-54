
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FareBreakdown } from '@/utils/fareCalculations';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  seating_capacity: number;
  image_url: string;
  vehicle_type: string;
  is_active: boolean;
}

interface VehicleRate {
  id: string;
  pickup_city_id: string;
  destination_city_id: string;
  vehicle_id: string;
  total_running_km: number;
  daily_km_limit: number;
  per_km_charges: number;
  extra_per_km_charge: number;
  day_driver_allowance: number;
  night_charge: number;
  base_fare: number;
  is_active: boolean;
}

export const useBookingFlow = (
  pickupCityId: string | null,
  destinationCityId: string | null,
  pickupDate: string | null,
  returnDate: string | null,
  numberOfDays: number
) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedRate, setSelectedRate] = useState<VehicleRate | null>(null);
  const [showFareDetails, setShowFareDetails] = useState(false);
  const [showLeadPopup, setShowLeadPopup] = useState(true);
  const [showFareSummary, setShowFareSummary] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [userPhone, setUserPhone] = useState('');

  const handleLeadSubmit = () => {
    if (mobileNumber) {
      setUserPhone(mobileNumber);
      setShowLeadPopup(false);
      toast({
        title: "Success",
        description: "Mobile number saved successfully!",
      });
    }
  };

  const handleBookNow = (vehicle: Vehicle, vehicleRates: VehicleRate[] | undefined) => {
    const rate = vehicleRates?.find(rate => rate.vehicle_id === vehicle.id);
    if (rate) {
      setSelectedVehicle(vehicle);
      setSelectedRate(rate);
      setShowFareSummary(true);
    }
  };

  const handleFinalBooking = async (fareBreakdown: FareBreakdown) => {
    console.log('Starting booking creation process...');
    console.log('Selected vehicle:', selectedVehicle);
    console.log('Selected rate:', selectedRate);
    console.log('Fare breakdown:', fareBreakdown);
    console.log('User phone:', userPhone);
    console.log('Pickup city ID:', pickupCityId);
    console.log('Destination city ID:', destinationCityId);
    console.log('Pickup date:', pickupDate);
    console.log('Return date:', returnDate);
    console.log('Number of days:', numberOfDays);

    if (!selectedVehicle || !selectedRate) {
      console.error('Missing vehicle or rate data');
      toast({
        title: "Error",
        description: "No vehicle selected.",
        variant: "destructive"
      });
      return;
    }

    if (!userPhone) {
      console.error('Missing user phone number');
      toast({
        title: "Error",
        description: "Phone number is required.",
        variant: "destructive"
      });
      return;
    }

    if (!pickupCityId) {
      console.error('Missing pickup city ID');
      toast({
        title: "Error",
        description: "Pickup city is required.",
        variant: "destructive"
      });
      return;
    }

    if (!pickupDate) {
      console.error('Missing pickup date');
      toast({
        title: "Error",
        description: "Pickup date is required.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Ensure pickup_time has proper format
      const pickupTime = "09:00:00";
      
      // Handle Google Maps destinations by setting them to null
      const processedDestinationCityId = destinationCityId && destinationCityId.startsWith('google_maps_') 
        ? null 
        : destinationCityId;

      // Determine trip type more accurately
      const tripType = returnDate ? 'round' : 'oneway';
      
      const bookingData = {
        user_phone: userPhone,
        pickup_city_id: pickupCityId,
        destination_city_id: processedDestinationCityId,
        vehicle_id: selectedVehicle.id,
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        return_date: returnDate,
        number_of_days: numberOfDays,
        total_amount: fareBreakdown.total,
        advance_amount: fareBreakdown.total * 0.2, // 20% advance
        booking_status: 'pending',
        payment_status: 'pending',
        trip_type: tripType,
        advance_paid: false
      };

      console.log('Booking data to insert:', bookingData);

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error("Supabase error creating booking:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
        
        // Provide more specific error messages
        let errorMessage = "Failed to create booking.";
        if (error.message.includes('foreign key')) {
          errorMessage = "Invalid city or vehicle selection. Please try again.";
        } else if (error.message.includes('not null')) {
          errorMessage = "Missing required information. Please fill all fields.";
        } else if (error.message.includes('check constraint')) {
          errorMessage = "Invalid data format. Please check your inputs.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      console.log("Booking created successfully:", data);
      
      // Create trip-specific record based on trip type
      if (tripType === 'round' && processedDestinationCityId) {
        const { error: roundTripError } = await supabase
          .from('round_trip_bookings')
          .insert([{
            booking_id: data.id,
            pickup_city_id: pickupCityId,
            destination_city_id: processedDestinationCityId,
            return_date: returnDate
          }]);
        
        if (roundTripError) {
          console.error('Error creating round trip record:', roundTripError);
        }
      } else if (tripType === 'oneway' && processedDestinationCityId) {
        const { error: onewayError } = await supabase
          .from('oneway_trip_bookings')
          .insert([{
            booking_id: data.id,
            pickup_city_id: pickupCityId,
            destination_city_id: processedDestinationCityId
          }]);
        
        if (onewayError) {
          console.error('Error creating oneway trip record:', onewayError);
        }
      }
      
      toast({
        title: "Success",
        description: "Booking created successfully!",
      });
      setShowFareSummary(false);
      navigate(`/ticket/${data.id}`);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    selectedVehicle,
    selectedRate,
    showFareDetails,
    showLeadPopup,
    showFareSummary,
    mobileNumber,
    userPhone,
    setShowFareDetails,
    setShowLeadPopup,
    setShowFareSummary,
    setMobileNumber,
    handleLeadSubmit,
    handleBookNow,
    handleFinalBooking,
  };
};
