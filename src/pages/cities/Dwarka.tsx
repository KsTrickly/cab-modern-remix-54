
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import React from 'react';

const Dwarka = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        <h1>Welcome to Dwarka</h1>
        <p>Explore the spiritual city of Dwarka with our reliable cab services.</p>
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Dwarka;
