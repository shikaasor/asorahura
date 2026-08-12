import HeroSection from "@/components/home/HeroSection";
import WorkflowStory from "@/components/home/WorkflowStory";
import PainSection from "@/components/home/PainSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import SocialProof from "@/components/home/SocialProof";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import AboutSection from "@/components/home/AboutSection";
import LeadMagnetStrip from "@/components/home/LeadMagnetStrip";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WorkflowStory />
      <ProcessTimeline />
      <PainSection />
      <ServicesPreview />
      <SocialProof />
      <AboutSection />
      <LeadMagnetStrip />
    </main>
  );
}
