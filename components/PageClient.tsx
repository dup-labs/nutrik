"use client";

import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import MarqueeStrip from "@/components/sections/MarqueeStrip";
import GamificationSection from "@/components/sections/GamificationSection";
import Features from "@/components/sections/Features";
import ShowcaseSection from "@/components/sections/ShowcaseSection";
import MobileSection from "@/components/sections/MobileSection";
import ForWhom from "@/components/sections/ForWhom";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/sections/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import BackgroundBlobs from "@/components/BackgroundBlobs";

function scrollToWaitlist() {
  const el = document.getElementById("acesso");
  if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
}

export default function PageClient() {
  return (
    <>
      <BackgroundBlobs />
      <ScrollReveal />
      <Nav onCTA={scrollToWaitlist} />
      <Hero onCTA={scrollToWaitlist} />
      {/* <MarqueeStrip /> */}
      <GamificationSection onCTA={scrollToWaitlist} />
      <Features />
      <ShowcaseSection />
      <MobileSection />
      <ForWhom />
      <Waitlist />
      <Footer />
    </>
  );
}
