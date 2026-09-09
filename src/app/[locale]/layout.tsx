import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { siteConfig } from '@/config';
import type { Metadata, Viewport } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const htmlLangMap: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en',
  es: 'es',
};

const ogLocaleMap: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  es: 'es_ES',
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = routing.locales.includes(requested as (typeof routing.locales)[number])
    ? requested
    : routing.defaultLocale;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = siteConfig.baseUrl;

  const zhUrl = `${baseUrl}/zh`;
  const enUrl = `${baseUrl}/en`;
  const esUrl = `${baseUrl}/es`;
  const selfUrl = locale === 'zh' ? zhUrl : locale === 'en' ? enUrl : esUrl;

  const heroImage = `${baseUrl}${siteConfig.heroImage}`;

  return {
    metadataBase: new URL(baseUrl),
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        zh: zhUrl,
        en: enUrl,
        es: esUrl,
        'x-default': esUrl,
      } as Record<string, string>,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: selfUrl,
      siteName: `${siteConfig.shortName} (${siteConfig.fullName})`,
      locale: ogLocaleMap[locale] || 'es_ES',
      type: 'website',
      images: [
        {
          url: heroImage,
          alt: messages.hero?.imgAlt || `${siteConfig.fullName} in ${siteConfig.cityEn}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.meta.title,
      description: messages.meta.description,
      images: [heroImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/icons/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/icons/icon.svg',
    },
    appleWebApp: {
      capable: true,
      title: `${siteConfig.shortName} (${siteConfig.fullName})`,
      statusBarStyle: 'default',
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch(e) {}
    })();
  `;

  const gaScript = `
    (function () {
      function loadGA() {
        if (window.__revolutionSquareGaLoaded) return;
        window.__revolutionSquareGaLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}';
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', '${siteConfig.gaId}', { anonymize_ip: true });
      }
      function maybeLoad() {
        try {
          var prefs = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
          if (prefs.analytics) loadGA();
        } catch(e) {}
      }
      maybeLoad();
      document.addEventListener('consent-updated', maybeLoad);
    })();
  `;

  const swScript = `
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !location.hostname.includes('localhost')) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
      });
    }
  `;

  return (
    <html lang={htmlLangMap[locale] || 'es'} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: gaScript }} />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
