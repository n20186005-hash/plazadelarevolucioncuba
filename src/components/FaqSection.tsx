import { useTranslations, useMessages } from 'next-intl';

type FaqItem = {
  q: string;
  a: string;
};

export default function FaqSection() {
  const t = useTranslations('faq');
  const messages = useMessages() as any;
  const items = (messages?.faq?.items || []) as FaqItem[];

  if (items.length === 0) return null;

  return (
    <section id="faq" className="section-padding">
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
          {items.map((item, i) => (
            <details
              key={i}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <summary
                className="cursor-pointer list-none p-5 flex items-center justify-between gap-4 font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                <span>{item.q}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  className="flex-shrink-0"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div
                className="px-5 pb-5 text-base leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
