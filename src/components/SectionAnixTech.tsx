import React from 'react';
import Section from './Section';

const cardOffsets = [
  'md:-translate-y-2',
  'md:translate-y-3',
  'md:-translate-x-2',
  'md:translate-y-4',
  'md:-translate-y-1',
];

type TechnologyFeature = {
  title: string;
  description: string;
  icon: string;
};

type SectionAnixTechProps = {
  titleLines: string[];
  features: TechnologyFeature[];
};

export function SectionAnixTech({
  titleLines,
  features,
}: SectionAnixTechProps) {
  const cards = features || [];

  return (
    <Section id="technology" bg="#0f0f1f" className="py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
            {titleLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
            Технологические модули, которые ускоряют продакшн и дают контроль
            над качеством визуала.
          </p>
        </div>

        <div className="w-full">
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
            {cards.map((item, index) => {
              const isHero = index === 0;
              const offset = cardOffsets[index] || '';

              return (
                <div
                  key={`${item.title}-${index}`}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-anix-purple/30 via-anix-teal/20 to-anix-coral/20 text-white shadow-xl ring-1 ring-white/5 backdrop-blur-xl transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl ${
                    isHero ? 'md:col-span-2 md:p-10 p-6' : 'p-6'
                  } ${offset}`}
                >
                  <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,122,109,0.12),transparent_45%)]"
                    aria-hidden
                  />
                  <div className="relative flex flex-col sm:flex-row sm:items-start gap-4 md:gap-6">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md text-2xl shadow-lg ${isHero ? 'md:h-16 md:w-16 text-3xl' : ''}`}
                    >
                      <span aria-hidden>{item.icon}</span>
                    </div>
                    <div className="space-y-2">
                      <h3
                        className={`font-heading font-semibold text-xl md:text-2xl leading-tight ${
                          isHero ? 'md:text-3xl' : ''
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p className="text-white/75 text-sm md:text-base leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
