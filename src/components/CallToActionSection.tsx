
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CallToActionSection = () => {
  return (
    <section className="py-20 bg-gradient-hero text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Travel?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Book your cab now and experience the comfort and reliability of Raman Cab services. 
          Available 24/7 for all your transportation needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-primary hover:shadow-glow transition-all duration-300 hover:scale-105">
            Book Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button size="lg" className="bg-white/20 border border-white text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm">
            Call +91 7497974808
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
