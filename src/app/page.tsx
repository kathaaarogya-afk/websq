import Hero from "@/components/Hero";
import FeaturedStories from "@/components/FeaturedStories";
import Categories from "@/components/Categories";
import LatestStories from "@/components/LatestStories";
import FeaturedWriters from "@/components/FeaturedWriters";
import BecomeWriter from "@/components/BecomeWriter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedStories />
      <Categories />
      <LatestStories />
      <FeaturedWriters />
      <BecomeWriter />
    </>
  );
}