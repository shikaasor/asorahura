import HeroSection from "@/components/home/HeroSection";
import PainSection from "@/components/home/PainSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import SocialProof from "@/components/home/SocialProof";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import AboutSection from "@/components/home/AboutSection";
import LeadMagnetStrip from "@/components/home/LeadMagnetStrip";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <PainSection />
      <ServicesPreview />
      <SocialProof />
      <ProcessTimeline />
      <AboutSection />
      <LeadMagnetStrip />
      <Footer />
    </main>
  );
}
