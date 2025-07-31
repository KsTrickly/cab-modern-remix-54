
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import CallToActionSection from '@/components/CallToActionSection';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <HeroSection />
        <ServicesSection />
        <WhyChooseUs />
        <CallToActionSection />
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Index;
