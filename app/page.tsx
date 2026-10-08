import { BrandPromise } from "@/components/home/brand-promise";
import { ByCloth } from "@/components/home/by-cloth";
import { CategoryTiles } from "@/components/home/category-tiles";
import { FeaturedPiece } from "@/components/home/featured-piece";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { LookbookTeaser } from "@/components/home/lookbook-teaser";

// The campaign Home (Editorial layer): Hero, a random four-Piece row,
// Categories, the Lookbook teaser, the featured Piece, *By cloth* and the
// brand promise. All Server Components; only the reveal lines hydrate.
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CategoryTiles />
      <LookbookTeaser />
      <FeaturedPiece />
      <ByCloth />
      <BrandPromise />
    </>
  );
}
