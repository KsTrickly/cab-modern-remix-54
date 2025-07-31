
import { useState } from 'react';
import { Calendar, Clock, MapPin, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CitySelect } from '@/components/ui/city-select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AirportData {
  pickupCity: string;
  airportName: string;
  pickupDate: string;
  pickupTime: string;
}

interface AirportTransferSectionProps {
  data: AirportData;
  onChange: (data: AirportData) => void;
  airportSection: 'going-to' | 'coming-from';
  onSectionChange: (section: 'going-to' | 'coming-from') => void;
}

export const AirportTransferSection = ({ 
  data, 
  onChange, 
  airportSection, 
  onSectionChange 
}: AirportTransferSectionProps) => {
  const handleChange = (field: keyof AirportData, value: string) => {
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

  const getMinTime = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (data.pickupDate === today) {
      return format(new Date(), 'HH:mm');
    }
    return '00:00';
  };

  return (
    <div className="space-y-4">
      {/* Transfer Type Toggle */}
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
          <button
            type="button"
            onClick={() => onSectionChange('going-to')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              airportSection === 'going-to'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Going to Airport
          </button>
          <button
            type="button"
            onClick={() => onSectionChange('coming-from')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              airportSection === 'coming-from'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Coming from Airport
          </button>
        </div>
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {airportSection === 'going-to' ? 'Pickup City' : 'Destination City'}
          </Label>
          <CitySelect
            value={data.pickupCity}
            onValueChange={(value) => handleChange('pickupCity', value)}
            placeholder={`Select ${airportSection === 'going-to' ? 'pickup' : 'destination'} city`}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Airport Name
          </Label>
          <Input
            type="text"
            placeholder="Enter airport name"
            value={data.airportName}
            onChange={(e) => handleChange('airportName', e.target.value)}
          />
        </div>
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {airportSection === 'going-to' ? 'Pickup Date' : 'Arrival Date'}
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
            {airportSection === 'going-to' ? 'Pickup Time' : 'Arrival Time'}
          </Label>
          <Input
            type="time"
            value={data.pickupTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            min={getMinTime()}
          />
        </div>
      </div>
    </div>
  );
};
