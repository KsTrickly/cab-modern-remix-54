
import { useState } from 'react';
import { Calendar, Clock, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CitySelect } from '@/components/ui/city-select';
import { useLocalPackages } from '@/hooks/useLocalPackages';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LocalData {
  pickupCity: string;
  package: string;
  pickupDate: string;
  pickupTime: string;
}

interface LocalSectionProps {
  data: LocalData;
  onChange: (data: LocalData) => void;
}

export const LocalSection = ({ data, onChange }: LocalSectionProps) => {
  const { data: packages, isLoading: isLoadingPackages } = useLocalPackages();

  const handleChange = (field: keyof LocalData, value: string) => {
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
      {/* City and Package Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            City
          </Label>
          <CitySelect
            value={data.pickupCity}
            onValueChange={(value) => handleChange('pickupCity', value)}
            placeholder="Select city"
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            Package
          </Label>
          <Select value={data.package} onValueChange={(value) => handleChange('package', value)}>
            <SelectTrigger>
              <SelectValue placeholder={isLoadingPackages ? "Loading packages..." : "Select package"} />
            </SelectTrigger>
            <SelectContent>
              {packages?.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  {pkg.name} - {pkg.hours}hr/{pkg.kilometers}km
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};
