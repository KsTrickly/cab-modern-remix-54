
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculateFareBreakdown } from '@/utils/fareCalculations';
import { AspectRatio } from '@/components/ui/aspect-ratio';

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
  vehicle: Vehicle;
  total?: number;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  rate: VehicleRate;
  tripType: string;
  numberOfDays: number;
  numberOfNights: number;
  onBookNow: (vehicle: Vehicle, rate: VehicleRate) => void;
}

export const VehicleCard = ({ 
  vehicle, 
  rate, 
  tripType,
  numberOfDays, 
  numberOfNights, 
  onBookNow 
}: VehicleCardProps) => {
  const fareBreakdown = calculateFareBreakdown(rate, numberOfDays, numberOfNights);

  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-md w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>{vehicle.name}</CardTitle>
        <CardDescription>{vehicle.model}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full">
          <AspectRatio ratio={1} className="bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={vehicle.image_url} 
              alt={vehicle.name} 
              className="w-full h-full object-cover object-center"
            />
          </AspectRatio>
        </div>
        <p>Seating Capacity: {vehicle.seating_capacity}</p>
        <p>Type: {vehicle.vehicle_type}</p>
        <div className="bg-gray-50 p-2 rounded text-sm">
          <div className="flex justify-between">
            <span>Base Fare ({rate.daily_km_limit} km/day × {numberOfDays} days):</span>
            <span>₹{fareBreakdown.baseFare.toFixed(2)}</span>
          </div>
          {fareBreakdown.extraKm > 0 && (
            <div className="flex justify-between">
              <span>Extra KM ({fareBreakdown.extraKm} km):</span>
              <span>₹{fareBreakdown.extraKmCharge.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Driver Allowance ({numberOfDays} days):</span>
            <span>₹{fareBreakdown.totalDayDriverAllowance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Night Charge ({numberOfNights} nights):</span>
            <span>₹{fareBreakdown.totalNightCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (5%):</span>
            <span>₹{fareBreakdown.gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Tolls tax:</span>
            <span>Excluded</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>State Tax:</span>
            <span>Excluded</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Parking:</span>
            <span>Excluded</span>
          </div>
          <hr className="my-1" />
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>₹{fareBreakdown.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onBookNow(vehicle, rate)} className="w-full bg-red-600 hover:bg-red-700">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};
