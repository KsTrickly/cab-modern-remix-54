import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, MapPin, Package, Plane, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapsCitySelect } from '@/components/ui/maps-city-select';
import { useLocalPackages } from '@/hooks/useLocalPackages';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const CompactSearchBox = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { data: packages } = useLocalPackages();
  const [isSearching, setIsSearching] = useState(false);

  // Initialize state from URL parameters - exactly matching VehicleList expectations
  const initialTripType = searchParams.get('tripType');
  const [tripType, setTripType] = useState(
    initialTripType === 'round_trip' ? 'round' : 
    initialTripType === 'oneway_trip' ? 'oneway' : 
    initialTripType || 'round'
  );
  const [pickupCity, setPickupCity] = useState(searchParams.get('pickupCity') || '');
  const [destinationCity, setDestinationCity] = useState(searchParams.get('destinationCity') || '');
  const [pickupDate, setPickupDate] = useState(searchParams.get('pickupDate') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
  const [pickupTime, setPickupTime] = useState(searchParams.get('pickupTime') || '09:00');
  const [packageId, setPackageId] = useState(searchParams.get('package') || searchParams.get('packageId') || '');
  const [airportName, setAirportName] = useState(searchParams.get('airportName') || '');
  const [additionalCity, setAdditionalCity] = useState(searchParams.get('additionalCity') || '');
  const [airportSection, setAirportSection] = useState<'going-to' | 'coming-from'>(
    (searchParams.get('transferType') as 'going-to' | 'coming-from') || 'going-to'
  );

  // Update state when URL parameters change
  useEffect(() => {
    const urlTripType = searchParams.get('tripType') || 'round';
    const currentTripType = urlTripType === 'round_trip' ? 'round' : 
                           urlTripType === 'oneway_trip' ? 'oneway' : 
                           urlTripType;
    const currentPickupCity = searchParams.get('pickupCity') || '';
    const currentDestinationCity = searchParams.get('destinationCity') || '';
    const currentPickupDate = searchParams.get('pickupDate') || '';
    const currentReturnDate = searchParams.get('returnDate') || '';
    const currentPickupTime = searchParams.get('pickupTime') || '09:00';
    const currentPackageId = searchParams.get('package') || searchParams.get('packageId') || '';
    const currentAirportName = searchParams.get('airportName') || '';
    const currentAdditionalCity = searchParams.get('additionalCity') || '';
    const currentTransferType = (searchParams.get('transferType') as 'going-to' | 'coming-from') || 'going-to';

    setTripType(currentTripType);
    setPickupCity(currentPickupCity);
    setDestinationCity(currentDestinationCity);
    setPickupDate(currentPickupDate);
    setReturnDate(currentReturnDate);
    setPickupTime(currentPickupTime);
    setPackageId(currentPackageId);
    setAirportName(currentAirportName);
    setAdditionalCity(currentAdditionalCity);
    setAirportSection(currentTransferType);
  }, [searchParams]);

  const tabs = [
    { id: 'round', label: 'ROUND' },
    { id: 'oneway', label: 'ONEWAY' },
    { id: 'local', label: 'LOCAL' },
    { id: 'airport', label: 'AIRPORT TRANSFER' },
  ];

  const handleSearch = async () => {
    // Prevent multiple rapid clicks
    if (isSearching) return;
    setIsSearching(true);

    console.log('CompactSearchBox: Starting search with:', {
      tripType,
      pickupCity,
      destinationCity,
      pickupDate,
      returnDate,
      pickupTime,
      packageId,
      airportName,
      airportSection
    });

    let newSearchParams = new URLSearchParams();
    
    // Map trip type to match VehicleList expectations
    const mappedTripType = tripType === 'round' ? 'round_trip' : 
                          tripType === 'oneway' ? 'oneway_trip' : 
                          tripType;
    newSearchParams.append('tripType', mappedTripType);
    
    if (tripType === 'round') {
      if (!pickupCity || !destinationCity || !pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, destination city, and pickup date",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }
      
      newSearchParams.append('pickupCity', pickupCity);
      newSearchParams.append('destinationCity', destinationCity);
      newSearchParams.append('pickupDate', pickupDate);
      if (pickupTime) {
        newSearchParams.append('pickupTime', pickupTime);
      }
      if (returnDate) {
        newSearchParams.append('returnDate', returnDate);
      }
      if (additionalCity) {
        newSearchParams.append('additionalCity', additionalCity);
      }
    } else if (tripType === 'oneway') {
      if (!pickupCity || !destinationCity || !pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, destination city, and pickup date",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }
      
      newSearchParams.append('pickupCity', pickupCity);
      newSearchParams.append('destinationCity', destinationCity);
      newSearchParams.append('pickupDate', pickupDate);
      if (pickupTime) {
        newSearchParams.append('pickupTime', pickupTime);
      }
    } else if (tripType === 'local') {
      if (!pickupCity || !packageId || !pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, package, and pickup date",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }
      
      newSearchParams.append('pickupCity', pickupCity);
      newSearchParams.append('package', packageId);
      newSearchParams.append('pickupDate', pickupDate);
      if (pickupTime) {
        newSearchParams.append('pickupTime', pickupTime);
      }
    } else if (tripType === 'airport') {
      if (!pickupCity || !airportName || !pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, airport name, and pickup date",
          variant: "destructive"
        });
        setIsSearching(false);
        return;
      }
      
      newSearchParams.append('pickupCity', pickupCity);
      newSearchParams.append('airportName', airportName);
      newSearchParams.append('pickupDate', pickupDate);
      newSearchParams.append('transferType', airportSection);
      if (pickupTime) {
        newSearchParams.append('pickupTime', pickupTime);
      }
    }
    
    const newUrl = `/vehicles?${newSearchParams.toString()}`;
    console.log('CompactSearchBox: Navigating to:', newUrl);
    
    // Force navigation even if on same route by using replace and then navigate
    if (window.location.pathname === '/vehicles') {
      // If already on vehicles page, force a refresh by going to a different path first
      navigate('/');
      setTimeout(() => {
        navigate(newUrl);
        setIsSearching(false);
      }, 10);
    } else {
      navigate(newUrl);
      setIsSearching(false);
    }
  };

  const handlePickupDateChange = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      setPickupDate(dateString);
      
      // If pickup date is today, validate pickup time
      if (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && pickupTime) {
        const currentTime = format(new Date(), 'HH:mm');
        if (pickupTime < currentTime) {
          setPickupTime(currentTime);
        }
      }
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      setReturnDate(dateString);
    }
  };

  const handleTimeChange = (value: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm');
    
    // If pickup date is today, don't allow past times
    if (pickupDate === today && value < currentTime) {
      return;
    }
    
    setPickupTime(value);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isReturnDateDisabled = (date: Date) => {
    if (!pickupDate) return true;
    
    const pickupDateObj = new Date(pickupDate);
    return date < pickupDateObj;
  };

  const getMinTime = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (pickupDate === today) {
      return format(new Date(), 'HH:mm');
    }
    return '00:00';
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 mb-6">
      {/* Trip Type Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTripType(tab.id)}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              tripType === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/20 text-foreground hover:bg-white/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Fields - Single Row */}
      <div className="flex flex-wrap gap-2 items-end">
        {/* Trip Type Specific Fields */}
        {(tripType === 'round' || tripType === 'oneway') && (
          <>
            <div className="flex-1 min-w-[150px]">
              <MapsCitySelect
                value={pickupCity}
                onValueChange={setPickupCity}
                placeholder="From"
                className="h-9 text-sm"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <MapsCitySelect
                value={destinationCity}
                onValueChange={setDestinationCity}
                placeholder="To"
                className="h-9 text-sm"
              />
            </div>
          </>
        )}

        {tripType === 'local' && (
          <>
            <div className="flex-1 min-w-[150px]">
              <MapsCitySelect
                value={pickupCity}
                onValueChange={setPickupCity}
                placeholder="City"
                className="h-9 text-sm"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Select value={packageId} onValueChange={setPackageId}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Package" />
                </SelectTrigger>
                <SelectContent>
                  {packages?.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.hours}hr/{pkg.kilometers}km
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {tripType === 'airport' && (
          <>
            <div className="flex gap-2 mb-2 w-full">
              <button
                onClick={() => setAirportSection('going-to')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  airportSection === 'going-to'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/20 text-foreground hover:bg-white/30'
                }`}
              >
                GOING TO AIRPORT
              </button>
              <button
                onClick={() => setAirportSection('coming-from')}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  airportSection === 'coming-from'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/20 text-foreground hover:bg-white/30'
                }`}
              >
                COMING FROM AIRPORT
              </button>
            </div>
            <div className="flex-1 min-w-[150px]">
              <MapsCitySelect
                value={pickupCity}
                onValueChange={setPickupCity}
                placeholder={airportSection === 'going-to' ? 'Pickup City' : 'Destination City'}
                className="h-9 text-sm"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <Input
                type="text"
                placeholder="Airport Name"
                value={airportName}
                onChange={(e) => setAirportName(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </>
        )}

        {/* Date */}
        <div className="flex-1 min-w-[150px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-9 w-full justify-start text-left font-normal text-sm",
                  !pickupDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-3 w-3" />
                {pickupDate ? format(new Date(pickupDate), "MMM dd") : "Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={pickupDate ? new Date(pickupDate) : undefined}
                onSelect={handlePickupDateChange}
                disabled={isDateDisabled}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date for Round Trip */}
        {tripType === 'round' && (
          <div className="flex-1 min-w-[150px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-9 w-full justify-start text-left font-normal text-sm",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-3 w-3" />
                  {returnDate ? format(new Date(returnDate), "MMM dd") : "Return"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate ? new Date(returnDate) : undefined}
                  onSelect={handleReturnDateChange}
                  disabled={isReturnDateDisabled}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Time */}
        <div className="min-w-[100px]">
          <Input
            type="time"
            value={pickupTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            min={getMinTime()}
            className="h-9 text-sm"
          />
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="h-9 px-6 bg-gradient-accent text-accent-foreground hover:shadow-glow transition-all duration-300"
        >
          <Search className="w-4 h-4 mr-2" />
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </div>
  );
};
