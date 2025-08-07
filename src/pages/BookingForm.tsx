import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { useCities } from '@/hooks/useCities';
import { useLocalPackages } from '@/hooks/useLocalPackages';
import { useQuery } from '@tanstack/react-query';
import { MapPin, User, Mail, Phone, Users, CreditCard, Calendar, Clock, Package } from 'lucide-react';
import { calculateDaysAndNights } from '@/utils/fareCalculations';

interface BookingFormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  pickup_address: string;
  destination_address: string;
  number_of_persons: number;
}

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: cities } = useCities();
  const { data: packages } = useLocalPackages();
  
  // Trip details from search parameters
  const vehicleId = searchParams.get('vehicleId');
  const vehicleName = searchParams.get('vehicleName');
  const pickupCityId = searchParams.get('pickupCityId') || searchParams.get('pickupCity');
  const destinationCityId = searchParams.get('destinationCityId') || searchParams.get('destinationCity');
  const additionalCityId = searchParams.get('additionalCity');
  const packageId = searchParams.get('package');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');
  const pickupTime = searchParams.get('pickupTime') || '09:00';
  const numberOfDaysParam = searchParams.get('numberOfDays') || '1';
  const mobileNumber = searchParams.get('mobileNumber');
  const airportName = searchParams.get('airportName');
  const transferType = searchParams.get('transferType');
  
  // Get fare breakdown from URL parameters (passed from VehicleCard)
  const baseFare = parseFloat(searchParams.get('baseFare') || '0');
  const extraKmCharge = parseFloat(searchParams.get('extraKmCharge') || '0');
  const dayDriverAllowance = parseFloat(searchParams.get('dayDriverAllowance') || '0');
  const nightCharge = parseFloat(searchParams.get('nightCharge') || '0');
  const gst = parseFloat(searchParams.get('gst') || '0');
  const totalAmount = parseFloat(searchParams.get('totalAmount') || '0');
  
  // Calculate days and nights using the same logic as vehicle cards
  const { numberOfDays, numberOfNights } = calculateDaysAndNights(pickupDate, returnDate);
  
  // Determine trip type based on search parameters
  const getTripType = () => {
    if (packageId || searchParams.get('tripType') === 'local') return 'local';
    if (airportName || searchParams.get('tripType') === 'airport') return 'airport';
    if (returnDate) return 'round';
    if (!destinationCityId && !returnDate) return 'local';
    return 'oneway';
  };
  
  const tripType = getTripType();
  
  console.log('BookingForm - Trip details:', {
    vehicleId,
    vehicleName,
    pickupCityId,
    destinationCityId,
    additionalCityId,
    packageId,
    pickupDate,
    returnDate,
    pickupTime,
    numberOfDays,
    numberOfNights,
    mobileNumber,
    airportName,
    transferType,
    tripType,
    fareBreakdown: { baseFare, extraKmCharge, dayDriverAllowance, nightCharge, gst, totalAmount }
  });

  // Fetch vehicle rate data from database for additional charge information
  const { data: vehicleRateData } = useQuery({
    queryKey: ['vehicleRate', vehicleId, pickupCityId, destinationCityId, packageId, tripType],
    queryFn: async () => {
      if (!vehicleId || !pickupCityId) return null;
      
      console.log('Fetching vehicle rate for additional charges:', { vehicleId, pickupCityId, destinationCityId, packageId, tripType });
      
      let query = supabase
        .from('vehicle_rates')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .eq('pickup_city_id', pickupCityId)
        .eq('is_active', true);
      
      // Add trip type specific filters
      if (tripType === 'local' && packageId) {
        query = query.eq('package_id', packageId);
      } else if (tripType === 'oneway' && destinationCityId) {
        // For Google Maps destinations, skip destination filter
        if (!destinationCityId.startsWith('google_maps_')) {
          query = query.eq('destination_city_id', destinationCityId);
        }
      } else if (tripType === 'round' && destinationCityId) {
        // For Google Maps destinations, skip destination filter
        if (!destinationCityId.startsWith('google_maps_')) {
          query = query.eq('destination_city_id', destinationCityId);
        }
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error('Error fetching vehicle rate:', error);
        // Fallback to common rates if specific rates not found
        const { data: commonRate } = await supabase
          .from('common_rates')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .eq('pickup_city_id', pickupCityId)
          .eq('trip_type', tripType === 'round' ? 'round_trip' : tripType)
          .eq('is_active', true)
          .maybeSingle();
        
        console.log('Fallback to common rate:', commonRate);
        return commonRate;
      }
      
      console.log('Vehicle rate data:', data);
      return data;
    },
    enabled: !!vehicleId && !!pickupCityId
  });

  const pickupCity = cities?.find(city => city.id === pickupCityId);
  
  // Handle Google Maps destination IDs
  const getDestinationCity = () => {
    if (!destinationCityId) return null;
    
    // If it's a Google Maps destination
    if (destinationCityId.startsWith('google_maps_')) {
      const parts = destinationCityId.split('_');
      const cityName = parts[2] || 'Custom Location'; // Get just the city name part
      return { id: destinationCityId, name: cityName };
    }
    
    // Regular city lookup
    return cities?.find(city => city.id === destinationCityId) || null;
  };
  
  const destinationCity = getDestinationCity();
  const additionalCity = cities?.find(city => city.id === additionalCityId);
  const selectedPackage = packages?.find(pkg => pkg.id === packageId);
  
  const advanceAmount = totalAmount * 0.2;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookingFormData>({
    defaultValues: {
      user_phone: mobileNumber || '',
      number_of_persons: 1
    }
  });

  const getTripTypeLabel = () => {
    switch (tripType) {
      case 'round': return 'Round Trip';
      case 'oneway': return 'One Way';
      case 'local': return 'Local Trip';
      case 'airport': return 'Airport Transfer';
      default: return 'Trip';
    }
  };

  const getPackageDisplay = () => {
    if (selectedPackage) {
      return `${selectedPackage.hours}hr/${selectedPackage.kilometers}km`;
    }
    return 'N/A';
  };

  const onSubmit = async (data: BookingFormData) => {
    console.log('Form submission started with data:', data);
    
    // Validate required fields
    if (!vehicleId) {
      console.error('Missing vehicle ID');
      toast({
        title: "Error",
        description: "Vehicle information is missing. Please start the booking process again.",
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
      // Process destination city ID for Google Maps destinations
      const processedDestinationCityId = destinationCityId && destinationCityId.startsWith('google_maps_') 
        ? null 
        : destinationCityId;

      // Process additional city ID
      const processedAdditionalCityId = additionalCityId && additionalCityId.startsWith('google_maps_') 
        ? null 
        : additionalCityId;

      // Ensure pickup_time has proper format
      const formattedPickupTime = pickupTime.includes(':') ? pickupTime : pickupTime + ':00';

      // First create the main booking record
      const bookingData = {
        user_name: data.user_name,
        user_email: data.user_email,
        user_phone: data.user_phone,
        pickup_address: data.pickup_address,
        destination_address: data.destination_address || null,
        number_of_persons: data.number_of_persons,
        pickup_city_id: pickupCityId,
        destination_city_id: processedDestinationCityId,
        additional_city_id: processedAdditionalCityId,
        vehicle_id: vehicleId,
        pickup_date: pickupDate,
        pickup_time: formattedPickupTime,
        return_date: returnDate || null,
        number_of_days: numberOfDays,
        total_amount: totalAmount,
        advance_amount: advanceAmount,
        booking_status: 'pending',
        payment_status: 'pending',
        trip_type: tripType,
        package_id: packageId || null,
        airport_name: airportName || null
      };

      console.log('Creating booking with data:', bookingData);

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        toast({
          title: "Error",
          description: "Failed to create booking. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('Booking created successfully:', booking);

      console.log('Booking created successfully, now creating trip-specific records');

      // Create trip-specific records
      if (tripType === 'round' && processedDestinationCityId) {
        const { error: roundTripError } = await supabase
          .from('round_trip_bookings')
          .insert([{
            booking_id: booking.id,
            pickup_city_id: pickupCityId,
            destination_city_id: processedDestinationCityId,
            additional_city_id: processedAdditionalCityId,
            return_date: returnDate || null
          }]);
        
        if (roundTripError) {
          console.error('Error creating round trip record:', roundTripError);
        }
      } else if (tripType === 'oneway' && processedDestinationCityId) {
        const { error: onewayError } = await supabase
          .from('oneway_trip_bookings')
          .insert([{
            booking_id: booking.id,
            pickup_city_id: pickupCityId,
            destination_city_id: processedDestinationCityId
          }]);
        
        if (onewayError) {
          console.error('Error creating oneway trip record:', onewayError);
        }
      } else if (tripType === 'local' && packageId) {
        const { error: localError } = await supabase
          .from('local_trip_bookings')
          .insert([{
            booking_id: booking.id,
            pickup_city_id: pickupCityId,
            package_id: packageId
          }]);
        
        if (localError) {
          console.error('Error creating local trip record:', localError);
        }
      } else if (tripType === 'airport' && airportName) {
        const { error: airportError } = await supabase
          .from('airport_trip_bookings')
          .insert([{
            booking_id: booking.id,
            pickup_city_id: pickupCityId,
            airport_name: airportName,
            transfer_type: transferType || 'going-to'
          }]);
        
        if (airportError) {
          console.error('Error creating airport trip record:', airportError);
        }
      }

      toast({
        title: "Success",
        description: "Booking confirmed successfully! Redirecting to your ticket...",
      });
      
      // Redirect to ticket page with booking ID
      navigate(`/ticket/${booking.id}?destination=${encodeURIComponent(searchParams.get('destination') || '')}`);
    } catch (error) {
      console.error('Unexpected error creating booking:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Booking</h1>
          
          {/* Validation Error Display */}
          {(!vehicleId || !pickupCityId || !pickupDate) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-2">Missing Required Information</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {!vehicleId && <li>• Vehicle information is missing</li>}
                {!pickupCityId && <li>• Pickup city is missing</li>}
                {!pickupDate && <li>• Pickup date is missing</li>}
              </ul>
              <p className="text-red-600 text-sm mt-2">
                Please go back and complete the vehicle selection process.
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Booking Details</h2>
                
                {/* Trip Details Display */}
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {getTripTypeLabel()} Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Trip Type:</span> {getTripTypeLabel()}
                    </div>
                    <div>
                      <span className="font-medium">Vehicle:</span> {vehicleName || 'N/A'}
                    </div>
                    
                    {/* Round Trip Details */}
                    {tripType === 'round' && (
                      <>
                        <div>
                          <span className="font-medium">Pickup City:</span> {pickupCity?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span> {destinationCity?.name || 'N/A'}
                        </div>
                        {additionalCity && (
                          <div>
                            <span className="font-medium">Additional City:</span> {additionalCity.name}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Pickup Date:</span> {pickupDate ? new Date(pickupDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Pickup Time:</span> {pickupTime}
                        </div>
                        {returnDate && (
                          <div>
                            <span className="font-medium">Return Date:</span> {new Date(returnDate).toLocaleDateString()}
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* One Way Details */}
                    {tripType === 'oneway' && (
                      <>
                        <div>
                          <span className="font-medium">Pickup City:</span> {pickupCity?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span> {destinationCity?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Pickup Date:</span> {pickupDate ? new Date(pickupDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Pickup Time:</span> {pickupTime}
                        </div>
                      </>
                    )}
                    
                    {/* Local Trip Details */}
                    {tripType === 'local' && (
                      <>
                        <div>
                          <span className="font-medium">Pickup City:</span> {pickupCity?.name || 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span className="font-medium">Package:</span> {getPackageDisplay()}
                        </div>
                        <div>
                          <span className="font-medium">Pickup Date:</span> {pickupDate ? new Date(pickupDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Pickup Time:</span> {pickupTime}
                        </div>
                      </>
                    )}
                    
                    {/* Airport Transfer Details */}
                    {tripType === 'airport' && (
                      <>
                        <div>
                          <span className="font-medium">City:</span> {pickupCity?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Airport:</span> {airportName || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {pickupDate ? new Date(pickupDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">Time:</span> {pickupTime}
                        </div>
                      </>
                    )}
                    
                    <div>
                      <span className="font-medium">Duration:</span> {numberOfDays} day(s), {numberOfNights} night(s)
                    </div>
                  </div>
                </div>

                {/* Fare Summary - Using exact values from VehicleCard */}
                {totalAmount > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Fare Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Fare:</span>
                        <span>₹{baseFare.toFixed(2)}</span>
                      </div>
                      {extraKmCharge > 0 && (
                        <div className="flex justify-between">
                          <span>Extra KM Charge:</span>
                          <span>₹{extraKmCharge.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Driver Allowance ({numberOfDays} days):</span>
                        <span>₹{dayDriverAllowance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Night Charge ({numberOfNights} nights):</span>
                        <span>₹{nightCharge.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (5%):</span>
                        <span>₹{gst.toFixed(2)}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Additional Charge Information - Show for ALL trip types */}
                {vehicleRateData && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                    <h3 className="text-lg font-medium mb-3 text-yellow-800">
                      Additional Charge Information
                    </h3>
                    <div className="space-y-2 text-sm text-yellow-700">
                      {/* Local Trip Extra Charges */}
                      {tripType === 'local' && vehicleRateData.extra_per_hour_charge && (
                        <>
                          <div className="flex justify-between">
                            <span>Extra Per Hour Charge:</span>
                            <span>₹{vehicleRateData.extra_per_hour_charge.toFixed(2)} per hour</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Extra Per KM Charge:</span>
                            <span>₹{vehicleRateData.extra_per_km_charge.toFixed(2)} per km</span>
                          </div>
                          <p className="text-xs mt-2">
                            * Extra charges apply if you exceed the package limits (hours/kilometers)
                          </p>
                        </>
                      )}
                      
                      {/* One Way, Round Trip, and Airport Transfer Extra Charges */}
                      {(tripType === 'oneway' || tripType === 'round' || tripType === 'airport') && (
                        <>
                          <div className="flex justify-between">
                            <span>Extra Per KM Charge:</span>
                            <span>₹{vehicleRateData.extra_per_km_charge.toFixed(2)} per km</span>
                          </div>
                          <p className="text-xs mt-2">
                            * Extra charges apply for additional kilometers beyond the standard route
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="user_name">Full Name *</Label>
                        <Input
                          id="user_name"
                          {...register('user_name', { required: 'Name is required' })}
                          className={errors.user_name ? 'border-red-500' : ''}
                        />
                        {errors.user_name && (
                          <p className="text-red-500 text-sm">{errors.user_name.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user_email">Email *</Label>
                        <Input
                          id="user_email"
                          type="email"
                          {...register('user_email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                          className={errors.user_email ? 'border-red-500' : ''}
                        />
                        {errors.user_email && (
                          <p className="text-red-500 text-sm">{errors.user_email.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="user_phone">Phone Number *</Label>
                        <Input
                          id="user_phone"
                          {...register('user_phone', { 
                            required: 'Phone number is required',
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Phone number must be 10 digits'
                            }
                          })}
                          className={errors.user_phone ? 'border-red-500' : ''}
                        />
                        {errors.user_phone && (
                          <p className="text-red-500 text-sm">{errors.user_phone.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="number_of_persons">Number of Persons *</Label>
                        <Input
                          id="number_of_persons"
                          type="number"
                          min="1"
                          {...register('number_of_persons', { 
                            required: 'Number of persons is required',
                            min: { value: 1, message: 'Minimum 1 person required' }
                          })}
                          className={errors.number_of_persons ? 'border-red-500' : ''}
                        />
                        {errors.number_of_persons && (
                          <p className="text-red-500 text-sm">{errors.number_of_persons.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Address Information
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pickup_address">Pickup Address *</Label>
                      <Textarea
                        id="pickup_address"
                        {...register('pickup_address', { required: 'Pickup address is required' })}
                        className={errors.pickup_address ? 'border-red-500' : ''}
                        placeholder="Enter complete pickup address"
                        rows={3}
                      />
                      {errors.pickup_address && (
                        <p className="text-red-500 text-sm">{errors.pickup_address.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="destination_address">Destination Address</Label>
                      <Textarea
                        id="destination_address"
                        {...register('destination_address')}
                        placeholder="Enter destination address (optional for local trips)"
                        rows={3}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isSubmitting || !vehicleId || !pickupCityId || !pickupDate}
                  >
                    {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trip Type:</span>
                    <span className="font-medium">{getTripTypeLabel()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vehicle:</span>
                    <span className="font-medium">{vehicleName || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{numberOfDays} day(s), {numberOfNights} night(s)</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{pickupDate ? new Date(pickupDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{pickupTime}</span>
                  </div>
                  
                  {returnDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Return Date:</span>
                      <span className="font-medium">{new Date(returnDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {tripType === 'local' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package:</span>
                      <span className="font-medium">{getPackageDisplay()}</span>
                    </div>
                  )}
                  
                  <hr className="my-4" />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total Amount:</span>
                    <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-green-600">
                    <span className="font-medium">Advance (20%):</span>
                    <span className="font-bold">₹{advanceAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg mt-4">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm font-medium">Payment Info</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Pay 20% advance to confirm your booking. Remaining amount to be paid to driver.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
