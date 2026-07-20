import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const siteUrl = "https://your-domain.example"; // TODO: update after deploying

export default function sitemap(): MetadataRoute.Sitemap {
  const projectRoutes = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: siteUrl, lastModified: new Date() },
    ...projectRoutes,
  ];
}
