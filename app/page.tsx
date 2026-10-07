import { BrandPromise } from "@/components/home/brand-promise";
import { ByCloth } from "@/components/home/by-cloth";
import { CategoryTiles } from "@/components/home/category-tiles";
import { FeaturedPiece } from "@/components/home/featured-piece";
import { Hero } from "@/components/home/hero";
import { LookbookTeaser } from "@/components/home/lookbook-teaser";

// The campaign Home (Editorial layer): Hero, Categories, the Lookbook teaser,
// the featured Piece, *By cloth* and the brand promise. All Server Components;
// only the reveal lines hydrate.
export default function Home() {
  return (
    <>
      <Hero />
      <CategoryTiles />
      <LookbookTeaser />
      <FeaturedPiece />
      <ByCloth />
      <BrandPromise />
    </>
  );
}
