import CTASection from "../components/HomePage/CTASection";
import FeaturesSection from "../components/HomePage/FeaturesSection";
import FooterSection from "../components/HomePage/FooterSection";
import HeroSection from "../components/HomePage/HeroSection";
import HowItWorksSection from "../components/HomePage/HowItWorksSection";
import PricingSection from "../components/HomePage/PricingSection";
import TestimonialsSection from "../components/HomePage/TestimonialsSection";
import Navbar from "../components/Navbar";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default HomePage;
