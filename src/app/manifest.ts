import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Revolution Square (Plaza de la Revolución) - Havana, Cuba Visitor Guide',
    short_name: 'Revolution Square',
    description:
      'Visitor guide to Revolution Square (Plaza de la Revolución) in Havana, Cuba: map, opening hours, José Martí Memorial, Che Guevara portraits and travel tips.',
    start_url: '/es',
    scope: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#3a7a8d',
    lang: 'es',
    categories: ['travel', 'tourism', 'education'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
