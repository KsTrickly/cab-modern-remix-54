
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookingTicket } from '@/components/ticket/BookingTicket';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, ArrowLeft, Share2 } from 'lucide-react';
import { downloadTicketPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { calculateFareBreakdown } from '@/utils/fareCalculations';
import Navigation from '@/components/Navigation';

const BookingTicketPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error('Booking ID is required');

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicles(name, model),
          pickup_city:cities!pickup_city_id(name),
          destination_city:cities!destination_city_id(name),
          additional_city:cities!additional_city_id(name)
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!bookingId
  });

  // Fetch vehicle rate data for the specific booking
  const { data: vehicleRate } = useQuery({
    queryKey: ['vehicleRate', booking?.vehicle_id, booking?.pickup_city_id, booking?.destination_city_id, booking?.package_id, booking?.trip_type],
    queryFn: async () => {
      if (!booking?.vehicle_id || !booking?.pickup_city_id) return null;

      // For local trips, fetch by package_id
      if (booking.trip_type === 'local' && booking.package_id) {
        const { data, error } = await supabase
          .from('vehicle_rates')
          .select('*')
          .eq('vehicle_id', booking.vehicle_id)
          .eq('pickup_city_id', booking.pickup_city_id)
          .eq('package_id', booking.package_id)
          .eq('trip_type', 'local')
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Error fetching local vehicle rate:', error);
          return null;
        }
        return data;
      }

      // For other trip types, fetch by pickup and destination cities
      if (booking.destination_city_id) {
        const { data, error } = await supabase
          .from('vehicle_rates')
          .select('*')
          .eq('vehicle_id', booking.vehicle_id)
          .eq('pickup_city_id', booking.pickup_city_id)
          .eq('destination_city_id', booking.destination_city_id)
          .eq('trip_type', booking.trip_type === 'round' ? 'round_trip' : 'oneway_trip')
          .eq('is_active', true)
          .single();

        if (error) {
          console.error('Error fetching vehicle rate:', error);
          return null;
        }
        return data;
      }

      // Fallback to common rates if no specific rate found
      const { data, error } = await supabase
        .from('common_rates')
        .select('*')
        .eq('vehicle_id', booking.vehicle_id)
        .eq('pickup_city_id', booking.pickup_city_id)
        .eq('trip_type', booking.trip_type === 'round' ? 'round_trip' : 'oneway_trip')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching common rate:', error);
        return null;
      }
      return data;
    },
    enabled: !!booking
  });

  const handleDownloadPDF = async () => {
    if (!booking) return;
    
    try {
      const ticketId = booking.ticket_id || `RAC${booking.id.slice(-8).toUpperCase()}`;
      await downloadTicketPDF(ticketId);
      toast({
        title: "Success",
        description: "Ticket downloaded successfully!"
      });
    } catch (error) {
      console.error('PDF download failed:', error);
      toast({
        title: "Error",
        description: "Failed to download ticket. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Booking Ticket',
          text: `Booking confirmed for ${booking?.vehicle?.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Ticket link copied to clipboard!"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 pt-24 text-center">
          <Card className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-destructive">Ticket Not Found</h1>
            <p className="mb-4">The booking ticket you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Calculate fare breakdown using actual vehicle rate data if available
  const dailyKmLimit = vehicleRate?.daily_km_limit || 300;
  const includedKm = dailyKmLimit * booking.number_of_days;
  
  // Get total KM from vehicle rate card - ensure it's a number
  const totalKm = (vehicleRate && 'total_running_km' in vehicleRate && typeof vehicleRate.total_running_km === 'number') 
    ? vehicleRate.total_running_km 
    : includedKm;
  
  const extraKm = Math.max(0, totalKm - includedKm);

  const fareBreakdown = {
    baseFare: booking.total_amount * 0.65,
    extraKmCharge: 0,
    totalDayDriverAllowance: booking.total_amount * 0.2,
    totalNightCharge: booking.total_amount * 0.1,
    gst: booking.total_amount * 0.05,
    total: booking.total_amount,
    totalKm: totalKm,
    includedKm: includedKm,
    extraKm: extraKm,
    dailyKmLimit: dailyKmLimit,
    extraPerKmCharge: vehicleRate?.extra_per_km_charge || 15,
    extraPerHourCharge: vehicleRate?.extra_per_hour_charge || 100
  };

  const ticketId = booking.ticket_id || `RAC${booking.id.slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleShare}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              
              <Button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Ticket Component */}
        <BookingTicket 
          booking={booking} 
          fareBreakdown={fareBreakdown}
          ticketId={ticketId}
        />

        {/* Additional Actions */}
        <div className="max-w-4xl mx-auto mt-8 text-center">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about your booking, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => window.open('tel:9170006272')}>
                Call Support: 9170006272
              </Button>
              <Button variant="outline" onClick={() => window.open('mailto:support@ramancab.com')}>
                Email: support@ramancab.com
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingTicketPage;
