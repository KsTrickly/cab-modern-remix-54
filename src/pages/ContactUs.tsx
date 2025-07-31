import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Our Information</h2>
              <p className="mb-2">
                <strong>Address:</strong> 123 Raman Street, Cabville, India
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> +91 7497974808
              </p>
              <p className="mb-2">
                <strong>Email:</strong> support@ramancab.com
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-blue-500 hover:underline">Facebook</a>
                <a href="#" className="text-blue-500 hover:underline">Twitter</a>
                <a href="#" className="text-blue-500 hover:underline">Instagram</a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                  <input type="text" id="name" className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary" placeholder="John Doe" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Your Email</label>
                  <input type="email" id="email" className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary" placeholder="john@example.com" />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" rows={4} className="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring focus:ring-primary focus:border-primary" placeholder="Write your message here..."></textarea>
                </div>
                <button type="submit" className="bg-gradient-hero text-white py-2 px-4 rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default ContactUs;
