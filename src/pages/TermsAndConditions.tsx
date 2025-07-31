
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground text-lg">
                Please read these terms and conditions carefully before using our services
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>1. Service Agreement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>By booking our cab services, you agree to these terms and conditions. Raman Cab provides transportation services across various cities in India.</p>
                  <p>Our services include local trips, outstation journeys, airport transfers, and special occasion transportation.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>2. Booking and Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Bookings can be made through phone, WhatsApp, or our online platform. A booking confirmation will be sent via SMS or WhatsApp.</p>
                  <p>Payment can be made in cash, UPI, or bank transfer. For outstation trips, advance payment may be required.</p>
                  <p>All prices are inclusive of driver allowance and basic toll charges unless specified otherwise.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>3. Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Free cancellation up to 2 hours before the scheduled pickup time for local trips.</p>
                  <p>For outstation trips, cancellation charges may apply based on the notice period:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>24+ hours before: No charges</li>
                    <li>12-24 hours before: 25% of trip cost</li>
                    <li>Less than 12 hours: 50% of trip cost</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>4. Vehicle and Driver Standards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>All vehicles are regularly maintained and serviced. Our drivers are licensed, experienced, and trained in customer service.</p>
                  <p>We reserve the right to substitute vehicles of similar or higher category if the originally booked vehicle is unavailable.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>5. Customer Responsibilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Customers must provide accurate pickup and drop locations, contact numbers, and travel requirements.</p>
                  <p>Any damage to the vehicle caused by passengers will be charged separately.</p>
                  <p>Smoking, consumption of alcohol, and carrying illegal substances in vehicles is strictly prohibited.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>6. Liability and Insurance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>All our vehicles are insured as per legal requirements. However, passengers are advised to have their own travel insurance.</p>
                  <p>Raman Cab is not liable for any personal belongings left in the vehicle after the trip completion.</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>7. Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>For any queries or support, contact us at:</p>
                  <p className="font-medium">Phone: +91 7497974808</p>
                  <p className="font-medium">Email: info@ramancab.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditions;
