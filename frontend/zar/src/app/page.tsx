import HeroSection from '@/components/ui/organisms/HeroSection/HeroSection';
import LegacySection from '@/components/ui/organisms/LegacySection/LegacySection';
import CollectionShowcase from '@/components/ui/organisms/CollectionShowcase/CollectionShowcase';
import ModelShowcaseSection from '@/components/ui/organisms/ModelShowcaseSection/ModelShowcaseSection';
import ManufacturingSection from '@/components/ui/organisms/ManufacturingSection/ManufacturingSection';
import CraftsmanshipSection from '@/components/ui/organisms/CraftsmanshipSection/CraftsmanshipSection';
import ModernWomanSection from '@/components/ui/organisms/ModernWomanSection/ModernWomanSection';
import ExhibitionsSection from '@/components/ui/organisms/ExhibitionsSection/ExhibitionsSection';
import RetailerSlider from '@/components/ui/organisms/RetailerSlider/RetailerSlider';
import TrustedBrandsSection from '@/components/ui/organisms/TrustedBrandsSection/TrustedBrandsSection';
import InstagramSection from '@/components/ui/organisms/InstagramSection/InstagramSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <LegacySection />
      {/* <CollectionShowcase /> */}
      <ModelShowcaseSection />
      <ManufacturingSection />
      <CraftsmanshipSection />
      <ModernWomanSection />
      <ExhibitionsSection />
      <RetailerSlider />
      <InstagramSection />
      <TrustedBrandsSection />
    </>
  );
}
