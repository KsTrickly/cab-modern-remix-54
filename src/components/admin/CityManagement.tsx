
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface City {
  id: string;
  name: string;
  state_code: string;
  created_at: string;
}

export const CityManagement = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({ name: '', state_code: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCities(data || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch cities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCity) {
        const { error } = await supabase
          .from('cities')
          .update(formData)
          .eq('id', editingCity.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "City updated successfully" });
      } else {
        const { error } = await supabase
          .from('cities')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "City added successfully" });
      }
      
      setIsDialogOpen(false);
      setEditingCity(null);
      setFormData({ name: '', state_code: '' });
      fetchCities();
    } catch (error) {
      console.error('Error saving city:', error);
      toast({
        title: "Error",
        description: "Failed to save city",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this city?')) return;
    
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "City deleted successfully" });
      fetchCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast({
        title: "Error",
        description: "Failed to delete city",
        variant: "destructive"
      });
    }
  };

  const openDialog = (city?: City) => {
    if (city) {
      setEditingCity(city);
      setFormData({ name: city.name, state_code: city.state_code || '' });
    } else {
      setEditingCity(null);
      setFormData({ name: '', state_code: '' });
    }
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading cities...</div>;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">City Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add City
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCity ? 'Edit City' : 'Add New City'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">City Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state_code">State Code</Label>
                <Input
                  id="state_code"
                  value={formData.state_code}
                  onChange={(e) => setFormData({ ...formData, state_code: e.target.value })}
                  placeholder="e.g., DL, MH, KA"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCity ? 'Update' : 'Add'} City
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {cities.map((city) => (
          <div key={city.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-semibold">{city.name}</h3>
              <p className="text-sm text-muted-foreground">State: {city.state_code}</p>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={() => openDialog(city)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(city.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
