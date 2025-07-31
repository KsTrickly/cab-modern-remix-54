
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Car, Calendar, Calculator, TrendingUp, Users } from 'lucide-react';

interface DashboardStats {
  totalBookings: number;
  totalCities: number;
  totalVehicles: number;
  totalRates: number;
  pendingBookings: number;
  confirmedBookings: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalCities: 0,
    totalVehicles: 0,
    totalRates: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [bookingsResult, citiesResult, vehiclesResult, ratesResult] = await Promise.all([
        supabase.from('bookings').select('booking_status', { count: 'exact' }),
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        supabase.from('vehicles').select('*', { count: 'exact', head: true }),
        supabase.from('vehicle_rates').select('*', { count: 'exact', head: true }),
      ]);

      const bookings = bookingsResult.data || [];
      const pendingBookings = bookings.filter(b => b.booking_status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.booking_status === 'confirmed').length;

      setStats({
        totalBookings: bookingsResult.count || 0,
        totalCities: citiesResult.count || 0,
        totalVehicles: vehiclesResult.count || 0,
        totalRates: ratesResult.count || 0,
        pendingBookings,
        confirmedBookings,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Cities',
      value: stats.totalCities,
      icon: MapPin,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      icon: Car,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Rate Configurations',
      value: stats.totalRates,
      icon: Calculator,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Confirmed Bookings',
      value: stats.confirmedBookings,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Monitor your system's key metrics and performance indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${card.bgColor} flex items-center justify-center`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a 
              href="/admin#cities" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Manage Cities</div>
                <div className="text-sm text-muted-foreground">Add or edit city information</div>
              </div>
            </a>
            <a 
              href="/admin#vehicles" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Car className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Manage Vehicles</div>
                <div className="text-sm text-muted-foreground">Configure vehicle options</div>
              </div>
            </a>
            <a 
              href="/admin#bookings" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">View Bookings</div>
                <div className="text-sm text-muted-foreground">Monitor and manage bookings</div>
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-muted-foreground">System initialized successfully</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-muted-foreground">Dashboard loaded</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="text-muted-foreground">Data synchronized</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
