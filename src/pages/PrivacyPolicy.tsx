
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Privacy Policy
              </h1>
              <p className="text-muted-foreground text-lg">
                How we collect, use, and protect your personal information
              </p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Information We Collect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-primary">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name and contact details (phone number, email)</li>
                    <li>Pickup and drop-off locations</li>
                    <li>Travel preferences and requirements</li>
                    <li>Payment information (for billing purposes)</li>
                  </ul>

                  <h4 className="font-semibold text-primary mt-6">Automatically Collected Information</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Device information and browser type</li>
                    <li>IP address and location data (with permission)</li>
                    <li>Website usage patterns and preferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How We Use Your Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="list-disc list-inside space-y-2">
                    <li>To provide and manage our cab services</li>
                    <li>To communicate booking confirmations and updates</li>
                    <li>To process payments and maintain billing records</li>
                    <li>To improve our services and customer experience</li>
                    <li>To send promotional offers (with your consent)</li>
                    <li>To ensure safety and security of our services</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Information Sharing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except in the following cases:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>With drivers to facilitate your trip</li>
                    <li>With payment processors for transaction processing</li>
                    <li>When required by law or legal process</li>
                    <li>To protect our rights and ensure service security</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Security</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>We implement appropriate security measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Secure servers and encrypted data transmission</li>
                    <li>Regular security audits and updates</li>
                    <li>Limited access to personal information</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>You have the right to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Access your personal information we hold</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>File a complaint about our data practices</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>For any privacy-related questions or requests, contact us:</p>
                  <div className="mt-4">
                    <p className="font-medium">Phone: +91 7497974808</p>
                    <p className="font-medium">Email: info@ramancab.com</p>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Last updated: December 2024
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

export default PrivacyPolicy;
