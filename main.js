const NEXT_PUBLIC_ORIGIN = process.env.NEXT_PUBLIC_ORIGIN ?? '';
const { BASE_PATH } = process.env;

// App router pages
const appPages = ['/', '/dashboard', '/steam', '/standalone', '/play', '/features', '/pricing'];

// Legacy pages
const legacyPages = ['/account', '/auth', '/extras/play23', '/extras/mods', '/market', '/history'];

// All supported pages
const allPages = [...appPages, ...legacyPages];

// Legacy path => new path mapping
const redirects = {
  '/account': '/settings/account',
  '/auth': '/settings/auth',
  '/extras/play23': '/standalone',
  '/extras/mods': '/standalone',
  '/market': '/dashboard',
  '/history': '/dashboard',
};

const defaultRobots = `User-agent: *
Allow: /

Sitemap: ${NEXT_PUBLIC_ORIGIN}/sitemap.xml
`;

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
const revalidate = 60 * 60; // 1 hour

/** @type {import("next").Metadata} */
const defaultMetadata = {
  metadataBase: new URL(NEXT_PUBLIC_ORIGIN),
  title: {
    default: 'Screeps',
    template: '%s — Screeps',
  },
  robots: {
    follow: true,
    googleBot: {
      index: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/favicon-apple.svg',
  },
  openGraph: {
    siteName: 'Screeps',
    locale: 'en_US',
    type: 'website',
    url: NEXT_PUBLIC_ORIGIN,
  },
  twitter: {
    card: 'summary',
    site: '@ScreepsGame',
    creator: '@ScreepsGame',
  },
  alternates: {
    canonical: NEXT_PUBLIC_ORIGIN,
    languages: {
      'en-US': `${NEXT_PUBLIC_ORIGIN}/`,
    },
  },
};

// https://github.com/vercel/next.js/issues/53791#issuecomment-1534192572
const i18nConfig = {
  '/': { canonical: '/', en: '/' },
  '/dashboard': { canonical: '/dashboard', en: '/dashboard' },
  '/steam': { canonical: '/steam', en: '/steam' },
  '/standalone': { canonical: '/standalone', en: '/standalone' },
  '/play': { canonical: '/play', en: '/play' },
  '/features': { canonical: '/features', en: '/features' },
  '/pricing': { canonical: '/pricing', en: '/pricing' },
};

// https://github.com/vercel/next.js/issues/53791#issuecomment-1534192572
const i18nLegacy = {
  '/': { canonical: '/', en: '/en/' },
  '/dashboard': { canonical: '/dashboard', en: '/en/dashboard' },
  '/steam': { canonical: '/steam', en: '/en/steam' },
  '/standalone': { canonical: '/standalone', en: '/en/standalone' },
  '/play': { canonical: '/play', en: '/en/play' },
  '/features': { canonical: '/features', en: '/en/features' },
  '/pricing': { canonical: '/pricing', en: '/en/pricing' },
};

module.exports = {
  appPages,
  legacyPages,
  allPages,
  redirects,
  defaultRobots,
  revalidate,
  defaultMetadata,
  i18nConfig,
  i18nLegacy,
  NEXT_PUBLIC_ORIGIN,
  BASE_PATH,
};