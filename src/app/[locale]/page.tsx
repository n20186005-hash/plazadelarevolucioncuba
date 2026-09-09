import { setRequestLocale } from 'next-intl/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import HistoryTimeline from '@/components/HistoryTimeline';
import InfoSection from '@/components/InfoSection';
import StoriesSection from '@/components/StoriesSection';
import RouteSection from '@/components/RouteSection';
import HoursSection from '@/components/HoursSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import WeatherSection from '@/components/WeatherSection';
import FacilitiesSection from '@/components/FacilitiesSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import FaqSection from '@/components/FaqSection';
import SourcesSection from '@/components/SourcesSection';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';
import { siteConfig } from '@/config';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const messages = (await import(`@/messages/${locale}.json`)).default as any;
  const baseUrl = siteConfig.baseUrl;
  const selfUrl = `${baseUrl}/${locale}`;
  const heroImage = `${baseUrl}${siteConfig.heroImage}`;

  const inLanguage = locale === 'zh' ? 'zh-CN' : locale;
  const description = messages?.meta?.description || '';
  const metaTitle = messages?.meta?.title || '';
  const heroAlt =
    messages?.hero?.imgAlt || `${siteConfig.fullName} in ${siteConfig.cityEn}, ${siteConfig.country}`;

  const schemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: `${siteConfig.shortName} (${siteConfig.fullName})`,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          '@id': `${baseUrl}/#logo`,
          url: `${baseUrl}/icons/icon.svg`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: `${siteConfig.shortName} (${siteConfig.fullName})`,
        description,
        inLanguage,
        publisher: { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${selfUrl}/#webpage`,
        url: selfUrl,
        name: metaTitle,
        description,
        inLanguage,
        isPartOf: { '@id': `${baseUrl}/#website` },
        about: { '@id': `${baseUrl}/#attraction` },
        primaryImageOfPage: { '@id': `${baseUrl}/#primaryimage` },
        datePublished: '2026-06-01',
        dateModified: siteConfig.lastUpdated,
      },
      {
        '@type': ['TouristAttraction', 'LandmarksOrHistoricalBuildings'],
        '@id': `${baseUrl}/#attraction`,
        name: siteConfig.fullName,
        alternateName: [
          siteConfig.shortName,
          '革命广场',
          `${siteConfig.cityLocal} ${siteConfig.fullName}`,
        ],
        url: selfUrl,
        description,
        image: [{ '@id': `${baseUrl}/#primaryimage` }],
        isAccessibleForFree: true,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Paseo',
          addressLocality: siteConfig.cityLocal,
          addressRegion: siteConfig.region,
          addressCountry: siteConfig.countryCode,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: siteConfig.lat,
          longitude: siteConfig.lng,
        },
        hasMap: siteConfig.mapsUrl,
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: DAYS,
            opens: '00:00',
            closes: '23:59',
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: siteConfig.rating,
          bestRating: 5,
          ratingCount: siteConfig.reviewCount,
        },
        touristType: ['City Square', 'Historical Landmark', 'Memorial'],
        sameAs: [
          siteConfig.mapsUrl,
          siteConfig.govtTourismUrl,
          siteConfig.presidenciaUrl,
        ],
      },
      {
        '@type': 'ImageObject',
        '@id': `${baseUrl}/#primaryimage`,
        url: heroImage,
        contentUrl: heroImage,
        caption: heroAlt,
      },
    ],
  };

  const faqItems = messages?.faq?.items || [];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item: { q: string; a: string }) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  const breadcrumbItems = messages?.breadcrumb?.items || [];
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map(
      (label: string, index: number) =>
        ({
          '@type': 'ListItem',
          position: index + 1,
          name: label,
          ...(index === 0 ? { item: selfUrl } : {}),
        }) as Record<string, unknown>
    ),
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <BasicInfo />
        <HistoryTimeline />
        <InfoSection />
        <StoriesSection />
        <RouteSection />
        <HoursSection />
        <TicketsSection />
        <TransportSection />
        <WeatherSection />
        <FacilitiesSection />
        <Gallery />
        <Reviews />
        <FaqSection />
        <SourcesSection />
        <MapEmbed />
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
