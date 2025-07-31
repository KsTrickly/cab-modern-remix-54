import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { calculateFareBreakdown, calculateDaysAndNights } from '@/utils/fareCalculations';
import FloatingActions from '@/components/FloatingActions';
import { VehicleListHeader } from '@/components/vehicle/VehicleListHeader';
import { CompactSearchBox } from '@/components/vehicle/CompactSearchBox';
import { VehicleCard } from '@/components/vehicle/VehicleCard';
import { useVehicleRatesWithFallback } from '@/hooks/useVehicleRates';
import { useCommonRates } from '@/hooks/useCommonRates';
import { useLocalVehicleRates } from '@/hooks/useLocalVehicleRates';
import { useCities } from '@/hooks/useCities';
import { useBookingFlow } from '@/hooks/useBookingFlow';
import { LeadPopup } from '@/components/booking/LeadPopup';
import { FareSummary } from '@/components/booking/FareSummary';
import { Loader2 } from 'lucide-react';

const VehicleList = () => {
  const [searchParams] = useSearchParams();
  const [searchData, setSearchData] = useState({
    pickupCity: searchParams.get('pickupCity') || '',
    destinationCity: searchParams.get('destinationCity') || '',
    tripType: searchParams.get('tripType') || 'round_trip',
    pickupDate: searchParams.get('pickupDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    pickupTime: searchParams.get('pickupTime') || '',
    packageId: searchParams.get('package') || searchParams.get('packageId') || '',
    airportName: searchParams.get('airportName') || '',
    numberOfDays: parseInt(searchParams.get('numberOfDays') || '1')
  });

  const { data: cities } = useCities();

  // Helper function to get city name by ID
  const getCityNameById = (cityId: string) => {
    if (!cities || !cityId) return '';
    const city = cities.find(c => c.id === cityId);
    return city?.name || '';
  };

  // Helper function to extract city name from Google Maps destination
  const extractCityNameFromGoogleMaps = (googleMapsId: string) => {
    if (!googleMapsId?.startsWith('google_maps_')) return '';
    const parts = googleMapsId.split('_');
    return parts[2] || ''; // Extract city name from google_maps_CityName_PlaceId format
  };

  // Get actual city names for distance calculation
  const pickupCityName = getCityNameById(searchData.pickupCity);
  const destinationCityName = searchData.destinationCity?.startsWith('google_maps_') 
    ? extractCityNameFromGoogleMaps(searchData.destinationCity)
    : getCityNameById(searchData.destinationCity);

  // Convert tripType to match database format
  const dbTripType = searchData.tripType === 'round' ? 'round_trip' : 
                     searchData.tripType === 'oneway' ? 'oneway_trip' : 
                     searchData.tripType;

  // Normalize tripType for display logic (handle both formats)
  const displayTripType = searchData.tripType === 'round_trip' ? 'round' : 
                          searchData.tripType === 'oneway_trip' ? 'oneway' : 
                          searchData.tripType;

  const { data: vehicleData, isLoading, error } = useVehicleRatesWithFallback(
    searchData.pickupCity,
    searchData.destinationCity,
    pickupCityName,
    destinationCityName,
    dbTripType
  );

  const { data: commonRatesData, isLoading: isCommonRatesLoading } = useCommonRates(
    searchData.pickupCity,
    null,
    dbTripType
  );

  const { data: localRatesData, isLoading: isLocalRatesLoading } = useLocalVehicleRates(
    searchData.pickupCity,
    searchData.packageId
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchData({
      pickupCity: params.get('pickupCity') || '',
      destinationCity: params.get('destinationCity') || '',
      tripType: params.get('tripType') || 'round_trip',
      pickupDate: params.get('pickupDate') || '',
      returnDate: params.get('returnDate') || '',
      pickupTime: params.get('pickupTime') || '',
      packageId: params.get('package') || params.get('packageId') || '',
      airportName: params.get('airportName') || '',
      numberOfDays: parseInt(params.get('numberOfDays') || '1')
    });
  }, []);

  // Calculate number of days and nights for fare calculation
  const { numberOfDays, numberOfNights } = calculateDaysAndNights(
    searchData.pickupDate, 
    searchData.returnDate
  );

  // Initialize booking flow
  const {
    selectedVehicle,
    selectedRate,
    showLeadPopup,
    showFareSummary,
    mobileNumber,
    setMobileNumber,
    handleLeadSubmit,
    handleBookNow,
    setShowLeadPopup,
    setShowFareSummary,
  } = useBookingFlow(
    searchData.pickupCity,
    searchData.destinationCity,
    searchData.pickupDate,
    searchData.returnDate,
    numberOfDays
  );

  const isLocalTrip = searchData.tripType === 'local';
  
  let currentData = null;
  let currentLoading = false;

  if (isLocalTrip) {
    currentData = localRatesData;
    currentLoading = isLocalRatesLoading;
  } else if (searchData.destinationCity) {
    currentData = vehicleData;
    currentLoading = isLoading;
  } else {
    currentData = commonRatesData;
    currentLoading = isCommonRatesLoading;
  }

  // Sort vehicles by calculated total fare in ascending order
  const sortedVehicles = currentData && currentData.rates && Array.isArray(currentData.rates) 
    ? [...currentData.rates].sort((a, b) => {
        const fareA = calculateFareBreakdown(a, numberOfDays, numberOfNights);
        const fareB = calculateFareBreakdown(b, numberOfDays, numberOfNights);
        return fareA.total - fareB.total;
      })
    : currentData && Array.isArray(currentData) 
    ? [...currentData].sort((a, b) => {
        const fareA = calculateFareBreakdown(a, numberOfDays, numberOfNights);
        const fareB = calculateFareBreakdown(b, numberOfDays, numberOfNights);
        return fareA.total - fareB.total;
      })
    : [];

  if (currentLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
        <FloatingActions />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Vehicles</h2>
              <p className="text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </div>
        <Footer />
        <FloatingActions />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-6">
          <CompactSearchBox />
          
          {/* Trip Details */}
          <div className="mt-6 mb-4">
             <h1 className="text-2xl font-bold text-foreground mb-1">
               {displayTripType === 'local' 
                 ? `Local Trip in ${pickupCityName}`
                 : displayTripType === 'airport'
                 ? `Airport Transfer - ${searchData.airportName}`
                 : displayTripType === 'oneway'
                 ? `One Way Trip: ${pickupCityName} to ${destinationCityName}`
                 : `Round Trip: ${pickupCityName} to ${destinationCityName}`
               }
             </h1>
             <p className="text-muted-foreground text-sm">
               {displayTripType === 'local' 
                 ? `Package: ${searchData.packageId} • ${searchData.pickupDate}`
                 : displayTripType === 'airport'
                 ? `${pickupCityName} • ${searchData.pickupDate}`
                 : `${searchData.pickupDate} ${searchData.returnDate && `to ${searchData.returnDate}`}`
               }
             </p>
          </div>
          
          {/* Distance Information and Trip Details */}
          {currentData && typeof currentData === 'object' && 'distanceInfo' in currentData && currentData.distanceInfo && searchData.tripType !== 'local' && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2">
                 <span className="text-blue-700 dark:text-blue-300 font-medium">
                   Distance: {displayTripType === 'round' ? currentData.distanceInfo.distance * 2 : currentData.distanceInfo.distance} km
                   {displayTripType === 'round' && (
                     <span className="text-blue-600 dark:text-blue-400 text-sm ml-2">
                       ({currentData.distanceInfo.distance} km each way)
                     </span>
                   )}
                 </span>
                {currentData.distanceInfo.warning && (
                  <span className="text-amber-600 dark:text-amber-400 text-sm">
                    ⚠️ {currentData.distanceInfo.warning}
                  </span>
                )}
              </div>
              {currentData.distanceInfo.error && (
                <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                  Note: {currentData.distanceInfo.error}
                </p>
              )}
            </div>
          )}

          {numberOfDays && numberOfNights && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Trip Duration: {numberOfDays} {numberOfDays === 1 ? 'day' : 'days'} • {numberOfNights} {numberOfNights === 1 ? 'night' : 'nights'}
              </p>
            </div>
          )}
          
          <div className="mt-8">
            {sortedVehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedVehicles.map((rate) => (
                  <VehicleCard 
                    key={rate.id} 
                    vehicle={rate.vehicle}
                    rate={rate}
                    tripType={searchData.tripType}
                    numberOfDays={numberOfDays}
                    numberOfNights={numberOfNights}
                    onBookNow={(vehicle, rate) => {
                      console.log('Book now clicked:', vehicle, rate);
                      handleBookNow(vehicle, [rate]);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No vehicles available</h3>
                <p className="text-muted-foreground">
                  No vehicles found for your selected route and dates. Please try different search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActions />

      {/* Lead Popup */}
      <LeadPopup
        isOpen={showLeadPopup}
        onClose={() => setShowLeadPopup(false)}
        mobileNumber={mobileNumber}
        onMobileNumberChange={setMobileNumber}
        onSubmit={handleLeadSubmit}
        vehicleName={selectedVehicle?.name || ''}
        vehicleId={selectedVehicle?.id}
      />

      {/* Fare Summary */}
      {selectedVehicle && selectedRate && (
        <FareSummary
          isOpen={showFareSummary}
          onClose={() => setShowFareSummary(false)}
          onBook={() => {}}
          vehicleName={selectedVehicle.name}
          fareBreakdown={calculateFareBreakdown(selectedRate, numberOfDays, numberOfNights)}
          numberOfDays={numberOfDays}
          numberOfNights={numberOfNights}
          vehicleId={selectedVehicle.id}
          pickupCityId={searchData.pickupCity}
          destinationCityId={searchData.destinationCity}
          pickupDate={searchData.pickupDate}
          returnDate={searchData.returnDate}
          mobileNumber={mobileNumber}
          tripType={searchData.tripType}
          packageId={searchData.packageId}
          pickupTime={searchData.pickupTime}
        />
      )}
    </div>
  );
};

export default VehicleList;
