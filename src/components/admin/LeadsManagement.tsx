
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Search, Calendar, Phone, User, Car, MapPin, Edit3, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DiscountLead {
  id: string;
  mobile_number: string;
  vehicle_name: string;
  vehicle_id: string | null;
  pickup_city_id: string | null;
  destination_city_id: string | null;
  trip_type: string | null;
  pickup_date: string | null;
  return_date: string | null;
  lead_source: string;
  coupon_requested: boolean;
  status: 'pending' | 'contacted' | 'converted' | 'not_interested';
  notes: string | null;
  contacted_at: string | null;
  converted_to_booking_id: string | null;
  created_at: string;
  updated_at: string;
  pickup_city?: { name: string };
  destination_city?: { name: string };
  vehicle?: { name: string; model: string };
}

export const LeadsManagement = () => {
  const [leads, setLeads] = useState<DiscountLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<DiscountLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<DiscountLead>>({});
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    mobileNumber: '',
    status: 'all',
    tripType: 'all'
  });
  const { toast } = useToast();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Fetch leads without joins for now, we'll enhance this later
      const { data: leadsData, error } = await supabase
        .from('discount_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error",
          description: "Failed to fetch leads",
          variant: "destructive"
        });
        return;
      }

      // Transform the data to match our interface
      const transformedLeads: DiscountLead[] = (leadsData || []).map(lead => ({
        ...lead,
        status: lead.status as 'pending' | 'contacted' | 'converted' | 'not_interested'
      }));

      setLeads(transformedLeads);
      setFilteredLeads(transformedLeads);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const applyFilters = () => {
    let filtered = [...leads];

    // Filter by date range
    if (filters.fromDate) {
      filtered = filtered.filter(lead => 
        new Date(lead.created_at) >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      filtered = filtered.filter(lead => 
        new Date(lead.created_at) <= new Date(filters.toDate + 'T23:59:59')
      );
    }

    // Filter by mobile number
    if (filters.mobileNumber) {
      filtered = filtered.filter(lead => 
        lead.mobile_number.includes(filters.mobileNumber)
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    // Filter by trip type
    if (filters.tripType !== 'all') {
      filtered = filtered.filter(lead => lead.trip_type === filters.tripType);
    }

    setFilteredLeads(filtered);
  };

  const clearFilters = () => {
    setFilters({ fromDate: '', toDate: '', mobileNumber: '', status: 'all', tripType: 'all' });
    setFilteredLeads(leads);
  };

  const handleEdit = (lead: DiscountLead) => {
    setEditingLead(lead.id);
    setEditData({
      status: lead.status,
      notes: lead.notes || '',
    });
  };

  const handleSave = async (leadId: string) => {
    try {
      const updateData: any = {
        status: editData.status,
        notes: editData.notes,
        updated_at: new Date().toISOString()
      };

      // If status is being changed to 'contacted', set contacted_at
      if (editData.status === 'contacted' && leads.find(l => l.id === leadId)?.status !== 'contacted') {
        updateData.contacted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('discount_leads')
        .update(updateData)
        .eq('id', leadId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update lead",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Lead updated successfully"
      });

      setEditingLead(null);
      setEditData({});
      fetchLeads();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setEditingLead(null);
    setEditData({});
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      not_interested: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTripTypeDisplay = (tripType: string | null) => {
    if (!tripType) return 'N/A';
    const typeMap = {
      'round_trip': 'Round Trip',
      'oneway_trip': 'One Way',
      'local': 'Local',
      'airport': 'Airport'
    };
    return typeMap[tripType as keyof typeof typeMap] || tripType;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discount Leads Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Discount Leads Management
        </CardTitle>
        <CardDescription>
          Manage and track leads from discount coupon requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              type="text"
              placeholder="Search by mobile"
              value={filters.mobileNumber}
              onChange={(e) => setFilters({ ...filters, mobileNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="not_interested">Not Interested</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tripType">Trip Type</Label>
            <Select value={filters.tripType} onValueChange={(value) => setFilters({ ...filters, tripType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="round_trip">Round Trip</SelectItem>
                <SelectItem value="oneway_trip">One Way</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="airport">Airport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-5 flex gap-2">
            <Button onClick={applyFilters} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Apply Filters
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredLeads.length} of {leads.length} leads
        </div>

        {/* Leads Table */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mobile</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Trip Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No leads found matching the current filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.mobile_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        {lead.vehicle?.name || lead.vehicle_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{getTripTypeDisplay(lead.trip_type)}</div>
                        {lead.pickup_city && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {lead.pickup_city.name}
                            {lead.destination_city && ` → ${lead.destination_city.name}`}
                          </div>
                        )}
                        {lead.pickup_date && (
                          <div className="text-xs text-muted-foreground">
                            {new Date(lead.pickup_date).toLocaleDateString()}
                            {lead.return_date && ` - ${new Date(lead.return_date).toLocaleDateString()}`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {editingLead === lead.id ? (
                        <Select
                          value={editData.status}
                          onValueChange={(value) => setEditData({ ...editData, status: value as any })}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                            <SelectItem value="not_interested">Not Interested</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(lead.status)
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(lead.created_at)}</TableCell>
                    <TableCell>
                      {editingLead === lead.id ? (
                        <Textarea
                          value={editData.notes || ''}
                          onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                          placeholder="Add notes..."
                          className="min-h-[60px] w-40"
                        />
                      ) : (
                        <div className="max-w-40 truncate text-sm text-muted-foreground">
                          {lead.notes || 'No notes'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {editingLead === lead.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSave(lead.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Save className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancel}
                              className="h-8 w-8 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`tel:+91${lead.mobile_number}`, '_self')}
                              className="h-8 w-8 p-0"
                            >
                              <Phone className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
