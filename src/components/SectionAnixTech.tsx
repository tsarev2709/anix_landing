import React from 'react';

type TechnologyCard = {
  icon: string;
  title: string;
  text: string;
  gradientClass: string;
};

type SectionAnixTechProps = {
  titleLines?: string[];
  features?: { icon: string; title: string; description: string }[];
};

const technologyCards: TechnologyCard[] = [
  {
    icon: '🧠',
    title: 'Собственная нейросеть Anix',
    text: 'Модульная генерация кадров, контроль стиля и динамики под конкретную задачу.',
    gradientClass: 'from-[#6c4cf0] via-[#5fe2ff] to-[#ff7a9e]',
  },
  {
    icon: '🛠️',
    title: 'Поиск и исправление артефактов',
    text: 'Скрипты inpainting и очистки устраняют шум, артефакты и дрожание без ручного ретуша.',
    gradientClass: 'from-[#ff9f43] via-[#ff6f61] to-[#8f5df6]',
  },
  {
    icon: '⚡',
    title: 'Ускорение продакшена',
    text: 'Автоматизированные пайплайны сокращают сборку ролика с недель до считанных дней.',
    gradientClass: 'from-[#4ade80] via-[#36cfc9] to-[#7c3aed]',
  },
  {
    icon: '🛰️',
    title: 'Контроль качества',
    text: 'Алгоритмы отслеживают целостность анимации, резкость деталей и стабильность движения.',
    gradientClass: 'from-[#5b8bff] via-[#6efacc] to-[#ffb347]',
  },
  {
    icon: '🎛️',
    title: 'Композиция и цвет',
    text: 'Физичная глубина, CG-эффекты и точная работа с цветом задают премиальную эстетику.',
    gradientClass: 'from-[#ff7eb6] via-[#8b5cf6] to-[#4fd1c5]',
  },
];

const offsets = [
  'md:-translate-y-2',
  'md:translate-y-4',
  'md:-translate-x-2',
  'md:translate-y-3',
  'md:-translate-y-1',
];

export function SectionAnixTech({
  titleLines,
  features,
}: SectionAnixTechProps = {}) {
  const cards: TechnologyCard[] = features?.length
    ? features.map((feature, index) => ({
        icon: feature.icon,
        title: feature.title,
        text: feature.description,
        gradientClass:
          technologyCards[index % technologyCards.length].gradientClass,
      }))
    : technologyCards;

  const heading = titleLines?.length
    ? titleLines.join(' ')
    : 'Технологии Anix, которые делают ваш проект быстрее и лучше';

  return (
    <section
      id="technology"
      className="relative h-screen snap-start overflow-hidden bg-[#0c0f1a]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,87,255,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(95,226,255,0.12),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(255,122,158,0.12),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-screen max-h-screen flex-col justify-between px-4 py-10 sm:max-h-none sm:py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-3">
          <h2 className="font-heading font-bold text-white leading-tight text-[clamp(18px,4vw,26px)] md:text-4xl lg:text-5xl">
            {heading}
          </h2>
          <p className="text-white/70 text-[clamp(14px,3vw,18px)] max-w-2xl mx-auto">
            Премиальный стек AI-инструментов и пайплайнов, который ускоряет
            продакшн и удерживает контроль над качеством.
          </p>
        </div>

        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {cards.map((card, index) => {
              const isHero = index === 0;
              const offset = offsets[index] || '';

              return (
                <div
                  key={card.title}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradientClass} p-6 text-white shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ease-out hover:scale-[1.02] ${
                    isHero ? 'md:col-span-2 md:p-10' : ''
                  } ${offset}`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.12),transparent_30%)] opacity-60" />
                  <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start md:gap-6">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-2xl shadow-lg ${
                        isHero ? 'md:h-16 md:w-16 text-3xl' : ''
                      }`}
                    >
                      <span aria-hidden>{card.icon}</span>
                    </div>
                    <div className="space-y-2">
                      <h3
                        className={`font-heading font-semibold leading-tight text-[clamp(18px,4vw,26px)] md:text-2xl lg:text-3xl ${
                          isHero
                            ? 'md:text-3xl lg:text-[clamp(28px,3vw,34px)]'
                            : ''
                        }`}
                      >
                        {card.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed text-[clamp(12px,3vw,16px)]">
                        {card.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
