
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSearchParams } from 'react-router-dom';

interface LeadPopupProps {
  isOpen: boolean;
  onClose: () => void;
  mobileNumber: string;
  onMobileNumberChange: (value: string) => void;
  onSubmit: (mobile: string) => void;
  vehicleName: string;
  vehicleId?: string;
}

export const LeadPopup = ({ 
  isOpen, 
  onClose, 
  mobileNumber, 
  onMobileNumberChange, 
  onSubmit,
  vehicleName,
  vehicleId 
}: LeadPopupProps) => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Extract trip information from URL parameters
  const pickupCityId = searchParams.get('pickupCityId') || searchParams.get('pickupCity');
  const destinationCityIdRaw = searchParams.get('destinationCityId') || searchParams.get('destinationCity');
  
  // Handle Google Maps destination IDs - convert to null for database storage
  const destinationCityId = destinationCityIdRaw?.startsWith('google_maps_') ? null : destinationCityIdRaw;
  const tripType = searchParams.get('tripType');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const handleSubmit = async () => {
    if (mobileNumber) {
      try {
        // Save lead to discount_leads table
        const leadData = {
          mobile_number: mobileNumber,
          vehicle_name: vehicleName,
          vehicle_id: vehicleId || null,
          pickup_city_id: pickupCityId || null,
          destination_city_id: destinationCityId || null,
          trip_type: tripType || null,
          pickup_date: pickupDate || null,
          return_date: returnDate || null,
          lead_source: 'discount_popup',
          coupon_requested: true,
          status: 'pending'
        };

        const { error } = await supabase
          .from('discount_leads')
          .insert([leadData]);

        if (error) {
          console.error('Error saving lead:', error);
          toast({
            title: "Error",
            description: "Failed to save your request. Please try again.",
            variant: "destructive"
          });
          return;
        }

        console.log('Lead saved successfully:', leadData);
        
        toast({
          title: "Success!",
          description: "Your discount coupon request has been submitted. Our team will contact you soon.",
        });

        onSubmit(mobileNumber);
      } catch (error) {
        console.error('Error saving lead:', error);
        toast({
          title: "Error",
          description: "Failed to save your request. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Get Discount Coupon!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 p-4">
          <p className="text-center text-muted-foreground">
            Enter Your Mobile Number to get Discount Coupon Code up to 25%
          </p>
          {vehicleName && (
            <p className="text-center text-sm font-medium">
              Selected Vehicle: {vehicleName}
            </p>
          )}
          <Input
            type="tel"
            placeholder="Enter Mobile Number"
            value={mobileNumber}
            onChange={(e) => onMobileNumberChange(e.target.value)}
            className="text-center"
          />
          <Button 
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={!mobileNumber}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
