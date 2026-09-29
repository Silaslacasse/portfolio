import { defineSitemapEventHandler } from "#imports";
import Project from "../../models/project.model";

/**
 * Project pages for the sitemap. /projets/:slug is a dynamic route, so @nuxtjs/sitemap
 * cannot list it from the pages directory: this source gives every published project in
 * both locale sitemaps, each URL naming the other as its alternate.
 */
export default defineSitemapEventHandler(async () => {
  await useDatabase();

  const projects = await Project.find({ status: "published" }, "slug updatedAt").lean();

  return projects.flatMap(({ slug, updatedAt }) => {
    const fr = `/projets/${slug}`;
    const en = `/en/projects/${slug}`;
    const alternatives = [
      { hreflang: "fr", href: fr },
      { hreflang: "en", href: en },
      { hreflang: "x-default", href: fr },
    ];
    return [
      { loc: fr, lastmod: updatedAt, alternatives, _sitemap: "fr-FR" },
      { loc: en, lastmod: updatedAt, alternatives, _sitemap: "en-US" },
    ];
  });
});
