
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

const Dalhousie = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Dalhousie</h1>
          <p>Welcome to Dalhousie city page!</p>
        </div>
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Dalhousie;
