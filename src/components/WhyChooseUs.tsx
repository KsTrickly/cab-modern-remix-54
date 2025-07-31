import { Shield, Clock, Users, Star, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock service for all your travel needs, anytime, anywhere.',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified drivers, GPS tracking, and comprehensive insurance for your safety.',
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Experienced, courteous drivers with local knowledge and excellent service.',
    },
    {
      icon: Star,
      title: 'Premium Vehicles',
      description: 'Well-maintained, comfortable vehicles for a luxurious travel experience.',
    },
    {
      icon: Phone,
      title: 'Customer Support',
      description: 'Dedicated support team ready to assist you throughout your journey.',
    },
    {
      icon: MapPin,
      title: 'Wide Coverage',
      description: 'Extensive service network covering major cities and tourist destinations.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Why Choose Raman Cab?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our premium cab services. We're committed to providing 
            safe, reliable, and comfortable transportation solutions for all your travel needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group bg-card hover:shadow-large transition-all duration-500 hover:-translate-y-2 border-border/50"
            >
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-full mb-6 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-primary-glow transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Support Highlight */}
        <div className="mt-16 bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white shadow-large">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Need Immediate Assistance?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Our dedicated customer support team is available 24/7 to help you with bookings, 
              queries, and any travel assistance you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:+917497974808"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +91 7497974808
              </a>
              <a 
                href="https://wa.me/917497974808"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;