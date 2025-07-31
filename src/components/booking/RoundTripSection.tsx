
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CitySelect } from '@/components/ui/city-select';
import { MapsCitySelect } from '@/components/ui/maps-city-select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RoundTripData {
  pickupCity: string;
  destinationCity: string;
  additionalCity: string;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
}

interface RoundTripSectionProps {
  data: RoundTripData;
  onChange: (data: RoundTripData) => void;
}

export const RoundTripSection = ({ data, onChange }: RoundTripSectionProps) => {
  const [showAdditionalCity, setShowAdditionalCity] = useState(false);

  const handleChange = (field: keyof RoundTripData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePickupDateChange = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      handleChange('pickupDate', dateString);
      
      // If pickup date is today, validate pickup time
      if (format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && data.pickupTime) {
        const currentTime = format(new Date(), 'HH:mm');
        if (data.pickupTime < currentTime) {
          handleChange('pickupTime', currentTime);
        }
      }
    }
  };

  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      handleChange('returnDate', dateString);
    }
  };

  const handleTimeChange = (value: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentTime = format(new Date(), 'HH:mm');
    
    // If pickup date is today, don't allow past times
    if (data.pickupDate === today && value < currentTime) {
      return;
    }
    
    handleChange('pickupTime', value);
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isReturnDateDisabled = (date: Date) => {
    return false; // Allow all dates for return date
  };

  const getMinTime = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (data.pickupDate === today) {
      return format(new Date(), 'HH:mm');
    }
    return '00:00';
  };

  return (
    <div className="space-y-4">
      {/* Cities Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            From City
          </Label>
          <CitySelect
            value={data.pickupCity}
            onValueChange={(value) => handleChange('pickupCity', value)}
            placeholder="Select pickup city"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            To City
          </Label>
          <MapsCitySelect
            value={data.destinationCity}
            onValueChange={(value) => handleChange('destinationCity', value)}
            placeholder="Search destination"
          />
        </div>
      </div>

      {/* Additional City */}
      {showAdditionalCity && (
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Additional City (Optional)
          </Label>
          <CitySelect
            value={data.additionalCity}
            onValueChange={(value) => handleChange('additionalCity', value)}
            placeholder="Select additional city"
          />
        </div>
      )}

      {!showAdditionalCity && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAdditionalCity(true)}
          className="w-fit"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Additional City
        </Button>
      )}

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Pickup Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.pickupDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {data.pickupDate ? format(new Date(data.pickupDate), "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={data.pickupDate ? new Date(data.pickupDate) : undefined}
                onSelect={handlePickupDateChange}
                disabled={isDateDisabled}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pickup Time
          </Label>
          <Input
            type="time"
            value={data.pickupTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            min={getMinTime()}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Return Date (Optional)
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.returnDate && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {data.returnDate ? format(new Date(data.returnDate), "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={data.returnDate ? new Date(data.returnDate) : undefined}
                onSelect={handleReturnDateChange}
                disabled={isReturnDateDisabled}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
