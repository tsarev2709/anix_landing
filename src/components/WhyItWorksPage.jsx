import React from 'react';
import { Helmet } from 'react-helmet';

const WhyItWorksPage = () => {
  const proofPoints = [
    {
      title: 'Эмоции конвертируют лучше скриптов',
      description:
        'Видео цепляет внимание за секунды, выстраивает доверие через эмоции и визуальные образы и помогает покупателю запомнить ключевые преимущества продукта.',
    },
    {
      title: 'Продажник, который не выдыхает',
      description:
        'Один ролик одновременно работает в рекламе, воронке, на встречах и на стенде. Ему не нужен выходной, и он не ошибается в формулировках.',
    },
    {
      title: 'Сложные продукты становятся понятными',
      description:
        'Моушн-графика и динамичные демонстрации объясняют сложные процессы быстрее, чем любой менеджер, и сокращают цикл сделки.',
    },
  ];

  const metrics = [
    {
      value: 'x3',
      label: 'Рост конверсии из холодного трафика',
      description:
        'Видео прогревает аудиторию до встречи и снимает часть возражений ещё до общения с менеджером.',
    },
    {
      value: '70%+',
      label: 'Больше запоминаемость бренда',
      description:
        'Данные Nielsen показывают: зрители усваивают до 95% сообщения из видео против 10% из текста.',
    },
    {
      value: '24/7',
      label: 'Непрерывная работа без найма',
      description:
        'Контент продаёт в рекламе, на маркетплейсах, в чат-ботах и на конференциях без расширения штата.',
    },
  ];

  const comparison = [
    {
      topic: 'Скорость обучения',
      video: 'Новый ролик запускаем за 1–2 недели и сразу масштабируем.',
      sales:
        'Новый менеджер выходит на план только через 2–3 месяца адаптации.',
    },
    {
      topic: 'Стабильность качества',
      video:
        'Скрипт закреплён в сценарии, эмоции, кадры и триггеры повторяемы.',
      sales:
        'Человеческий фактор — усталость, стресс, разные трактовки скриптов.',
    },
    {
      topic: 'Стоимость контакта',
      video: 'Один раз инвестируете в продакшн и используете на всех этапах.',
      sales: 'ФОТ, обучение, мотивация и постоянный контроль качества.',
    },
    {
      topic: 'Масштабируемость',
      video: 'Видео легко адаптируется под разные сегменты и языки.',
      sales:
        'Чтобы охватить новые сегменты, нужно расширять штат и обновлять скрипты.',
    },
  ];

  const useCases = [
    'Лид-магниты и автоворонки: замена холодных звонков на тёплые заявки.',
    'Продажи на мероприятиях: экран привлекает людей ещё до начала диалога.',
    'Онбординг клиентов: объясняем продукт один раз вместо десятков встреч.',
    'Поддержка отдела продаж: менеджеры используют ролики как усиление презентации.',
  ];

  return (
    <main className="relative min-h-screen bg-anix-dark text-white">
      <Helmet>
        <title>Почему это работает — ANIX Studio</title>
        <meta
          name="description"
          content="Почему видео и анимация продают лучше классического отдела продаж. Факты, сравнения и кейсы от ANIX Studio."
        />
      </Helmet>
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#1f1240] via-anix-dark/80 to-anix-darker pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10">
        <header className="px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto text-center md:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm uppercase tracking-[0.2em] text-anix-teal">
              Почему это работает
            </span>
            <h1 className="mt-8 text-4xl md:text-6xl font-heading font-bold leading-tight">
              Видео и моушн продают лучше отдела продаж, потому что клиент
              влюбляется в продукт до звонка
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl">
              Мы берём самые сильные аргументы из опыта ваших менеджеров,
              усиливаем их через визуальные истории и создаём контент, который
              не устаёт, не забывает скрипт и работает на вас 24/7.
            </p>
          </div>
        </header>

        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
            {proofPoints.map((point) => (
              <article
                key={point.title}
                className="group rounded-3xl bg-white/5 border border-white/10 p-8 transition hover:border-anix-teal/60 hover:bg-white/10"
              >
                <h2 className="text-2xl font-semibold text-anix-teal group-hover:text-white transition">
                  {point.title}
                </h2>
                <p className="mt-4 text-white/80 leading-relaxed">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 py-20 bg-gradient-to-br from-white/5 via-transparent to-white/5">
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-3xl bg-anix-darker/80 p-8 shadow-lg shadow-black/40 border border-white/5"
              >
                <p className="text-5xl font-heading font-bold text-anix-teal">
                  {metric.value}
                </p>
                <p className="mt-4 text-lg font-semibold">{metric.label}</p>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
              <div className="grid md:grid-cols-3 bg-white/10 text-sm uppercase tracking-[0.2em] text-anix-teal/80">
                <div className="px-6 py-4">Что сравниваем</div>
                <div className="px-6 py-4">Видео и анимация</div>
                <div className="px-6 py-4">Отдел продаж</div>
              </div>
              {comparison.map((row, index) => (
                <div
                  key={row.topic}
                  className={`grid md:grid-cols-3 px-6 py-6 gap-6 text-sm md:text-base ${
                    index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                  }`}
                >
                  <div className="font-semibold text-white">{row.topic}</div>
                  <div className="text-white/80 leading-relaxed">
                    {row.video}
                  </div>
                  <div className="text-white/60 leading-relaxed">
                    {row.sales}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto rounded-3xl border border-anix-purple/40 bg-anix-darker/80 p-10 shadow-2xl shadow-black/40">
            <h2 className="text-3xl font-heading font-bold text-anix-teal text-center md:text-left">
              Где видео заменяет отдел продаж
            </h2>
            <ul className="mt-8 space-y-4 text-white/80">
              {useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-4">
                  <span
                    className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-anix-teal"
                    aria-hidden
                  />
                  <span>{useCase}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <p className="text-white/70 max-w-2xl">
                Мы строим стратегию контента под вашу воронку: от первого
                касания до сделки. Команда ANIX Studio берёт на себя аналитику,
                сценарии, продакшн и дистрибуцию.
              </p>
              <a
                href="/#brief"
                className="inline-flex items-center justify-center rounded-full bg-anix-purple px-6 py-3 text-base font-semibold transition hover:bg-anix-teal hover:text-anix-darker"
              >
                Получить медиаплан
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WhyItWorksPage;
