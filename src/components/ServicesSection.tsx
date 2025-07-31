
import ServiceCard from '@/components/ServiceCard';
import outstationImg from '@/assets/outstation.jpg';
import localImg from '@/assets/local.jpg';
import airportImg from '@/assets/airport.jpg';

const services = [
  {
    image: outstationImg,
    title: 'Outstation Travel',
    description: 'Comfortable and reliable outstation travel with professional drivers. Perfect for business trips, family vacations, and long-distance journeys with flexible booking options.',
    features: [
      'Professional drivers with local knowledge',
      'Well-maintained premium vehicles',
      'Flexible pickup and drop locations',
      'Transparent pricing with no hidden costs'
    ]
  },
  {
    image: localImg,
    title: 'Local Travel',
    description: 'Convenient local transportation for city rides, shopping trips, and daily commutes. Affordable hourly packages designed to meet your urban mobility needs.',
    features: [
      'Hourly and daily packages available',
      'Quick response and pickup times',
      'Local area expertise',
      'Competitive pricing for city rides'
    ]
  },
  {
    image: airportImg,
    title: 'Airport Transfer',
    description: 'Hassle-free airport transfers with punctual pickup and drop services. Never miss a flight with our reliable and comfortable airport transportation.',
    features: [
      'Flight tracking for timely pickups',
      'Meet and greet service',
      'Luggage assistance included',
      '24/7 airport transfer availability'
    ]
  },
  {
    image: outstationImg,
    title: 'One-way Travel',
    description: 'Economical one-way cab service for single journey needs. Perfect when you need transportation without return trip requirements.',
    features: [
      'No return journey charges',
      'Direct point-to-point service',
      'Cost-effective travel solution',
      'Same day and advance booking'
    ]
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Services
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From local city rides to long-distance journeys, we provide comprehensive 
            transportation solutions tailored to your specific needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              image={service.image}
              title={service.title}
              description={service.description}
              features={service.features}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
