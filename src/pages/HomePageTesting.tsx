
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Star, Shield, Clock, Users, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingForm from '@/components/BookingForm';
import { HeroStats } from '@/components/HeroStats';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import heroBg from '@/assets/hero-bg.jpg';
import outstationImg from '@/assets/outstation.jpg';
import localImg from '@/assets/local.jpg';
import airportImg from '@/assets/airport.jpg';

// Fade up on scroll
const FadeUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from left/right
const SlideIn = ({ children, direction = 'left', delay = 0 }: { children: React.ReactNode; direction?: 'left' | 'right'; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? -100 : 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Scale up
const ScaleUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100 }}
  >
    {children}
  </motion.div>
);

// Stagger container
const StaggerContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.15 } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const StaggerItem = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 40, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

const services = [
  {
    image: outstationImg,
    title: 'Outstation Travel',
    description: 'Comfortable and reliable outstation travel with professional drivers.',
    features: ['Professional drivers', 'Premium vehicles', 'Flexible locations', 'Transparent pricing']
  },
  {
    image: localImg,
    title: 'Local Travel',
    description: 'Convenient local transportation for city rides and daily commutes.',
    features: ['Hourly packages', 'Quick pickup', 'Local expertise', 'Competitive pricing']
  },
  {
    image: airportImg,
    title: 'Airport Transfer',
    description: 'Hassle-free airport transfers with punctual pickup and drop services.',
    features: ['Flight tracking', 'Meet & greet', 'Luggage assistance', '24/7 availability']
  },
  {
    image: outstationImg,
    title: 'One-way Travel',
    description: 'Economical one-way cab service for single journey needs.',
    features: ['No return charges', 'Point-to-point', 'Cost-effective', 'Same day booking']
  }
];

const whyFeatures = [
  { icon: Clock, title: '24/7 Availability', description: 'Round-the-clock service for all your travel needs.' },
  { icon: Shield, title: 'Safe & Secure', description: 'Verified drivers, GPS tracking, and insurance.' },
  { icon: Users, title: 'Professional Drivers', description: 'Experienced, courteous drivers with local knowledge.' },
  { icon: Star, title: 'Premium Vehicles', description: 'Well-maintained, comfortable vehicles.' },
  { icon: Phone, title: 'Customer Support', description: 'Dedicated support team available 24/7.' },
  { icon: MapPin, title: 'Wide Coverage', description: 'Extensive network covering major cities.' },
];

// Parallax Hero
const AnimatedHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})`, y: bgY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70" />
      </motion.div>

      <motion.div style={{ y: textY, opacity }} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Premium Cab Services
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block text-accent"
            >
              Across India
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed"
          >
            Experience comfortable, safe, and reliable transportation with professional drivers
            and well-maintained vehicles for all your travel needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7, type: 'spring' }}
            className="inline-flex items-center bg-accent text-accent-foreground px-6 py-3 rounded-full font-semibold mb-8 shadow-glow"
          >
            <Star className="w-5 h-5 mr-2" />
            Special Chardham Yatra Packages Available
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <BookingForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <HeroStats />
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <ArrowRight className="w-6 h-6 text-white rotate-90" />
      </motion.div>
    </section>
  );
};

// Animated Services
const AnimatedServices = () => (
  <section className="py-20 bg-background overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-primary mb-4"
            whileInView={{ backgroundPosition: ['0%', '100%'] }}
            transition={{ duration: 2 }}
          >
            Our Services
          </motion.h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From local city rides to long-distance journeys, we provide comprehensive
            transportation solutions tailored to your specific needs.
          </p>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -12, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="group h-full bg-gradient-card hover:shadow-large transition-all duration-500 border-border/50 overflow-hidden">
                <div className="relative overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-primary-glow transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center text-sm text-foreground"
                      >
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

// Animated Why Choose Us
const AnimatedWhyChooseUs = () => (
  <section className="py-20 bg-gradient-to-br from-muted to-background overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Why Choose Raman Cab?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our premium cab services.
          </p>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {whyFeatures.map((feature, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -8, rotateY: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Card className="group bg-card hover:shadow-large transition-all duration-500 border-border/50">
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-full mb-6"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-primary-glow transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeUp delay={0.3}>
        <motion.div
          className="mt-16 bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white shadow-large overflow-hidden relative"
          whileInView={{ opacity: [0.8, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-white/5 rounded-2xl"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{ width: '30%', skewX: '-15deg' }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <ScaleUp>
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Need Immediate Assistance?</h3>
            </ScaleUp>
            <FadeUp delay={0.2}>
              <p className="text-xl mb-8 opacity-90">
                Our dedicated customer support team is available 24/7.
              </p>
            </FadeUp>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href="tel:+917497974808"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now: +91 7497974808
              </motion.a>
              <motion.a
                href="https://wa.me/917497974808"
                className="inline-flex items-center justify-center px-8 py-4 bg-green-500 text-white rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34,197,94,0.4)' }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Support
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </FadeUp>
    </div>
  </section>
);

// Animated CTA
const AnimatedCTA = () => (
  <section className="py-20 bg-gradient-hero text-white overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <ScaleUp>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Travel?</h2>
      </ScaleUp>
      <FadeUp delay={0.2}>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Book your cab now and experience the comfort and reliability of Raman Cab services.
        </p>
      </FadeUp>
      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-white text-primary hover:shadow-glow transition-all duration-300">
            Book Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="bg-white/20 border border-white text-white hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm">
            Call +91 7497974808
          </Button>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const HomePageTesting = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16">
        <AnimatedHero />
        <AnimatedServices />
        <AnimatedWhyChooseUs />
        <AnimatedCTA />
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default HomePageTesting;
