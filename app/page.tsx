import { Hero } from "@/components/home/Hero";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { Stats } from "@/components/home/Stats";
import { Features } from "@/components/home/Features";

export default function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <Stats />
      <ServicesPreview />
      <Features />
    </div>
  );
}
