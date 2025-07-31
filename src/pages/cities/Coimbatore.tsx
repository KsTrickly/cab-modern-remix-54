
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';
import React from 'react';

const Coimbatore = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        {/* Your page content goes here */}
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Coimbatore</h1>
          <p>Welcome to Coimbatore city page!</p>
        </div>
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Coimbatore;
