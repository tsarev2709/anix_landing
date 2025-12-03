import React from 'react';
import { ArrowRight, Send, Sparkles, Star, Phone } from 'lucide-react';
import { SectionAnixTech } from './SectionAnixTech';

const heroHighlights = [
  'AI-видео, которые объясняют сложные продукты',
  'Студийное качество за дни, а не месяцы',
  'Команда, привыкшая работать с B2B и deep tech',
];

const cases = [
  {
    title: 'Fintech onboarding',
    description:
      'Ускорили обучение новых пользователей и сократили churn с помощью чётких AI-анимаций.',
    gradient: 'from-[#5c5cff] via-[#5ce1e6] to-[#a855f7]',
  },
  {
    title: 'Industrial SaaS',
    description:
      'Показали сложные сценарии работы продукта через CG-метафоры и аккуратные динамические планы.',
    gradient: 'from-[#ff7b5f] via-[#ffd166] to-[#6dd3ff]',
  },
  {
    title: 'HealthTech pitch',
    description:
      'Подготовили визуал для инвесторского питча, сфокусированный на доказательной части и метриках.',
    gradient: 'from-[#6ee7b7] via-[#3b82f6] to-[#a855f7]',
  },
];

const contacts = [
  {
    label: 'Телеграм-бот для брифов',
    value: '@AnixBriefBot',
    icon: <Send className="h-5 w-5" />,
    href: 'https://t.me/AnixBriefBot',
  },
  {
    label: 'Позвонить фаундеру',
    value: '+7 999 999-99-99',
    icon: <Phone className="h-5 w-5" />,
    href: 'tel:+79999999999',
  },
  {
    label: 'Почта',
    value: 'hello@anix.ai',
    icon: <Sparkles className="h-5 w-5" />,
    href: 'mailto:hello@anix.ai',
  },
];

export function AnixLandingPage() {
  return (
    <div className="h-screen overflow-y-scroll snap-none md:snap-y md:snap-mandatory bg-[#070a12] text-white">
      <section className="relative h-screen snap-start flex items-center px-4 py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(108,76,240,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(95,226,255,0.18),transparent_30%),linear-gradient(120deg,rgba(108,76,240,0.18),rgba(95,226,255,0.06),rgba(255,122,158,0.12))]" />
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-6 text-center">
          <div className="flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-[0.18em] text-white/70">
            <Sparkles className="h-4 w-4" />
            <span>AI motion studio</span>
            <Star className="h-4 w-4" />
            <span>Premium delivery</span>
          </div>
          <h1 className="font-heading text-[clamp(28px,7vw,56px)] font-semibold leading-tight">
            Технологичный продакшн видео, который продаёт сложные продукты
          </h1>
          <p className="mx-auto max-w-3xl text-[clamp(14px,3.4vw,20px)] text-white/75">
            Anix собирает анимацию уровня студии за считанные дни. Мы переводим
            сложные смыслы в визуал, который удерживает внимание и помогает
            отделам продаж.
          </p>
          <div className="flex flex-col items-center gap-3 text-[clamp(12px,3vw,16px)] text-white/80">
            {heroHighlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur border border-white/10"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-[#6c4cf0] to-[#ff7a9e]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://t.me/AnixBriefBot"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6c4cf0] to-[#ff7a9e] px-6 py-3 text-[clamp(12px,3vw,16px)] font-semibold shadow-xl shadow-[#6c4cf0]/40"
            >
              Получить аудит воронки
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:hello@anix.ai"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[clamp(12px,3vw,16px)] font-semibold backdrop-blur"
            >
              Обсудить задачу
            </a>
          </div>
        </div>
      </section>

      <SectionAnixTech />

      <section className="relative h-screen snap-start flex items-center px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-[#0b1021] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(94,226,255,0.12),transparent_35%),radial-gradient(circle_at_90%_70%,rgba(255,122,158,0.14),transparent_35%)]" />
        <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col justify-center gap-8 text-left">
          <div className="text-center md:text-left">
            <p className="text-white/60 text-[clamp(12px,2.8vw,16px)] uppercase tracking-[0.2em] mb-3">
              кейсы
            </p>
            <h2 className="font-heading text-[clamp(24px,5vw,42px)] font-semibold leading-tight">
              Проекты, где Anix уже ускорил результат
            </h2>
            <p className="mt-3 max-w-2xl text-[clamp(14px,3vw,18px)] text-white/70">
              Мы переводим метрики продукта и боли клиентов в видео, которое
              работает в продажах, питчах и обучении.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {cases.map((item) => (
              <div
                key={item.title}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${item.gradient} p-6 shadow-2xl ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-2`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_35%)] opacity-70" />
                <div className="relative flex h-full flex-col justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-[clamp(18px,4vw,26px)] font-semibold leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[clamp(12px,3vw,16px)] text-white/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    Подробнее
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative h-screen snap-start flex items-center px-4 py-10 sm:py-12 md:py-16 lg:py-20 bg-[#090c16] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(108,76,240,0.18),transparent_35%),radial-gradient(circle_at_10%_80%,rgba(94,226,255,0.12),transparent_30%)]" />
        <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col justify-center gap-8 text-center md:text-left">
          <div>
            <p className="text-white/60 text-[clamp(12px,2.8vw,16px)] uppercase tracking-[0.2em] mb-3 text-center md:text-left">
              контакты
            </p>
            <h2 className="font-heading text-[clamp(24px,5vw,40px)] font-semibold leading-tight">
              Давайте соберём видео под ваши метрики
            </h2>
            <p className="mt-3 max-w-2xl text-[clamp(14px,3vw,18px)] text-white/70">
              Напишите нам в удобный канал — вернёмся с анализом воронки, тремя
              точками роста и примерной экономикой.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 text-left shadow-xl backdrop-blur transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[clamp(12px,3vw,16px)] text-white/70">
                    {contact.icon}
                    <span>{contact.label}</span>
                  </div>
                  <div className="text-[clamp(16px,4vw,22px)] font-semibold text-white">
                    {contact.value}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#6fe7ff]">
                    Связаться
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AnixLandingPage;
