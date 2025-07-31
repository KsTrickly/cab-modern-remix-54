
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import all pages
import Index from "./pages/Index";
import VehicleList from "./pages/VehicleList";
import BookingForm from "./pages/BookingForm";
import BookingTicketPage from "./pages/BookingTicket";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Import city pages
import Ayodhya from "./pages/Ayodhya";
import Delhi from "./pages/cities/Delhi";
import Indore from "./pages/cities/Indore";
import Goa from "./pages/cities/Goa";
import Dwarka from "./pages/cities/Dwarka";
import Dalhousie from "./pages/cities/Dalhousie";
import Coimbatore from "./pages/cities/Coimbatore";

// Service pages
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundCancellation from "./pages/RefundCancellation";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route path="/booking-form" element={<BookingForm />} />
            <Route path="/ticket/:bookingId" element={<BookingTicketPage />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* City routes */}
            <Route path="/ayodhya" element={<Ayodhya />} />
            <Route path="/cities/delhi" element={<Delhi />} />
            <Route path="/cities/indore" element={<Indore />} />
            <Route path="/cities/goa" element={<Goa />} />
            <Route path="/cities/dwarka" element={<Dwarka />} />
            <Route path="/cities/dalhousie" element={<Dalhousie />} />
            <Route path="/cities/coimbatore" element={<Coimbatore />} />
            
            {/* Placeholder routes for remaining cities - will redirect to NotFound for now */}
            <Route path="/cities/*" element={<NotFound />} />
            
            {/* Service pages */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/refund-cancellation" element={<RefundCancellation />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
