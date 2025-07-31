import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

const Ayodhya = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchParams] = useSearchParams();
  const pickupCity = searchParams.get('pickupCity');

  useEffect(() => {
    // Mock data for Ayodhya packages
    const mockPackages: Package[] = [
      {
        id: 1,
        name: 'Ayodhya Darshan',
        description: 'A one-day trip covering the major temples in Ayodhya.',
        price: 2500,
        duration: '1 Day',
      },
      {
        id: 2,
        name: 'Ayodhya and Prayagraj',
        description: 'A two-day trip covering Ayodhya and Prayagraj.',
        price: 5000,
        duration: '2 Days',
      },
      {
        id: 3,
        name: 'Spiritual Ayodhya',
        description: 'A three-day spiritual journey in Ayodhya.',
        price: 7500,
        duration: '3 Days',
      },
    ];
    setPackages(mockPackages);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-hero text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Explore Ayodhya with Raman Cab</h1>
            <p className="text-lg mb-8">
              Discover the holy city of Ayodhya with our comfortable and reliable cab services.
            </p>
            {pickupCity && (
              <p className="text-md">
                Selected Pickup City: {pickupCity}
              </p>
            )}
            {/* Add a search component or button here */}
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-12">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Ayodhya Tour Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-700 mb-4">{pkg.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">₹{pkg.price}</span>
                    <span className="text-gray-600">{pkg.duration}</span>
                  </div>
                  {/* Add a booking button or link here */}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Ayodhya Section */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">About Ayodhya</h2>
            <div className="prose max-w-none">
              <p>
                Ayodhya, the birthplace of Lord Rama, is a city of great historical and religious
                significance. Located in Uttar Pradesh, India, it attracts pilgrims and tourists
                from all over the world.
              </p>
              <p>
                Explore the ancient temples, ghats, and historical sites that make Ayodhya a unique
                and spiritual destination.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Ayodhya;
