import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { Stats } from "@/components/home/Stats";
import { Features } from "@/components/home/Features";

export default function Home() {
  return (
    <div className="pt-14 pb-24 space-y-6">
      <Hero />
      <Stats />
      <ServicesPreview />
      <Features />
    </div>
  );
}
