import { About } from "@/components/About";
import { Events } from "@/components/Events";
import { Facility } from "@/components/Facility";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Inquiry } from "@/components/Inquiry";
import { Training } from "@/components/Training";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Training />
      <Facility />
      <Events />
      <Gallery />
      <Inquiry />
    </>
  );
}
