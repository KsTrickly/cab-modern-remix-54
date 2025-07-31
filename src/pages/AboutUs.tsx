import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import FloatingActions from '@/components/FloatingActions';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">About Raman Cab</h1>
          <div className="prose max-w-none">
            <p className="text-lg mb-4">
              Welcome to Raman Cab, your trusted partner for reliable and comfortable transportation services.
            </p>
            <p>
              At Raman Cab, we are dedicated to providing top-notch cab rental services that cater to all your travel needs. Whether you're planning a local city tour, an outstation adventure, or need a reliable airport transfer, we've got you covered.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p>
              Our mission is to make transportation easy, accessible, and enjoyable for everyone. We strive to offer the best customer experience through our well-maintained fleet, professional drivers, and user-friendly booking process.
            </p>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
            <ul>
              <li><strong>Reliability:</strong> We ensure timely pickups and drop-offs, so you never have to worry about being late.</li>
              <li><strong>Comfort:</strong> Our vehicles are clean, comfortable, and equipped with modern amenities to make your ride enjoyable.</li>
              <li><strong>Safety:</strong> Your safety is our top priority. Our drivers are experienced and trained to provide a safe and secure journey.</li>
              <li><strong>Affordability:</strong> We offer competitive pricing and transparent billing, with no hidden charges.</li>
              <li><strong>24/7 Support:</strong> Our customer support team is available around the clock to assist you with any queries or concerns.</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Services</h2>
            <ul>
              <li><strong>Local City Tours:</strong> Explore your city with our customizable local tour packages.</li>
              <li><strong>Outstation Trips:</strong> Plan your weekend getaways or long trips with our reliable outstation services.</li>
              <li><strong>Airport Transfers:</strong> Enjoy hassle-free airport pickups and drop-offs with our punctual airport transfer services.</li>
              <li><strong>Corporate Travel:</strong> We offer tailored corporate travel solutions to meet your business needs.</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              Have any questions or need assistance? Feel free to reach out to us:
            </p>
            <ul>
              <li><strong>Phone:</strong> +91 7497974808</li>
              <li><strong>Email:</strong> support@ramancab.com</li>
            </ul>
            <p>
              Thank you for choosing Raman Cab. We look forward to serving you!
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default AboutUs;
