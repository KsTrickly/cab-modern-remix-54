import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BookingEditDialog } from './BookingEditDialog';
import { Calendar, MapPin, Car, Phone, Mail, User, Users, CreditCard, Edit, Search, Filter, FileText, Eye } from 'lucide-react';
import { downloadTicketPDF } from '@/utils/pdfGenerator';

interface Booking {
  id: string;
  ticket_id?: string;
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
  advance_amount?: number;
  advance_paid?: boolean;
  payment_status?: string;
  booking_status: string;
  created_at: string;
  trip_type?: string;
  pickup_city: { name: string };
  destination_city: { name: string };
  vehicle: { name: string; model: string };
}

interface Filters {
  fromCreateDate: string;
  toCreateDate: string;
  fromPickupDate: string;
  toPickupDate: string;
  bookingId: string;
  name: string;
  email: string;
  mobile: string;
  phoneNumber: string;
  ticketId: string;
  customerName: string;
  emailId: string;
  city: string;
  vehicleNo: string;
  driverMobile: string;
  vehicle: string;
  bookingType: string;
  vendor: string;
  chauffeur: string;
  company: string;
  booker: string;
  billTo: string;
  billViaKm: string;
  invoiceInCover: string;
  closedMode: string;
  bookingVia: string;
  status: string;
  pageSize: string;
  orderBy: string;
}

export const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();

  const [filters, setFilters] = useState<Filters>({
    fromCreateDate: '',
    toCreateDate: '',
    fromPickupDate: '',
    toPickupDate: '',
    bookingId: '',
    name: '',
    email: '',
    mobile: '',
    phoneNumber: '',
    ticketId: '',
    customerName: '',
    emailId: '',
    city: '',
    vehicleNo: '',
    driverMobile: '',
    vehicle: '',
    bookingType: '',
    vendor: '',
    chauffeur: '',
    company: '',
    booker: '',
    billTo: '',
    billViaKm: '',
    invoiceInCover: '',
    closedMode: '',
    bookingVia: '',
    status: '',
    pageSize: '100',
    orderBy: 'Descending'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, filters]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          pickup_city:cities!pickup_city_id(name),
          destination_city:cities!destination_city_id(name),
          vehicle:vehicles(name, model)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Apply date filters
    if (filters.fromCreateDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.created_at) >= new Date(filters.fromCreateDate)
      );
    }
    
    if (filters.toCreateDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.created_at) <= new Date(filters.toCreateDate)
      );
    }

    if (filters.fromPickupDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.pickup_date) >= new Date(filters.fromPickupDate)
      );
    }

    if (filters.toPickupDate) {
      filtered = filtered.filter(booking => 
        new Date(booking.pickup_date) <= new Date(filters.toPickupDate)
      );
    }

    // Apply text filters
    if (filters.bookingId || filters.ticketId) {
      const searchId = (filters.bookingId || filters.ticketId).toLowerCase();
      filtered = filtered.filter(booking => 
        booking.id.toLowerCase().includes(searchId) ||
        (booking.ticket_id?.toLowerCase().includes(searchId) ?? false)
      );
    }

    if (filters.name || filters.customerName) {
      const searchName = filters.name || filters.customerName;
      filtered = filtered.filter(booking => 
        booking.user_name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (filters.email || filters.emailId) {
      const searchEmail = filters.email || filters.emailId;
      filtered = filtered.filter(booking => 
        booking.user_email?.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    if (filters.mobile || filters.phoneNumber) {
      const searchPhone = filters.mobile || filters.phoneNumber;
      filtered = filtered.filter(booking => 
        booking.user_phone.includes(searchPhone)
      );
    }

    if (filters.city) {
      filtered = filtered.filter(booking => 
        booking.pickup_city?.name.toLowerCase().includes(filters.city.toLowerCase()) ||
        booking.destination_city?.name.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.vehicle) {
      filtered = filtered.filter(booking => 
        booking.vehicle?.name.toLowerCase().includes(filters.vehicle.toLowerCase())
      );
    }

    if (filters.bookingType && filters.bookingType !== 'all') {
      filtered = filtered.filter(booking => 
        booking.trip_type?.toLowerCase().includes(filters.bookingType.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(booking => 
        booking.booking_status?.toLowerCase().includes(filters.status.toLowerCase())
      );
    }

    // Apply sorting
    if (filters.orderBy === 'Ascending') {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Apply page size limit
    if (filters.pageSize !== 'All') {
      filtered = filtered.slice(0, parseInt(filters.pageSize));
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: status })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Booking status updated successfully"
      });
      
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  const updatePaymentStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          payment_status: status,
          advance_paid: status === 'paid'
        })
        .eq('id', bookingId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Payment status updated successfully"
      });
      
      fetchBookings();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
        variant: "destructive"
      });
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingBooking(null);
    setIsEditDialogOpen(false);
  };

  const handleSaveEdit = () => {
    fetchBookings();
  };

  const handleViewTicket = (bookingId: string) => {
    window.open(`/ticket/${bookingId}`, '_blank');
  };

  const handleDownloadTicket = async (booking: Booking) => {
    try {
      // First open the ticket page in a hidden iframe to generate the content
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `/ticket/${booking.id}`;
      document.body.appendChild(iframe);

      iframe.onload = async () => {
        try {
          const ticketId = booking.ticket_id || `RAC${booking.id.slice(-8).toUpperCase()}`;
          // Wait a bit for the content to load
          setTimeout(async () => {
            try {
              const ticketElement = iframe.contentDocument?.getElementById('booking-ticket');
              if (ticketElement) {
                // Clone the element to the main document temporarily
                const clonedElement = ticketElement.cloneNode(true) as HTMLElement;
                clonedElement.id = 'temp-booking-ticket';
                clonedElement.style.position = 'absolute';
                clonedElement.style.left = '-9999px';
                document.body.appendChild(clonedElement);

                await downloadTicketPDF(ticketId);
                document.body.removeChild(clonedElement);
                
                toast({
                  title: "Success",
                  description: "Ticket downloaded successfully!"
                });
              } else {
                throw new Error('Ticket element not found');
              }
            } catch (error) {
              console.error('PDF download failed:', error);
              toast({
                title: "Error",
                description: "Failed to download ticket. Please try opening the ticket page first.",
                variant: "destructive"
              });
            } finally {
              document.body.removeChild(iframe);
            }
          }, 2000);
        } catch (error) {
          console.error('Error accessing iframe content:', error);
          toast({
            title: "Info",
            description: "Opening ticket page for download...",
          });
          handleViewTicket(booking.id);
          document.body.removeChild(iframe);
        }
      };
    } catch (error) {
      console.error('Error setting up ticket download:', error);
      toast({
        title: "Error",
        description: "Failed to download ticket. Opening ticket page instead.",
        variant: "destructive"
      });
      handleViewTicket(booking.id);
    }
  };

  const resetFilters = () => {
    setFilters({
      fromCreateDate: '',
      toCreateDate: '',
      fromPickupDate: '',
      toPickupDate: '',
      bookingId: '',
      name: '',
      email: '',
      mobile: '',
      phoneNumber: '',
      ticketId: '',
      customerName: '',
      emailId: '',
      city: '',
      vehicleNo: '',
      driverMobile: '',
      vehicle: '',
      bookingType: '',
      vendor: '',
      chauffeur: '',
      company: '',
      booker: '',
      billTo: '',
      billViaKm: '',
      invoiceInCover: '',
      closedMode: '',
      bookingVia: '',
      status: '',
      pageSize: '100',
      orderBy: 'Descending'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading bookings...</div>;

  return (
    <>
      {/* Filter Section */}
      <div className="bg-teal-500 text-white p-4 mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Search By Date</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className="text-white hover:bg-teal-600"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <Label className="text-white text-sm">From Create Date:</Label>
            <Input
              type="date"
              value={filters.fromCreateDate}
              onChange={(e) => setFilters({...filters, fromCreateDate: e.target.value})}
              className="bg-white text-black"
            />
          </div>
          <div>
            <Label className="text-white text-sm">To Create Date:</Label>
            <Input
              type="date"
              value={filters.toCreateDate}
              onChange={(e) => setFilters({...filters, toCreateDate: e.target.value})}
              className="bg-white text-black"
            />
          </div>
          <div>
            <Label className="text-white text-sm">From Pickup Date:</Label>
            <Input
              type="date"
              value={filters.fromPickupDate}
              onChange={(e) => setFilters({...filters, fromPickupDate: e.target.value})}
              className="bg-white text-black"
            />
          </div>
          <div>
            <Label className="text-white text-sm">To Pickup Date:</Label>
            <Input
              type="date"
              value={filters.toPickupDate}
              onChange={(e) => setFilters({...filters, toPickupDate: e.target.value})}
              className="bg-white text-black"
            />
          </div>
        </div>
      </div>

      {showFilters && (
        <>
          {/* Basic Details Filter */}
          <div className="bg-teal-500 text-white p-4 mb-4">
            <h3 className="font-semibold mb-4">Search By Basic Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-white text-sm">Ticket ID:</Label>
                <Input
                  value={filters.ticketId}
                  onChange={(e) => setFilters({...filters, ticketId: e.target.value})}
                  className="bg-white text-black"
                  placeholder="Enter ticket ID"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Customer Name:</Label>
                <Input
                  value={filters.customerName}
                  onChange={(e) => setFilters({...filters, customerName: e.target.value})}
                  className="bg-white text-black"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Email ID:</Label>
                <Input
                  value={filters.emailId}
                  onChange={(e) => setFilters({...filters, emailId: e.target.value})}
                  className="bg-white text-black"
                  placeholder="Enter email ID"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Phone Number:</Label>
                <Input
                  value={filters.phoneNumber}
                  onChange={(e) => setFilters({...filters, phoneNumber: e.target.value})}
                  className="bg-white text-black"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Legacy Basic Details Filter */}
          <div className="bg-teal-500 text-white p-4 mb-4">
            <h3 className="font-semibold mb-4">Additional Search Parameters</h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <Label className="text-white text-sm">Booking ID:</Label>
                <Input
                  value={filters.bookingId}
                  onChange={(e) => setFilters({...filters, bookingId: e.target.value})}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Name:</Label>
                <Input
                  value={filters.name}
                  onChange={(e) => setFilters({...filters, name: e.target.value})}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Email:</Label>
                <Input
                  value={filters.email}
                  onChange={(e) => setFilters({...filters, email: e.target.value})}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Mobile:</Label>
                <Input
                  value={filters.mobile}
                  onChange={(e) => setFilters({...filters, mobile: e.target.value})}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label className="text-white text-sm">City:</Label>
                <Input
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="bg-white text-black"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Vehicle No:</Label>
                <Input
                  value={filters.vehicleNo}
                  onChange={(e) => setFilters({...filters, vehicleNo: e.target.value})}
                  className="bg-white text-black"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-teal-500 text-white p-4 mb-4">
            <h3 className="font-semibold mb-4">Search By Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-white text-sm">Vehicle:</Label>
                <Select value={filters.vehicle} onValueChange={(value) => setFilters({...filters, vehicle: value})}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white text-sm">Booking Type:</Label>
                <Select value={filters.bookingType} onValueChange={(value) => setFilters({...filters, bookingType: value})}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="round">Round Trip</SelectItem>
                    <SelectItem value="oneway">One Way</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="airport">Airport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white text-sm">Status:</Label>
                <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white text-sm">Order By:</Label>
                <Select value={filters.orderBy} onValueChange={(value) => setFilters({...filters, orderBy: value})}>
                  <SelectTrigger className="bg-white text-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Descending">Descending</SelectItem>
                    <SelectItem value="Ascending">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mb-6">
            <Button onClick={applyFilters} className="bg-green-600 hover:bg-green-700">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={resetFilters} variant="outline">
              Reset
            </Button>
          </div>
        </>
      )}

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <div className="text-sm text-muted-foreground">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-semibold">#{booking.id.slice(0, 8)}</div>
                  <Badge className={getStatusColor(booking.booking_status)}>
                    {booking.booking_status?.toUpperCase()}
                  </Badge>
                  <Badge className={getPaymentStatusColor(booking.payment_status || 'pending')}>
                    {booking.payment_status?.toUpperCase() || 'PENDING'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{booking.total_amount}</div>
                  {booking.advance_amount && (
                    <div className="text-sm text-green-600">
                      Advance: ₹{booking.advance_amount} {booking.advance_paid ? '(Paid)' : '(Pending)'}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{booking.user_name || 'N/A'}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.user_phone}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{booking.user_email || 'N/A'}</span>
                </div>
              </div>

              {/* Trip Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.pickup_city?.name} → {booking.destination_city?.name}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.vehicle?.name} {booking.vehicle?.model}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.number_of_days} day{booking.number_of_days > 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.number_of_persons || 1} person{(booking.number_of_persons || 1) > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Addresses */}
              {(booking.pickup_address || booking.destination_address) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  {booking.pickup_address && (
                    <div>
                      <span className="font-medium text-muted-foreground">Pickup Address:</span>
                      <p className="mt-1">{booking.pickup_address}</p>
                    </div>
                  )}
                  {booking.destination_address && (
                    <div>
                      <span className="font-medium text-muted-foreground">Destination Address:</span>
                      <p className="mt-1">{booking.destination_address}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Travel Date: {new Date(booking.pickup_date).toLocaleDateString()} at {booking.pickup_time}
                  {booking.return_date && ` - ${new Date(booking.return_date).toLocaleDateString()}`}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewTicket(booking.id)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Ticket
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadTicket(booking)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Download PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditBooking(booking)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  
                  <Select 
                    value={booking.booking_status} 
                    onValueChange={(value) => updateBookingStatus(booking.id, value)}
                  >
                    <SelectTrigger className="w-40">
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

                  <Select 
                    value={booking.payment_status || 'pending'} 
                    onValueChange={(value) => updatePaymentStatus(booking.id, value)}
                  >
                    <SelectTrigger className="w-32">
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
            </Card>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found matching the current filters
            </div>
          )}
        </div>
      </Card>

      <BookingEditDialog
        booking={editingBooking}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />
    </>
  );
};
