
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Star, Shield, Clock, Users, Phone, MapPin, CheckCircle, Car, Headphones, Award, Navigation as NavIcon } from 'lucide-react';
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

// ── Animation Wrappers ──

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

const StaggerContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
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

// ── Counter Animation Hook ──
const useCounter = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);
  return { count, ref };
};

// ── Data ──

const services = [
  { image: outstationImg, title: 'Outstation Travel', description: 'Comfortable and reliable outstation travel with professional drivers.', features: ['Professional drivers', 'Premium vehicles', 'Flexible locations', 'Transparent pricing'] },
  { image: localImg, title: 'Local Travel', description: 'Convenient local transportation for city rides and daily commutes.', features: ['Hourly packages', 'Quick pickup', 'Local expertise', 'Competitive pricing'] },
  { image: airportImg, title: 'Airport Transfer', description: 'Hassle-free airport transfers with punctual pickup and drop services.', features: ['Flight tracking', 'Meet & greet', 'Luggage assistance', '24/7 availability'] },
  { image: outstationImg, title: 'One-way Travel', description: 'Economical one-way cab service for single journey needs.', features: ['No return charges', 'Point-to-point', 'Cost-effective', 'Same day booking'] }
];

const whyFeatures = [
  { icon: Clock, title: '24/7 Availability', description: 'Round-the-clock service for all your travel needs.' },
  { icon: Shield, title: 'Safe & Secure', description: 'Verified drivers, GPS tracking, and insurance.' },
  { icon: Users, title: 'Professional Drivers', description: 'Experienced, courteous drivers with local knowledge.' },
  { icon: Star, title: 'Premium Vehicles', description: 'Well-maintained, comfortable vehicles.' },
  { icon: Phone, title: 'Customer Support', description: 'Dedicated support team available 24/7.' },
  { icon: MapPin, title: 'Wide Coverage', description: 'Extensive network covering major cities.' },
];

const steps = [
  { icon: NavIcon, title: 'Choose Route', description: 'Select your pickup and drop location' },
  { icon: Car, title: 'Select Vehicle', description: 'Pick from our premium fleet' },
  { icon: CheckCircle, title: 'Confirm Booking', description: 'Easy booking with instant confirmation' },
  { icon: Headphones, title: '24/7 Support', description: 'We assist you throughout the journey' },
];

const testimonials = [
  { name: 'Rahul Sharma', city: 'Delhi', text: 'Amazing service! The driver was professional and the car was spotless. Will definitely book again.', rating: 5 },
  { name: 'Priya Patel', city: 'Mumbai', text: 'Best cab service for outstation trips. Very reasonable pricing and excellent customer support.', rating: 5 },
  { name: 'Amit Kumar', city: 'Bangalore', text: 'Used Raman Cab for our family trip. Comfortable ride and the driver knew all the best routes.', rating: 4 },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Happy Customers' },
  { value: 200, suffix: '+', label: 'Cities Covered' },
  { value: 500, suffix: '+', label: 'Premium Vehicles' },
  { value: 99, suffix: '%', label: 'Satisfaction Rate' },
];

// ── Special Offer Badge ──
const SpecialOfferBadge = () => (
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
    className="absolute top-20 left-4 sm:top-24 sm:left-8 z-20"
  >
    <motion.div
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      className="relative"
    >
      {/* Starburst SVG */}
      <svg width="110" height="110" viewBox="0 0 120 120" className="drop-shadow-lg">
        <polygon
          points="60,2 69,38 105,20 82,50 118,60 82,70 105,100 69,82 60,118 51,82 15,100 38,70 2,60 38,50 15,20 51,38"
          fill="hsl(0, 80%, 50%)"
          stroke="hsl(0, 80%, 40%)"
          strokeWidth="1"
        />
        <text x="60" y="52" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" fontFamily="sans-serif">SPECIAL</text>
        <text x="60" y="68" textAnchor="middle" fill="white" fontWeight="bold" fontSize="13" fontFamily="sans-serif">OFFER</text>
        <text x="60" y="82" textAnchor="middle" fill="hsl(45, 93%, 58%)" fontWeight="bold" fontSize="9" fontFamily="sans-serif">Chardham Yatra</text>
      </svg>
    </motion.div>
  </motion.div>
);

// ── Parallax Hero ──
const AnimatedHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})`, y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-secondary/70" />
      </motion.div>

      <SpecialOfferBadge />

      <motion.div style={{ y: textY, opacity }} className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-tight"
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
            className="text-base sm:text-xl md:text-2xl mb-6 md:mb-8 opacity-90 leading-relaxed px-2"
          >
            Experience comfortable, safe, and reliable transportation with professional drivers
            and well-maintained vehicles for all your travel needs.
          </motion.p>
        </div>

        {/* Booking form - improved mobile */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-4xl mx-auto px-0 sm:px-2"
        >
          <BookingForm />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
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

// ── Animated Services ──
const AnimatedServices = () => (
  <section className="py-16 md:py-20 bg-background overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From local city rides to long-distance journeys, we provide comprehensive transportation solutions.
          </p>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {services.map((service, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -12, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card className="group h-full bg-gradient-card hover:shadow-large transition-all duration-500 border-border/50 overflow-hidden">
                <div className="relative overflow-hidden">
                  <motion.img src={service.image} alt={service.title} className="w-full h-48 object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-3 group-hover:text-primary-glow transition-colors">{service.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2 mb-5">
                    {service.features.map((feature, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center text-sm text-foreground">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-3 flex-shrink-0" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
                    Book Now <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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

// ── How It Works ──
const HowItWorks = () => (
  <section className="py-16 md:py-20 bg-muted/50 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">How It Works</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Book your ride in 4 simple steps</p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />

        {steps.map((step, index) => (
          <FadeUp key={index} delay={index * 0.15}>
            <motion.div whileHover={{ y: -8 }} className="relative text-center">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-hero rounded-full mb-6 relative z-10 shadow-glow"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <step.icon className="w-7 h-7 md:w-9 md:h-9 text-white" />
              </motion.div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold text-sm z-20">
                {index + 1}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{step.title}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

// ── Stats Counter Section ──
const StatsCounter = () => (
  <section className="py-16 md:py-20 bg-gradient-hero text-white overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const { count, ref } = useCounter(stat.value);
          return (
            <FadeUp key={index} delay={index * 0.1}>
              <div ref={ref} className="text-center">
                <motion.div
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 }}
                >
                  {count.toLocaleString()}{stat.suffix}
                </motion.div>
                <p className="text-sm sm:text-base opacity-80">{stat.label}</p>
              </div>
            </FadeUp>
          );
        })}
      </div>
    </div>
  </section>
);

// ── Why Choose Us ──
const AnimatedWhyChooseUs = () => (
  <section className="py-16 md:py-20 bg-gradient-to-br from-muted to-background overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Why Choose Raman Cab?</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Experience the difference with our premium cab services.</p>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {whyFeatures.map((feature, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -8, rotateY: 5 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Card className="group bg-card hover:shadow-large transition-all duration-500 border-border/50">
                <CardContent className="p-6 md:p-8 text-center">
                  <motion.div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-hero rounded-full mb-5 md:mb-6" whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                    <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4 group-hover:text-primary-glow transition-colors">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

// ── Testimonials ──
const TestimonialsSection = () => (
  <section className="py-16 md:py-20 bg-background overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">What Our Customers Say</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Trusted by thousands of happy travelers across India</p>
        </div>
      </FadeUp>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((t, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 200 }}>
              <Card className="h-full border-border/50 hover:shadow-large transition-all duration-500">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-white font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

// ── Popular Routes ──
const PopularRoutes = () => {
  const routes = [
    { from: 'Delhi', to: 'Agra', img: outstationImg },
    { from: 'Mumbai', to: 'Pune', img: localImg },
    { from: 'Bangalore', to: 'Mysore', img: airportImg },
    { from: 'Delhi', to: 'Jaipur', img: outstationImg },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Popular Routes</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">Most booked routes by our travelers</p>
          </div>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, index) => (
            <StaggerItem key={index}>
              <motion.div whileHover={{ y: -10, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Card className="overflow-hidden group cursor-pointer border-border/50 hover:shadow-large transition-all duration-500">
                  <div className="relative h-40 overflow-hidden">
                    <motion.img src={route.img} alt={`${route.from} to ${route.to}`} className="w-full h-full object-cover" whileHover={{ scale: 1.15 }} transition={{ duration: 0.6 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-bold text-lg">{route.from} → {route.to}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Book Now <ArrowRight className="w-3 h-3 ml-1" />
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
};

// ── CTA with Support ──
const AnimatedCTA = () => (
  <section className="py-16 md:py-20 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <motion.div
          className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-center text-white shadow-large overflow-hidden relative"
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
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Travel?</h3>
            </ScaleUp>
            <FadeUp delay={0.2}>
              <p className="text-base sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Book your cab now and experience the comfort and reliability of Raman Cab services.
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
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-lg font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call: +91 7497974808
              </motion.a>
              <motion.a
                href="https://wa.me/917497974808"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-green-500 text-white rounded-lg font-semibold transition-all duration-300"
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

// ── Award Banner ──
const AwardBanner = () => (
  <section className="py-12 md:py-16 bg-accent/10 overflow-hidden">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FadeUp>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-center md:text-left">
          <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring' }}>
            <Award className="w-16 h-16 md:w-20 md:h-20 text-accent mx-auto md:mx-0" />
          </motion.div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">Rated #1 Cab Service</h3>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl">Trusted by 50,000+ travelers. Consistently rated for punctuality, safety, and customer care.</p>
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
);

// ── Main Page ──
const HomePageTesting = () => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <div className="pt-16">
      <AnimatedHero />
      <AnimatedServices />
      <HowItWorks />
      <StatsCounter />
      <AnimatedWhyChooseUs />
      <PopularRoutes />
      <TestimonialsSection />
      <AwardBanner />
      <AnimatedCTA />
    </div>
    <Footer />
    <FloatingActions />
  </div>
);

export default HomePageTesting;
