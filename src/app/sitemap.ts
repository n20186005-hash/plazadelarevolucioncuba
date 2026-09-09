import { MetadataRoute } from 'next';
import { siteConfig } from '@/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.baseUrl;
  const locales = siteConfig.locales;
  const routes: { route: string; freq: 'weekly' | 'monthly'; priority: number }[] = [
    { route: '', freq: 'weekly', priority: 1 },
    { route: '/privacy-policy', freq: 'monthly', priority: 0.5 },
    { route: '/terms-of-service', freq: 'monthly', priority: 0.5 },
    { route: '/cookie-settings', freq: 'monthly', priority: 0.5 },
  ];

  const languageMap = Object.fromEntries(
    locales.map((l) => [l, `${baseUrl}/${l}`])
  ) as Record<string, string>;
  languageMap['x-default'] = `${baseUrl}/${siteConfig.defaultLocale}`;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const { route, freq, priority } of routes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(siteConfig.lastUpdated),
        changeFrequency: freq,
        priority,
        alternates: {
          languages: languageMap,
        },
      });
    }
  }

  return entries;
}
