
import { Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingActions = () => {
  const phoneNumber = "917497974808";
  
  const handleCall = () => {
    window.open(`tel:+${phoneNumber}`, '_self');
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${phoneNumber}?text=Hi, I would like to book a cab service.`, '_blank');
  };

  return (
    <>
      {/* Mobile View - One left, one right */}
      <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-between md:hidden">
        {/* WhatsApp Button - Left */}
        <Button
          onClick={handleWhatsApp}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Call Button - Right */}
        <Button
          onClick={handleCall}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          title="Call Now"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>

      {/* Desktop View - Both on right side */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-3">
        {/* WhatsApp Button */}
        <Button
          onClick={handleWhatsApp}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse hover:animate-none"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        
        {/* Call Button */}
        <Button
          onClick={handleCall}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          title="Call Now"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </>
  );
};

export default FloatingActions;
