
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  model: string;
  seating_capacity: number;
  vehicle_type: string;
  image_url: string;
  is_active: boolean;
}

const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'luxury', label: 'Luxury' }
];

export const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    seating_capacity: '',
    vehicle_type: '',
    image_url: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const vehicleData = {
      ...formData,
      seating_capacity: parseInt(formData.seating_capacity)
    };

    try {
      if (editingVehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', editingVehicle.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Vehicle updated successfully" });
      } else {
        const { error } = await supabase
          .from('vehicles')
          .insert([vehicleData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Vehicle added successfully" });
      }
      
      setIsDialogOpen(false);
      setEditingVehicle(null);
      setFormData({ name: '', model: '', seating_capacity: '', vehicle_type: '', image_url: '' });
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to save vehicle",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Vehicle deleted successfully" });
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to delete vehicle",
        variant: "destructive"
      });
    }
  };

  const openDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setFormData({
        name: vehicle.name,
        model: vehicle.model || '',
        seating_capacity: vehicle.seating_capacity?.toString() || '',
        vehicle_type: vehicle.vehicle_type,
        image_url: vehicle.image_url || ''
      });
    } else {
      setEditingVehicle(null);
      setFormData({ name: '', model: '', seating_capacity: '', vehicle_type: '', image_url: '' });
    }
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading vehicles...</div>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vehicle Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vehicle Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seating_capacity">Seating Capacity</Label>
                <Input
                  id="seating_capacity"
                  type="number"
                  value={formData.seating_capacity}
                  onChange={(e) => setFormData({ ...formData, seating_capacity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select value={formData.vehicle_type} onValueChange={(value) => setFormData({ ...formData, vehicle_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVehicle ? 'Update' : 'Add'} Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <img 
                src={vehicle.image_url || '/placeholder.svg'} 
                alt={vehicle.name}
                className="w-16 h-12 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {vehicle.model} • {vehicle.seating_capacity} Seater • {vehicle.vehicle_type}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => openDialog(vehicle)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(vehicle.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
