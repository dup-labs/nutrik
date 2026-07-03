"use client";

import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import AppShowcase from "@/components/sections/AppShowcase";
import ComoFunciona from "@/components/sections/ComoFunciona";
import GamificacaoSection from "@/components/sections/GamificacaoSection";
import FAQ from "@/components/sections/FAQ";
import Waitlist from "@/components/sections/Waitlist";
import Footer from "@/components/sections/Footer";
import ScrollReveal from "@/components/ScrollReveal";

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
}

export default function PageClient() {
  return (
    <>
      <ScrollReveal />
      <Nav onCTA={() => scrollTo("acesso")} />
      <Hero onCTA={() => scrollTo("acesso")} />
      <Pillars />
      <AppShowcase />
      <ComoFunciona />
      <GamificacaoSection />
      <FAQ />
      <Waitlist />
      <Footer />
    </>
  );
}
