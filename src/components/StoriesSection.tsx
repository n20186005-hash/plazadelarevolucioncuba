import { useTranslations, useMessages } from 'next-intl';

type Story = {
  title: string;
  text: string;
  kind?: string;
};

export default function StoriesSection() {
  const t = useTranslations('stories');
  const messages = useMessages() as any;
  const items = (messages?.stories?.items || []) as Story[];

  if (items.length === 0) return null;

  return (
    <section id="stories" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-4"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-4" style={{ background: 'var(--accent)' }} />
        <p className="mb-8 max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
          {t('subtitle')}
        </p>

        <div className="space-y-5">
          {items.map((item, i) => {
            const kind = item.kind === 'tradition' ? 'tradition' : 'fact';
            return (
              <div
                key={i}
                className="rounded-xl p-6 sm:p-7"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium"
                    style={{
                      background: kind === 'fact' ? 'var(--accent)' : 'var(--tag-bg)',
                      color: kind === 'fact' ? '#fff' : 'var(--tag-text)',
                    }}
                  >
                    {kind === 'fact' ? t('kindFact') : t('kindTradition')}
                  </span>
                  <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                </div>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
