
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { RoundTripSection } from './booking/RoundTripSection';
import { OneWaySection } from './booking/OneWaySection';
import { LocalSection } from './booking/LocalSection';
import { AirportTransferSection } from './booking/AirportTransferSection';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const BookingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('round');
  const [airportSection, setAirportSection] = useState<'going-to' | 'coming-from'>('going-to');
  
  const [roundData, setRoundData] = useState({
    pickupCity: '',
    destinationCity: '',
    additionalCity: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: ''
  });
  
  const [onewayData, setOnewayData] = useState({
    pickupCity: '',
    destination: '',
    pickupDate: '',
    pickupTime: ''
  });
  
  const [localData, setLocalData] = useState({
    pickupCity: '',
    package: '',
    pickupDate: '',
    pickupTime: ''
  });
  
  const [airportData, setAirportData] = useState({
    pickupCity: '',
    airportName: '',
    pickupDate: '',
    pickupTime: ''
  });
  
  const tabs = [
    { id: 'round', label: 'ROUND' },
    { id: 'oneway', label: 'ONEWAY' },
    { id: 'local', label: 'LOCAL' },
    { id: 'airport', label: 'AIRPORT TRANSFER' },
  ];

  const handleSearch = () => {
    let searchParams = new URLSearchParams();
    
    // Always add trip type
    searchParams.append('tripType', activeTab);
    
    if (activeTab === 'round') {
      if (!roundData.pickupCity || !roundData.destinationCity || !roundData.pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, destination city, and pickup date",
          variant: "destructive"
        });
        return;
      }
      
      searchParams.append('pickupCity', roundData.pickupCity);
      searchParams.append('destinationCity', roundData.destinationCity);
      searchParams.append('pickupDate', roundData.pickupDate);
      if (roundData.pickupTime) {
        searchParams.append('pickupTime', roundData.pickupTime);
      }
      if (roundData.returnDate) {
        searchParams.append('returnDate', roundData.returnDate);
      }
      if (roundData.additionalCity) {
        searchParams.append('additionalCity', roundData.additionalCity);
      }
    } else if (activeTab === 'oneway') {
      if (!onewayData.pickupCity || !onewayData.destination || !onewayData.pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, destination, and pickup date",
          variant: "destructive"
        });
        return;
      }
      
      searchParams.append('pickupCity', onewayData.pickupCity);
      searchParams.append('destinationCity', onewayData.destination);
      searchParams.append('pickupDate', onewayData.pickupDate);
      if (onewayData.pickupTime) {
        searchParams.append('pickupTime', onewayData.pickupTime);
      }
    } else if (activeTab === 'local') {
      if (!localData.pickupCity || !localData.package || !localData.pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, package, and pickup date",
          variant: "destructive"
        });
        return;
      }
      
      searchParams.append('pickupCity', localData.pickupCity);
      searchParams.append('package', localData.package);
      searchParams.append('pickupDate', localData.pickupDate);
      if (localData.pickupTime) {
        searchParams.append('pickupTime', localData.pickupTime);
      }
    } else if (activeTab === 'airport') {
      if (!airportData.pickupCity || !airportData.airportName || !airportData.pickupDate) {
        toast({
          title: "Missing Information",
          description: "Please fill in pickup city, airport name, and pickup date",
          variant: "destructive"
        });
        return;
      }
      
      searchParams.append('pickupCity', airportData.pickupCity);
      searchParams.append('airportName', airportData.airportName);
      searchParams.append('pickupDate', airportData.pickupDate);
      searchParams.append('transferType', airportSection);
      if (airportData.pickupTime) {
        searchParams.append('pickupTime', airportData.pickupTime);
      }
    }
    
    navigate(`/vehicles?${searchParams.toString()}`);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'round':
        return <RoundTripSection data={roundData} onChange={setRoundData} />;
      case 'oneway':
        return <OneWaySection data={onewayData} onChange={setOnewayData} />;
      case 'local':
        return <LocalSection data={localData} onChange={setLocalData} />;
      case 'airport':
        return (
          <AirportTransferSection
            data={airportData}
            onChange={setAirportData}
            airportSection={airportSection}
            onSectionChange={setAirportSection}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-large">
      <div className="p-6 space-y-6">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'bg-white/20 text-foreground hover:bg-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Section */}
        {renderActiveSection()}

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full bg-gradient-accent text-accent-foreground hover:shadow-glow transition-all duration-300 py-3 text-lg font-semibold">
          <Search className="w-5 h-5 mr-2" />
          SEARCH CABS
        </Button>
      </div>
    </Card>
  );
};

export default BookingForm;
