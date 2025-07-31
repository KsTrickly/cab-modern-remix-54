
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import React from 'react';

const Delhi = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        <h1>Welcome to Delhi</h1>
        <p>Explore the vibrant capital of India with our reliable cab services.</p>
        {/* Add more content sections here */}
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Delhi;
