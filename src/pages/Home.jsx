import CtaSection from '../components/landing/CtaSection';
import Features from '../components/landing/Features';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import InsightsShowcase from '../components/landing/InsightsShowcase';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <InsightsShowcase />
      <CtaSection />
    </>
  );
}
