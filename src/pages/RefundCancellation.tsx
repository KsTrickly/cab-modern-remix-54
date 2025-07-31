
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RefundCancellation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Refund & Cancellation Policy
              </h1>
              <p className="text-muted-foreground text-lg">
                Our transparent refund and cancellation policies for your convenience
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-primary">Local Trips (Within City)</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Free cancellation up to 2 hours before pickup time</li>
                    <li>1-2 hours before pickup: 25% cancellation charges</li>
                    <li>Less than 1 hour or no-show: 50% cancellation charges</li>
                  </ul>

                  <h4 className="font-semibold text-primary mt-6">Outstation Trips</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>24+ hours before departure: Free cancellation</li>
                    <li>12-24 hours before: 25% of total booking amount</li>
                    <li>6-12 hours before: 50% of total booking amount</li>
                    <li>Less than 6 hours: 75% of total booking amount</li>
                    <li>No-show: 100% cancellation charges</li>
                  </ul>

                  <h4 className="font-semibold text-primary mt-6">Airport Transfers</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Free cancellation up to 3 hours before pickup</li>
                    <li>1-3 hours before: 30% cancellation charges</li>
                    <li>Less than 1 hour: 60% cancellation charges</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Refund Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Refunds will be processed according to our cancellation policy mentioned above.</p>
                  
                  <h4 className="font-semibold text-primary">Refund Process</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Refund requests must be made through phone or WhatsApp</li>
                    <li>Refunds will be processed within 5-7 business days</li>
                    <li>For cash payments, refunds will be made via bank transfer</li>
                    <li>For online payments, refunds will be credited to the original payment method</li>
                  </ul>

                  <h4 className="font-semibold text-primary mt-6">Full Refund Conditions</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Vehicle breakdown or unavailability from our side</li>
                    <li>Driver no-show without prior notification</li>
                    <li>Significant delay (more than 30 minutes) from our side</li>
                    <li>Cancellation due to natural calamities or government restrictions</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Modification Policy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Trip modifications are subject to availability and may incur additional charges.</p>
                  
                  <h4 className="font-semibold text-primary">Allowed Modifications</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Pickup time changes (subject to driver availability)</li>
                    <li>Pickup/drop location changes within the same city</li>
                    <li>Vehicle category upgrades (additional charges may apply)</li>
                    <li>Extension of trip duration (charged as per hourly rates)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact for Cancellations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>To cancel or modify your booking, contact us immediately:</p>
                  <div className="mt-4">
                    <p className="font-medium">Phone: +91 7497974808</p>
                    <p className="font-medium">WhatsApp: +91 7497974808</p>
                    <p className="font-medium">Email: info@ramancab.com</p>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Note: Cancellation charges may vary during peak seasons or special events.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefundCancellation;
