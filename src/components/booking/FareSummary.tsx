
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FareBreakdown } from '@/utils/fareCalculations';
import { useNavigate } from 'react-router-dom';

interface FareSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
  vehicleName: string;
  fareBreakdown: FareBreakdown;
  numberOfDays: number;
  numberOfNights: number;
  vehicleId: string;
  pickupCityId: string | null;
  destinationCityId: string | null;
  pickupDate: string | null;
  returnDate: string | null;
  mobileNumber: string;
  tripType?: string;
  packageId?: string | null;
  pickupTime?: string;
  airportName?: string | null;
  transferType?: string | null;
  additionalCity?: string | null;
}

export const FareSummary = ({
  isOpen,
  onClose,
  vehicleName,
  fareBreakdown,
  numberOfDays,
  numberOfNights,
  vehicleId,
  pickupCityId,
  destinationCityId,
  pickupDate,
  returnDate,
  mobileNumber,
  tripType = 'round',
  packageId,
  pickupTime = '09:00',
  airportName,
  transferType,
  additionalCity
}: FareSummaryProps) => {
  const navigate = useNavigate();

  const handleProceedToBooking = () => {
    const params = new URLSearchParams({
      vehicleId,
      vehicleName,
      pickupCityId: pickupCityId || '',
      pickupDate: pickupDate || '',
      numberOfDays: numberOfDays.toString(),
      totalAmount: fareBreakdown.total.toString(),
      mobileNumber,
      tripType,
      pickupTime,
      // Fare breakdown details
      baseFare: fareBreakdown.baseFare.toString(),
      extraKmCharge: fareBreakdown.extraKmCharge.toString(),
      dayDriverAllowance: fareBreakdown.totalDayDriverAllowance.toString(),
      nightCharge: fareBreakdown.totalNightCharge.toString(),
      gst: fareBreakdown.gst.toString(),
    });

    // Add optional parameters
    if (destinationCityId) {
      params.append('destinationCityId', destinationCityId);
    }
    if (returnDate) {
      params.append('returnDate', returnDate);
    }
    if (packageId) {
      params.append('package', packageId);
    }
    if (airportName) {
      params.append('airportName', airportName);
    }
    if (transferType) {
      params.append('transferType', transferType);
    }
    if (additionalCity) {
      params.append('additionalCity', additionalCity);
    }

    navigate(`/booking-form?${params.toString()}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Fare Summary</DialogTitle>
        </DialogHeader>
        
        <Card className="p-4">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{vehicleName}</h3>
              <p className="text-sm text-muted-foreground">
                {numberOfDays} day{numberOfDays > 1 ? 's' : ''} • {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Base Fare:</span>
                <span>₹{fareBreakdown.baseFare.toFixed(2)}</span>
              </div>
              
              {fareBreakdown.extraKmCharge > 0 && (
                <div className="flex justify-between">
                  <span>Extra KM Charge:</span>
                  <span>₹{fareBreakdown.extraKmCharge.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Driver Allowance:</span>
                <span>₹{fareBreakdown.totalDayDriverAllowance.toFixed(2)}</span>
              </div>
              
              {fareBreakdown.totalNightCharge > 0 && (
                <div className="flex justify-between">
                  <span>Night Charge:</span>
                  <span>₹{fareBreakdown.totalNightCharge.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>GST (5%):</span>
                <span>₹{fareBreakdown.gst.toFixed(2)}</span>
              </div>
              
              <hr className="my-2" />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount:</span>
                <span>₹{fareBreakdown.total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-green-600 text-sm">
                <span>Advance (20%):</span>
                <span>₹{(fareBreakdown.total * 0.2).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-blue-800">
                <strong>Note:</strong> Pay 20% advance to confirm booking. 
                Remaining amount to be paid to driver.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleProceedToBooking} className="flex-1">
                Proceed to Book
              </Button>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
