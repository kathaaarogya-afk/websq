import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WebSQ - Learn, Build & Share Tech, AI, SEO & Marketing",
    short_name: "WebSQ",
    description:
      "WebSQ is an Australian community for learning, building and sharing knowledge about website technology, artificial intelligence, SEO and digital marketing.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#EAB308",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}