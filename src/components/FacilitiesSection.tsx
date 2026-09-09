import { useTranslations, useMessages } from 'next-intl';

type Facility = { name: string; description: string };

const FACILITY_ICONS = ['🚻', '🅿️', '🍽️', '🏨', '🛒', '⛽', '💵', '🏥'];

export default function FacilitiesSection() {
  const t = useTranslations('facilities');
  const messages = useMessages() as any;
  const types = (messages?.facilities?.types || []) as Facility[];

  if (types.length === 0) return null;

  return (
    <section id="facilities" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-4" style={{ background: 'var(--accent)' }} />
        <p className="mb-3 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>
        <p className="mb-8 max-w-3xl text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {types.map((item, i) => (
            <div
              key={item.name}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <span className="text-2xl leading-none" aria-hidden="true">
                  {FACILITY_ICONS[i] || '•'}
                </span>
                <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                  {item.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
          style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
        >
          {t('hint')}
        </div>
      </div>
    </section>
  );
}
