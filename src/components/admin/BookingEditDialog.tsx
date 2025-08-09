
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Booking {
  id: string;
  user_phone: string;
  user_name?: string;
  user_email?: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  pickup_address?: string;
  destination_address?: string;
  destination_name?: string;
  number_of_days: number;
  number_of_persons?: number;
  total_amount: number;
  total_km_override?: number | null;
  advance_amount?: number;
  advance_paid?: boolean;
  payment_status?: string;
  booking_status: string;
}

interface BookingEditDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const BookingEditDialog = ({ booking, isOpen, onClose, onSave }: BookingEditDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Booking>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (booking) {
      setFormData({
        user_name: booking.user_name || '',
        user_email: booking.user_email || '',
        user_phone: booking.user_phone,
        pickup_date: booking.pickup_date,
        pickup_time: booking.pickup_time,
        return_date: booking.return_date || '',
        pickup_address: booking.pickup_address || '',
        destination_address: booking.destination_address || '',
        destination_name: (booking as any).destination_name || '',
        number_of_days: booking.number_of_days,
        number_of_persons: booking.number_of_persons || 1,
        total_amount: booking.total_amount,
        total_km_override: (booking as any).total_km_override ?? null,
        advance_amount: booking.advance_amount || 0,
        advance_paid: booking.advance_paid || false,
        payment_status: booking.payment_status || 'pending',
        booking_status: booking.booking_status
      });
    }
  }, [booking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update(formData)
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Booking updated successfully"
      });

      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof Booking, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Booking #{booking.id.slice(0, 8)}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">Customer Name</Label>
              <Input
                id="user_name"
                value={formData.user_name || ''}
                onChange={(e) => handleInputChange('user_name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_phone">Phone Number</Label>
              <Input
                id="user_phone"
                value={formData.user_phone || ''}
                onChange={(e) => handleInputChange('user_phone', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user_email">Email</Label>
              <Input
                id="user_email"
                type="email"
                value={formData.user_email || ''}
                onChange={(e) => handleInputChange('user_email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_persons">Number of Persons</Label>
              <Input
                id="number_of_persons"
                type="number"
                min="1"
                value={formData.number_of_persons || 1}
                onChange={(e) => handleInputChange('number_of_persons', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_date">Pickup Date</Label>
              <Input
                id="pickup_date"
                type="date"
                value={formData.pickup_date || ''}
                onChange={(e) => handleInputChange('pickup_date', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickup_time">Pickup Time</Label>
              <Input
                id="pickup_time"
                type="time"
                value={formData.pickup_time || ''}
                onChange={(e) => handleInputChange('pickup_time', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="return_date">Return Date</Label>
              <Input
                id="return_date"
                type="date"
                value={formData.return_date || ''}
                onChange={(e) => handleInputChange('return_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number_of_days">Number of Days</Label>
              <Input
                id="number_of_days"
                type="number"
                min="1"
                value={formData.number_of_days || 1}
                onChange={(e) => handleInputChange('number_of_days', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount || 0}
                onChange={(e) => handleInputChange('total_amount', parseFloat(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_km_override">Total KM (override)</Label>
              <Input
                id="total_km_override"
                type="number"
                step="1"
                min="0"
                value={formData.total_km_override ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  handleInputChange('total_km_override' as keyof Booking, v === '' ? null : parseFloat(v));
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advance_amount">Advance Amount</Label>
              <Input
                id="advance_amount"
                type="number"
                step="0.01"
                value={formData.advance_amount || 0}
                onChange={(e) => handleInputChange('advance_amount', parseFloat(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking_status">Booking Status</Label>
              <Select 
                value={formData.booking_status || 'draft'} 
                onValueChange={(value) => handleInputChange('booking_status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select 
                value={formData.payment_status || 'pending'} 
                onValueChange={(value) => handleInputChange('payment_status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickup_address">Pickup Address</Label>
            <Textarea
              id="pickup_address"
              value={formData.pickup_address || ''}
              onChange={(e) => handleInputChange('pickup_address', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination_name">Destination (Itinerary)</Label>
            <Input
              id="destination_name"
              value={(formData as any).destination_name || ''}
              onChange={(e) => handleInputChange('destination_name' as keyof Booking, e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination_address">Destination Address</Label>
            <Textarea
              id="destination_address"
              value={formData.destination_address || ''}
              onChange={(e) => handleInputChange('destination_address', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
