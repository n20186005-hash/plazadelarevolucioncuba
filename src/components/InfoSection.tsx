import { useTranslations, useMessages } from 'next-intl';

type KnowledgeSection = {
  id?: string;
  title: string;
  content: string;
};

export default function InfoSection() {
  const t = useTranslations('knowledge');
  const messages = useMessages() as any;
  const sections = (messages?.knowledge?.sections || []) as KnowledgeSection[];

  if (sections.length === 0) return null;

  return (
    <section id="significance" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-6">
          {sections.map((section, i) => (
            <div
              key={section.id || i}
              className="rounded-xl p-6 sm:p-8"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <h3
                className="font-display text-xl font-semibold mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {section.title}
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
