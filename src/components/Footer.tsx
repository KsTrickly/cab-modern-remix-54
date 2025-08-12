
import { Link } from 'react-router-dom';

const Footer = () => {
  const cityServices = [
    { name: 'Delhi', path: '/cities/delhi.html' },
    { name: 'Indore', path: '/cities/indore.html' },
    { name: 'Goa', path: '/cities/goa.html' },
    { name: 'Dwarka', path: '/cities/dwarka.html' },
    { name: 'Dalhousie', path: '/cities/dalhousie.html' },
    { name: 'Coimbatore', path: '/cities/coimbatore.html' },
    { name: 'Bhubaneshwar', path: '/cities/bhubaneshwar' },
    { name: 'Chitrakoot', path: '/cities/chitrakoot' },
    { name: 'Rameshwaram', path: '/cities/rameshwaram' },
    { name: 'Ooty', path: '/cities/ooty' },
    { name: 'Mysore', path: '/cities/mysore' },
    { name: 'Bangalore', path: '/cities/bangalore' },
    { name: 'Hyderabad', path: '/cities/hyderabad' },
    { name: 'Ayodhya', path: '/ayodhya' },
    { name: 'Prayagraj', path: '/cities/prayagraj' },
    { name: 'Varanasi', path: '/cities/varanasi' },
    { name: 'Omkareshwar', path: '/cities/omkareshwar' },
    { name: 'Manali', path: '/cities/manali' },
    { name: 'Mussoorie', path: '/cities/mussoorie' },
    { name: 'Nainital', path: '/cities/nainital' },
    { name: 'Nasik', path: '/cities/nasik' },
    { name: 'Rishikesh', path: '/cities/rishikesh' },
    { name: 'Shimla', path: '/cities/shimla' },
    { name: 'Tirupati', path: '/cities/tirupati' }
  ];

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-xl">R</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">RAMAN CAB</h3>
                <p className="text-sm opacity-70 uppercase tracking-wider">Rental Car</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Your trusted partner for safe, comfortable, and reliable transportation 
              services across India. Available 24/7 for all your travel needs.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="opacity-80 hover:opacity-100 transition-opacity">Our Services</a></li>
              <li><a href="#about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact</a></li>
              <li><Link to="/vehicles" className="opacity-80 hover:opacity-100 transition-opacity">Vehicle List</Link></li>
            </ul>
            
            <h5 className="text-md font-semibold mt-6 mb-3">Legal</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms-conditions" className="opacity-80 hover:opacity-100 transition-opacity">Terms & Conditions</Link></li>
              <li><Link to="/contact-us" className="opacity-80 hover:opacity-100 transition-opacity">Contact Us</Link></li>
              <li><Link to="/refund-cancellation" className="opacity-80 hover:opacity-100 transition-opacity">Refund & Cancellation</Link></li>
              <li><Link to="/privacy-policy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
              <li><Link to="/about-us" className="opacity-80 hover:opacity-100 transition-opacity">About Us</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-semibold mb-4">Cab Services In Popular Cities</h4>
            <div className="flex flex-wrap gap-2">
              {cityServices.map((city, index) => (
                <Link 
                  key={index} 
                  to={city.path} 
                  className="opacity-80 hover:opacity-100 transition-opacity text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"
                >
                  {city.name}
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <h5 className="text-md font-semibold mb-3">Contact Info</h5>
              <div className="space-y-2 text-sm">
                <p className="opacity-90">📞 +91 7497974808</p>
                <p className="opacity-90">✉️ info@ramancab.com</p>
                <p className="opacity-90">📍 India</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-70">
          <p>&copy; 2024 Raman Cab. All rights reserved. | Designed for modern travel experiences.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
