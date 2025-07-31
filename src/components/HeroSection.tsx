
import { ArrowRight, Star } from 'lucide-react';
import BookingForm from '@/components/BookingForm';
import { HeroStats } from '@/components/HeroStats';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Premium Cab Services
            <span className="block text-accent">Across India</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Experience comfortable, safe, and reliable transportation with professional drivers 
            and well-maintained vehicles for all your travel needs.
          </p>
          
          {/* Special Offer Banner */}
          <div className="inline-flex items-center bg-accent text-accent-foreground px-6 py-3 rounded-full font-semibold mb-8 shadow-glow">
            <Star className="w-5 h-5 mr-2" />
            Special Chardham Yatra Packages Available
          </div>
        </div>

        {/* Booking Form */}
        <BookingForm />

        {/* Stats */}
        <HeroStats />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="w-6 h-6 text-white rotate-90" />
      </div>
    </section>
  );
};

export default HeroSection;
