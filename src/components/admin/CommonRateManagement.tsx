
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus, Filter, Search, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface City {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  name: string;
  model: string;
}

interface CommonRate {
  id: string;
  pickup_city_id: string;
  vehicle_id: string;
  daily_km_limit: number;
  per_km_charges: number;
  extra_per_km_charge: number;
  day_driver_allowance: number;
  night_charge: number;
  extra_per_hour_charge: number;
  base_fare: number;
  trip_type: string;
  is_active: boolean;
  pickup_city: City;
  vehicle: Vehicle;
}

interface RateFilters {
  pickupCity: string;
  vehicle: string;
}

export const CommonRateManagement = () => {
  const [rates, setRates] = useState<CommonRate[]>([]);
  const [filteredRates, setFilteredRates] = useState<CommonRate[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<CommonRate | null>(null);
  const [activeTab, setActiveTab] = useState('round_trip');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<RateFilters>({
    pickupCity: '',
    vehicle: ''
  });

  const [formData, setFormData] = useState({
    pickup_city_id: '',
    vehicle_id: '',
    daily_km_limit: '',
    per_km_charges: '',
    extra_per_km_charge: '',
    extra_per_hour_charge: '',
    day_driver_allowance: '',
    night_charge: '',
    base_fare: '',
    trip_type: 'round_trip'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchRates();
    fetchCities();
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [rates, filters, activeTab]);

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('common_rates')
        .select(`
          *,
          pickup_city:cities!pickup_city_id(id, name),
          vehicle:vehicles(id, name, model)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching common rates:', error);
        throw error;
      }
      
      setRates(data || []);
    } catch (error) {
      console.error('Error fetching rates:', error);
      toast({
        title: "Error",
        description: "Failed to fetch common rates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    const { data } = await supabase.from('cities').select('id, name').order('name');
    setCities(data || []);
  };

  const fetchVehicles = async () => {
    const { data } = await supabase.from('vehicles').select('id, name, model').order('name');
    setVehicles(data || []);
  };

  const applyFilters = () => {
    let filtered = rates.filter(rate => rate.trip_type === activeTab);

    if (filters.pickupCity) {
      filtered = filtered.filter(rate => 
        rate.pickup_city?.name.toLowerCase().includes(filters.pickupCity.toLowerCase())
      );
    }

    if (filters.vehicle) {
      filtered = filtered.filter(rate => 
        rate.vehicle?.name.toLowerCase().includes(filters.vehicle.toLowerCase()) ||
        rate.vehicle?.model.toLowerCase().includes(filters.vehicle.toLowerCase())
      );
    }

    setFilteredRates(filtered);
  };

  const resetFilters = () => {
    setFilters({
      pickupCity: '',
      vehicle: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pickup_city_id || !formData.vehicle_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const rateData = {
      pickup_city_id: formData.pickup_city_id,
      vehicle_id: formData.vehicle_id,
      daily_km_limit: parseFloat(formData.daily_km_limit),
      per_km_charges: parseFloat(formData.per_km_charges),
      extra_per_km_charge: parseFloat(formData.extra_per_km_charge),
      day_driver_allowance: parseFloat(formData.day_driver_allowance),
      night_charge: parseFloat(formData.night_charge),
      extra_per_hour_charge: parseFloat(formData.extra_per_hour_charge),
      base_fare: parseFloat(formData.base_fare),
      trip_type: formData.trip_type
    };

    console.log('Saving common rate data:', rateData);

    try {
      if (editingRate) {
        const { error } = await supabase
          .from('common_rates')
          .update(rateData)
          .eq('id', editingRate.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Common rate updated successfully" });
      } else {
        const { error } = await supabase
          .from('common_rates')
          .insert([rateData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Common rate added successfully" });
      }
      
      setIsDialogOpen(false);
      setEditingRate(null);
      resetForm();
      fetchRates();
    } catch (error) {
      console.error('Error saving common rate:', error);
      toast({
        title: "Error",
        description: `Failed to save common rate: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      pickup_city_id: '',
      vehicle_id: '',
      daily_km_limit: '',
      per_km_charges: '',
      extra_per_km_charge: '',
      extra_per_hour_charge: '',
      day_driver_allowance: '',
      night_charge: '',
      base_fare: '',
      trip_type: activeTab
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this common rate?')) return;
    
    try {
      const { error } = await supabase
        .from('common_rates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Common rate deleted successfully" });
      fetchRates();
    } catch (error) {
      console.error('Error deleting common rate:', error);
      toast({
        title: "Error",
        description: "Failed to delete common rate",
        variant: "destructive"
      });
    }
  };

  const openDialog = (rate?: CommonRate) => {
    if (rate) {
      setEditingRate(rate);
      setFormData({
        pickup_city_id: rate.pickup_city_id,
        vehicle_id: rate.vehicle_id,
        daily_km_limit: rate.daily_km_limit.toString(),
        per_km_charges: rate.per_km_charges.toString(),
        extra_per_km_charge: rate.extra_per_km_charge.toString(),
        extra_per_hour_charge: rate.extra_per_hour_charge.toString(),
        day_driver_allowance: rate.day_driver_allowance.toString(),
        night_charge: rate.night_charge.toString(),
        base_fare: rate.base_fare.toString(),
        trip_type: rate.trip_type
      });
    } else {
      setEditingRate(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading common rates...</div>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Common Rate Management</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Common Rate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRate ? 'Edit Common Rate' : 'Add New Common Rate'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Trip Type</Label>
                  <Select value={formData.trip_type} onValueChange={(value) => setFormData({ ...formData, trip_type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trip type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_way">One Way</SelectItem>
                      <SelectItem value="round_trip">Round Trip</SelectItem>
                      <SelectItem value="local">Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pickup City</Label>
                  <Select value={formData.pickup_city_id} onValueChange={(value) => setFormData({ ...formData, pickup_city_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select value={formData.vehicle_id} onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} - {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Daily KM Limit</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.daily_km_limit}
                    onChange={(e) => setFormData({ ...formData, daily_km_limit: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Per KM Charges (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.per_km_charges}
                    onChange={(e) => setFormData({ ...formData, per_km_charges: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Extra Per KM Charge (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.extra_per_km_charge}
                    onChange={(e) => setFormData({ ...formData, extra_per_km_charge: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Extra Per Hour Charge (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.extra_per_hour_charge}
                    onChange={(e) => setFormData({ ...formData, extra_per_hour_charge: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Day Driver Allowance (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.day_driver_allowance}
                    onChange={(e) => setFormData({ ...formData, day_driver_allowance: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Night Charge (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.night_charge}
                    onChange={(e) => setFormData({ ...formData, night_charge: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Base Fare (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.base_fare}
                    onChange={(e) => setFormData({ ...formData, base_fare: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2 col-span-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRate ? 'Update' : 'Add'} Common Rate
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showFilters && (
        <div className="bg-teal-500 text-white p-4 mb-4 rounded-lg">
          <h3 className="font-semibold mb-4">Filter Common Rates for {activeTab.replace('_', ' ').toUpperCase()}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white text-sm">Pickup City:</Label>
              <Input
                value={filters.pickupCity}
                onChange={(e) => setFilters({...filters, pickupCity: e.target.value})}
                className="bg-white text-black"
                placeholder="Enter pickup city"
              />
            </div>
            <div>
              <Label className="text-white text-sm">Vehicle:</Label>
              <Input
                value={filters.vehicle}
                onChange={(e) => setFilters({...filters, vehicle: e.target.value})}
                className="bg-white text-black"
                placeholder="Enter vehicle name or model"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4">
            <Button onClick={applyFilters} className="bg-green-600 hover:bg-green-700">
              <Search className="w-4 h-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="outline" className="text-white border-white hover:bg-white hover:text-teal-500">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="round_trip">Round Trip</TabsTrigger>
          <TabsTrigger value="one_way">One Way</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
        </TabsList>

        {['round_trip', 'one_way', 'local'].map((tripType) => (
          <TabsContent key={tripType} value={tripType}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {tripType.replace('_', ' ').toUpperCase()} Common Rates
              </h3>
              <div className="text-sm text-muted-foreground">
                Showing {filteredRates.length} of {rates.filter(r => r.trip_type === tripType).length} rates
              </div>
            </div>
            <div className="grid gap-4">
              {filteredRates.map((rate) => (
                <div key={rate.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">City - Vehicle</h4>
                        <p className="font-medium">{rate.pickup_city.name} - {rate.vehicle.name}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Per KM Rate</h4>
                        <p className="font-medium">₹{rate.per_km_charges}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Daily Limit</h4>
                        <p className="font-medium">{rate.daily_km_limit} km</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground">Base Fare</h4>
                        <p className="font-medium">₹{rate.base_fare}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => openDialog(rate)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(rate.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t text-sm">
                    <div>Extra KM: ₹{rate.extra_per_km_charge}/km</div>
                    <div>Extra Hour: ₹{rate.extra_per_hour_charge}/hr</div>
                    <div>Driver: ₹{rate.day_driver_allowance}/day</div>
                    <div>Night: ₹{rate.night_charge}/night</div>
                  </div>
                </div>
              ))}
              {filteredRates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No {tripType.replace('_', ' ')} common rates found matching the current filters.
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};
