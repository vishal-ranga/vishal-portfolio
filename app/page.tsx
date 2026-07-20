import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Philosophy } from "@/components/Philosophy";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { TechStack } from "@/components/TechStack";
import { Certifications } from "@/components/Certifications";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Philosophy />
        <ProjectsGrid />
        <TechStack />
        <Certifications />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
