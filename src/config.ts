/**
 * 单景点实体唯一数据源 (Revolution Square / Plaza de la Revolución)
 * 所有 SEO 实体、地图、评分等集中于此，避免散落硬编码。
 */
export const siteConfig = {
  domain: 'plazadelarevolucioncuba.com',
  baseUrl: 'https://plazadelarevolucioncuba.com',
  locales: ['zh', 'en', 'es'] as const,
  defaultLocale: 'es',

  // 实体名称 / NAP
  fullName: 'Plaza de la Revolución',
  shortName: 'Revolution Square',
  cityEn: 'Havana',
  cityLocal: 'La Habana',
  region: 'La Habana',
  country: 'Cuba',
  countryCode: 'CU',
  address: '4JF7+3FQ, Av. Paseo, La Habana, Cuba',
  plusCode: '4JF7+3FQ',

  // 地理坐标（与用户提供的地图嵌入一致）
  lat: 23.1227066,
  lng: -82.3888396,

  // Google 数据
  rating: 4.5,
  reviewCount: 7333,

  // 地图
  mapsUrl: 'https://maps.app.goo.gl/W8thrgWWbavuLXwa7',
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6521.607450035555!2d-82.3888396!3d23.1227066!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88cd79e0f8a7517b%3A0x80aed39146a4b79d!2sRevolution%20Square!5e1!3m2!1szh-CN!2s!4v1788942866323!5m2!1szh-CN!2s',

  // 首图 / OG
  heroImage: '/gallery/revolution-square-1.jpg',

  // 政府 / 官方旅游门户（权威外链）
  govtTourismUrl: 'https://www.cuba.travel/',
  govtTourismName: 'Cuba Travel',
  presidenciaUrl: 'https://www.presidencia.gob.cu/',
  granmaUrl: 'https://en.granma.cu/',
  minrexUrl: 'https://cubaminrex.cu/es',
  prensaLatinaUrl: 'https://www.prensa-latina.cu/',

  // PWA / 站点
  gaId: 'G-HXM22WWPKP',
  themeColor: '#3a7a8d',
  lastUpdated: '2026-09-09',
  legalRoutes: ['/privacy-policy', '/terms-of-service', '/cookie-settings'] as const,
} as const;
