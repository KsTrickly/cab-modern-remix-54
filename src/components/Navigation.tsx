
import { useState } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">RAMAN CAB</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Rental Car</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors font-medium">
              Services
            </a>
            <Link to="/ayodhya" className="text-foreground hover:text-primary transition-colors font-medium">
              Ayodhya
            </Link>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              Contact
            </a>
            <Button className="bg-gradient-hero text-white shadow-glow hover:shadow-large transition-all duration-300">
              <Phone className="w-4 h-4 mr-2" />
              +91 7497974808
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-large">
            <div className="px-4 py-6 space-y-4">
              <a href="#services" className="block text-foreground hover:text-primary transition-colors font-medium">
                Services
              </a>
              <Link to="/ayodhya" className="block text-foreground hover:text-primary transition-colors font-medium">
                Ayodhya
              </Link>
              <a href="#about" className="block text-foreground hover:text-primary transition-colors font-medium">
                About
              </a>
              <a href="#contact" className="block text-foreground hover:text-primary transition-colors font-medium">
                Contact
              </a>
              <Button className="w-full bg-gradient-hero text-white shadow-glow">
                <Phone className="w-4 h-4 mr-2" />
                +91 7497974808
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
