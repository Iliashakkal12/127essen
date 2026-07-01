import { Hero } from "@/components/marketing/hero";
import { Benefits } from "@/components/marketing/benefits";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeaturedSalons } from "@/components/marketing/featured-salons";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaBanner } from "@/components/marketing/cta-banner";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Benefits />
      <HowItWorks />
      <FeaturedSalons />
      <TestimonialsSection />
      <PricingSection />
      <CtaBanner />
    </>
  );
}
