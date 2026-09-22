import Hero from "@/components/Hero";
import FeaturedStories from "@/components/FeaturedStories";
import Categories from "@/components/Categories";
import LatestStories from "@/components/LatestStories";
import TrendingStories from "@/components/TrendingStories";
import FeaturedWriters from "@/components/FeaturedWriters";
import WhyWebSQ from "@/components/WhyWebSQ";
import BecomeWriter from "@/components/BecomeWriter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedStories />
      <TrendingStories />
      <Categories />
      <WhyWebSQ />
      <LatestStories />
      <FeaturedWriters />
      <BecomeWriter />
    </>
  );
}
