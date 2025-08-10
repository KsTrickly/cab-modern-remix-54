import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';

interface BookingData {
  id: string;
  ticket_id?: string;
  user_name: string;
  user_phone: string;
  user_email: string;
  pickup_date: string;
  return_date?: string;
  pickup_time: string;
  trip_type: string;
  booking_status: string;
  payment_status: string;
  total_amount: number;
  advance_amount?: number;
  pickup_address?: string;
  destination_address?: string;
  destination_name?: string;
  number_of_days: number;
  vehicle?: {
    name: string;
    model: string;
  };
  pickup_city?: {
    name: string;
  };
  destination_city?: {
    name: string;
  };
  airport_name?: string;
  package_id?: string;
  instructions?: string;
}

interface FareBreakdownData {
  baseFare: number;
  extraKmCharge: number;
  totalDayDriverAllowance: number;
  totalNightCharge: number;
  gst: number;
  total: number;
  extraKm?: number;
  totalKm?: number;
  includedKm?: number;
  dailyKmLimit?: number;
  extraPerKmCharge?: number;
  extraPerHourCharge?: number;
}

interface BookingTicketProps {
  booking: BookingData;
  fareBreakdown: FareBreakdownData;
  ticketId?: string;
}

export const BookingTicket: React.FC<BookingTicketProps> = ({ 
  booking, 
  fareBreakdown, 
  ticketId = booking.ticket_id || `RAC${booking.id.slice(-8).toUpperCase()}` 
}) => {
  const [searchParams] = useSearchParams();
  const getTripTypeLabel = (type: string) => {
    switch (type) {
      case 'round': return 'Round Trip';
      case 'oneway': return 'One Way';
      case 'local': return 'Local Trip';
      case 'airport': return 'Airport Transfer';
      default: return 'Trip';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Unpaid';
      case 'partial': return 'Partially Paid';
      case 'paid': return 'Paid';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getDestinationText = () => {
    // Destination should reflect the user's selected city from the URL when available
    const destinationFromParams = searchParams.get('destination');
    if (destinationFromParams && destinationFromParams.trim() !== '') {
      return destinationFromParams;
    }

    // Admin-edited destination name fallback
    const adminDestination = (booking as any).destination_name as string | undefined;
    if (adminDestination && adminDestination.trim() !== '') {
      return adminDestination;
    }

    // Fallbacks when neither URL param nor admin override is present
    if (booking.trip_type === 'airport') {
      return booking.airport_name || 'Airport';
    }
    if (booking.trip_type === 'local') {
      return `Local - ${booking.pickup_city?.name || 'N/A'}`;
    }
    if (booking.destination_city?.name) {
      return booking.destination_city.name;
    }
    return 'N/A';
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const time = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${date} ${time}`;
  };

  const balanceAmount = booking.total_amount - (booking.advance_amount || 0);
  const advanceAmount = booking.advance_amount || (booking.total_amount * 0.2);
  const totalKm = fareBreakdown.totalKm || (booking.number_of_days * (fareBreakdown.dailyKmLimit || 300));
  const includedKm = fareBreakdown.includedKm || (booking.number_of_days * (fareBreakdown.dailyKmLimit || 300));
  const extraKm = fareBreakdown.extraKm || 0;
  const dailyKmLimit = fareBreakdown.dailyKmLimit || 300;
  const extraPerKmCharge = fareBreakdown.extraPerKmCharge || 15;

  return (
    <div id="booking-ticket" className="max-w-4xl mx-auto bg-white text-black p-8 shadow-2xl rounded-lg border border-blue-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 border-b-2 border-blue-200 pb-6">
        <div className="flex items-center">
          <div className="w-40 mr-6">
            <img 
              src="/lovable-uploads/f124bac8-eff9-41ff-bbd5-0552c1b5a1d6.png" 
              alt="Raman Cab Logo"
              className="w-full h-auto object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-1">RAMAN CAB</h1>
            <p className="text-xl text-blue-500 font-medium">RENTAL CAB</p>
          </div>
        </div>
        <div className="text-right bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold text-blue-600 mb-2">RAMAN CAB</h2>
          <p className="text-sm text-blue-500 mb-1">www.ramancab.com</p>
          <p className="text-sm text-black">Contact: 9170006272</p>
          <p className="text-sm text-black">Email: support@ramancab.com</p>
        </div>
      </div>

      {/* Ticket ID */}
      <div className="mb-8" data-hide-in-pdf="true">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg inline-block">
          <h3 className="text-xl font-bold" data-ticket-id="true">
            TICKET ID: {ticketId}
          </h3>
        </div>
      </div>

      {/* Customer Details */}
      <Card className="mb-8 p-6 pdf-pad bg-blue-50 border border-blue-200 shadow-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-300 pb-3">
          Customer Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          <div>
            <span className="font-medium">Name:</span> {booking.user_name || 'N/A'}
          </div>
          <div>
            <span className="font-medium">Phone No.:</span> {booking.user_phone}
          </div>
          {booking.user_email && (
            <div className="md:col-span-2">
              <span className="font-medium">Email:</span> {booking.user_email}
            </div>
          )}
        </div>
      </Card>

      {/* Trip Details */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ticket-grid mb-8">
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-center">
            <div className="font-bold text-sm text-blue-600 mb-1">Booking On</div>
            <div className="text-sm text-black">{getCurrentDateTime()}</div>
          </div>
        </Card>
        
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-center">
            <div className="font-bold text-sm text-blue-600 mb-1">Vehicle Booked</div>
            <div className="text-sm text-black">{booking.vehicle?.name || 'N/A'} {booking.vehicle?.model ? `(${booking.vehicle.model})` : ''}</div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-center">
            <div className="font-bold text-sm text-blue-600 mb-1">Pickup Date</div>
            <div className="text-sm text-black">{formatDate(booking.pickup_date)}</div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-center">
            <div className="font-bold text-sm text-blue-600 mb-1">Pickup Time</div>
            <div className="text-sm text-black">{formatTime(booking.pickup_time)}</div>
          </div>
        </Card>

        {booking.return_date && (
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="text-center">
              <div className="font-bold text-sm text-blue-600 mb-1">Return Date</div>
              <div className="text-sm text-black">{formatDate(booking.return_date)}</div>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-center">
            <div className="font-bold text-sm text-blue-600 mb-1">Trip Type</div>
            <div className="text-sm text-black">{getTripTypeLabel(booking.trip_type)}</div>
          </div>
        </Card>

        {booking.trip_type === 'local' && booking.package_id && (
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <div className="text-center">
              <div className="font-bold text-sm text-blue-600 mb-1">Package</div>
              <div className="text-sm text-black">{booking.package_id}</div>
            </div>
          </Card>
        )}

        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="text-center">
            <div className="font-bold text-sm text-blue-600 mb-1">Status</div>
            <div className="text-sm text-black">{getPaymentStatusLabel(booking.payment_status)}</div>
          </div>
        </Card>
      </div>

      {/* Pickup and Destination Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ticket-grid mb-8">
        <Card className="p-6 pdf-pad bg-blue-50 border border-blue-200 shadow-lg">
          <h4 className="font-bold mb-3 text-blue-600 text-lg">Pickup Details</h4>
          <div className="text-black">
            <div><span className="font-medium">Pickup City:</span> {booking.pickup_city?.name || 'N/A'}</div>
            {booking.pickup_address && (
              <div><span className="font-medium">Pickup Address:</span> {booking.pickup_address}</div>
            )}
          </div>
        </Card>

        <Card className="p-6 pdf-pad bg-blue-50 border border-blue-200 shadow-lg">
          <h4 className="font-bold mb-3 text-blue-600 text-lg">Destination (Itinerary)</h4>
          <div className="text-black">
            <div><span className="font-medium">Destination:</span> {getDestinationText()}</div>
            {booking.destination_address && (
              <div><span className="font-medium">Destination Address:</span> {booking.destination_address}</div>
            )}
          </div>
        </Card>
      </div>

      {/* Fare Details */}
      <Card className="mb-8 p-6 pdf-pad bg-blue-50 border border-blue-200 shadow-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-300 pb-3">
          Estimated Trip Fare
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ticket-grid text-black">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>
                Estimated Trip Fare (Total KM: {totalKm} km):
              </span>
              <span>₹{booking.total_amount.toFixed(0)}</span>
            </div>
            <div className="text-sm text-gray-600 ml-4 bg-gray-100 p-3 rounded">
              <div className="font-semibold text-blue-600 mb-2">KM Breakdown:</div>
              <div>• Total Included KM: {includedKm} km</div>
              <div className="ml-4 text-xs">({dailyKmLimit} km/day × {booking.number_of_days} days)</div>
              {extraKm > 0 && (
                <div className="text-red-600 font-medium">• Extra KM: {extraKm} km</div>
              )}
            </div>
            
            <div className="flex justify-between">
              <span>Advance Amount:</span>
              <span>₹{advanceAmount.toFixed(0)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span>{getPaymentStatusLabel(booking.payment_status)}</span>
            </div>
            
            <div className="flex justify-between font-bold">
              <span>Balance:</span>
              <span>₹{balanceAmount.toFixed(0)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-blue-600 text-lg">Extra Charges, If Applicable:</h4>
            <div className="text-sm space-y-1">
              {booking.trip_type === 'local' && fareBreakdown.extraPerHourCharge && (
                <div className="flex justify-between">
                  <span>Extra per hour:</span>
                  <span>₹{fareBreakdown.extraPerHourCharge}/hr</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Extra per km:</span>
                <span>₹{extraPerKmCharge}/km</span>
              </div>
              <div className="flex justify-between">
                <span>TA/DA:</span>
                <span>Already Included</span>
              </div>
              <div className="flex justify-between">
                <span>Tolls & State Tax:</span>
                <span>Excluded</span>
              </div>
              <div className="flex justify-between">
                <span>Airport Parking:</span>
                <span>As per actual</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="mb-8 p-6 pdf-pad bg-blue-50 border border-blue-200 shadow-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-300 pb-3">
          Instructions
        </h3>
        <div className="text-black whitespace-pre-line text-sm leading-relaxed">
          {booking.instructions && booking.instructions.trim() !== '' ? booking.instructions : ''}
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center bg-blue-500 text-white p-6 rounded-lg shadow-lg mt-8">
        <p className="text-lg font-semibold mb-2">Thank you for choosing Raman Cab Service!</p>
        <p className="text-sm">For any queries, contact us at support@ramancab.com or call 9170006272</p>
      </div>
    </div>
  );
};
