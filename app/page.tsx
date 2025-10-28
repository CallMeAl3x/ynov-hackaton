import { Metadata } from "next";
import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { currentUser } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "Pensaga - Create & Share Interactive Stories",
  description: "Transform your imagination into captivating stories with AI-powered generation. Create, collaborate, and share your narratives with the world.",
};

export default async function Home() {
  const user = await currentUser();

  if (user) {
    return <Dashboard />;
  }

  return (
    <main className="min-h-screen bg-white">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </main>
  );
}
