import { useTranslations, useMessages } from 'next-intl';

type SourceItem = {
  name: string;
  url: string;
  description?: string;
};

export default function SourcesSection() {
  const t = useTranslations('sources');
  const messages = useMessages() as any;
  const items = (messages?.sources?.items || []) as SourceItem[];

  return (
    <section id="sources" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-4">
          {items.map((source, i) => (
            <div
              key={i}
              className="rounded-xl p-5"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-medium hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {source.name}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
              {source.description && (
                <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {source.description}
                </p>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs mt-8 max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {t('disclaimer')}
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          {t('lastUpdated')}
        </p>
      </div>
    </section>
  );
}
