
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDashboard } from './AdminDashboard';
import { BookingManagement } from './BookingManagement';
import { VehicleManagement } from './VehicleManagement';
import { CityManagement } from './CityManagement';
import { RateManagement } from './RateManagement';
import { CommonRateManagement } from './CommonRateManagement';
import { LeadsManagement } from './LeadsManagement';

export const AdminContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
          <TabsTrigger value="rates">Rates</TabsTrigger>
          <TabsTrigger value="common-rates">Common Rates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <AdminDashboard />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingManagement />
        </TabsContent>
        
        <TabsContent value="leads" className="space-y-4">
          <LeadsManagement />
        </TabsContent>
        
        <TabsContent value="vehicles" className="space-y-4">
          <VehicleManagement />
        </TabsContent>
        
        <TabsContent value="cities" className="space-y-4">
          <CityManagement />
        </TabsContent>
        
        <TabsContent value="rates" className="space-y-4">
          <RateManagement />
        </TabsContent>
        
        <TabsContent value="common-rates" className="space-y-4">
          <CommonRateManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
