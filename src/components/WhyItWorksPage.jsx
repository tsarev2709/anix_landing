import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ExternalLink,
  Eye,
  Lightbulb,
  MessageCircle,
  Play,
  Presentation,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Workflow,
} from 'lucide-react';
import { toPublicHref } from '../seo/SeoHead';
import aviandrImage from '../images/cases/aviandr-cover.webp';
import clappyImage from '../images/cases/clappy.webp';
import hemotechImage from '../images/cases/hemotech-ai.webp';
import mftiImage from '../images/cases/mfti-endowment.webp';
import multonImage from '../images/cases/multon-partners.webp';
import tpesImage from '../images/cases/tpes.webp';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import './WhyItWorksPage.css';

const TELEGRAM_URL = 'https://t.me/anix_helper';
const SHOWREEL = {
  embed:
    'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239051&hash=8a2d51037c33a713&hd=3&autoplay=1',
  external: 'https://vkvideo.ru/video-174933827_456239051',
};

const publicAsset = (path) => `${process.env.PUBLIC_URL || ''}${path}`;

const science = [
  {
    value: 'до 22×',
    title: 'История заметнее голого факта',
    text: 'Такой ориентир приводит Stanford в материалах Дженнифер Аакер. Это не гарантия для любого ролика: эффект появляется у истории с целью, героем, ставкой и дугой.',
    source: 'Stanford / Jennifer Aaker',
    href: 'https://womensleadership.stanford.edu/tools-resources/voice-influence/harnessing-power-stories',
  },
  {
    value: '33 000+',
    title: 'Истории легче понять и вспомнить',
    text: 'Метаанализ более 75 выборок показал устойчивое преимущество повествовательных текстов над объяснительными по пониманию и воспроизведению.',
    source: 'Memory & Cognition / PubMed',
    href: 'https://pubmed.ncbi.nlm.nih.gov/33410100/',
  },
  {
    value: '1,50',
    title: 'Слова и изображения усиливают друг друга',
    text: 'Медианный размер эффекта в девяти исследованиях переноса знаний: озвученная визуализация помогала решать новые задачи лучше, чем одни слова.',
    source: 'Cambridge Handbook of Multimedia Learning',
    href: 'https://assets.cambridge.org/052183/8738/excerpt/0521838738_excerpt.htm',
  },
];

const mechanics = [
  {
    number: '01',
    icon: Eye,
    title: 'Захватить внимание',
    text: 'Не обещанием «будет интересно», а вопросом, конфликтом, неожиданным образом или узнаваемой ситуацией.',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Собрать понимание',
    text: 'Показать причинно-следственную связь: что происходит, почему это важно и где продукт меняет сценарий.',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Оставить след в памяти',
    text: 'Связать факты с персонажем, визуальной метафорой и последовательностью событий, которую легко восстановить.',
  },
  {
    number: '04',
    icon: Target,
    title: 'Довести до действия',
    text: 'Зритель понимает следующий шаг: запросить демо, обсудить пилот, применить правило или пересказать идею коллеге.',
  },
];

const storyIngredients = [
  ['Цель', 'Что зритель должен понять, почувствовать и сделать после просмотра.'],
  ['Крючок', 'Почему он не закроет ролик в первые секунды.'],
  ['Герой и ставка', 'В ком зритель узнаёт себя и что этот герой может потерять или получить.'],
  ['Дуга', 'Как меняется ситуация: проблема → решение → новый результат.'],
  ['Визуальная причинность', 'Не украшение текста, а показ механики, процесса и последствий.'],
  ['Ритм', 'Порции смысла, паузы и акценты без когнитивного перегруза.'],
];

const businessTasks = [
  {
    icon: Presentation,
    eyebrow: 'Продажи / B2B',
    title: 'Показать сложный продукт за короткую встречу',
    text: 'Эксплейнер фиксирует сильный сценарий продажи и помогает одинаково ясно объяснять продукт на питче, демо, в рассылке и follow-up.',
    href: '/cases/b2b',
    link: 'Кейсы сложных продуктов',
  },
  {
    icon: Stethoscope,
    eyebrow: 'Pharma / MedTech',
    title: 'Сделать видимым то, что нельзя снять',
    text: 'Механизм действия, клинический workflow, доказательная база и путь пациента превращаются в последовательную визуальную модель.',
    href: '/medicine',
    link: 'Подход для медицины',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'HSE / Onboarding',
    title: 'Не просто сообщить правило, а показать последствия',
    text: 'Короткие модули стандартизируют объяснение и усиливают обязательные процедуры обучения: ситуация, риск, правильное действие, проверка понимания.',
    href: '/hse',
    link: 'Решения для охраны труда',
  },
  {
    icon: Sparkles,
    eyebrow: 'Бренд / События',
    title: 'Пробить визуальный шум и дать идее форму',
    text: 'Персонаж, драматургия и узнаваемый визуальный язык помогают ролику работать на стенде, конференции и в контенте после события.',
    href: '/cases',
    link: 'Все кейсы Anix',
  },
];

const cases = [
  {
    title: 'ТПЭС',
    result: '50 слайдов → одна история',
    text: 'Промышленная технология стала разговором о бизнес-проблеме, а не лекцией для инженеров.',
    image: tpesImage,
    href: '/cases/tpes',
  },
  {
    title: 'Clappy',
    result: 'Сложный B2B2C-продукт наконец поняли',
    text: 'Показали механику решения через понятный сценарий потребления и ценность для производителя.',
    image: clappyImage,
    href: '/cases/clappy',
  },
  {
    title: 'Авиандр',
    result: 'Доказательная база стала визуальным миром',
    text: 'Научную логику связали с героями, атмосферой и спокойной коммуникацией для врачебной аудитории.',
    image: aviandrImage,
    href: '/cases/aviandr',
  },
  {
    title: 'Мултон Партнерс',
    result: 'Правила получили героя и систему',
    text: 'Маскот удерживает важные темы безопасности в поле внимания сотрудников между инструктажами.',
    image: multonImage,
    href: '/cases/multon-partners',
  },
  {
    title: 'Hemotech AI',
    result: 'MedTech без визуального перегруза',
    text: 'Сложное диагностическое решение объясняется через ясный пользовательский сценарий и сдержанный язык.',
    image: hemotechImage,
    href: '/cases/hemotech-ai',
  },
  {
    title: 'Эндаумент-фонд МФТИ',
    result: 'Ролик стал самостоятельным инфоповодом',
    text: 'Персонажи и драматургия помогли сделать тему фонда заметной и пригодной для дальнейшей коммуникации.',
    image: mftiImage,
    href: '/cases/mfti-endowment',
  },
];

const featuredArticles = [
  {
    tag: 'Драматургия',
    title: 'Что такое глубина просмотра и с чем её едят',
    text: 'Почему внимание держится не на одном хуке, а на цепочке любопытства, сопереживания и ожиданий.',
    href: 'https://tenchat.ru/media/3912493-chto-takoye-glubina-prosmotra-i-s-chem-yeye-yedyat',
  },
  {
    tag: 'Кейс',
    title: 'Как фаундер поменял 50 слайдов на 1 ролик',
    text: 'Разбор ТПЭС: как говорить с владельцами заводов о проблеме бизнеса, не перегружая их инженерными деталями.',
    href: 'https://tenchat.ru/media/3883759-kak-faunder-pomenyal-50-slaydov-na-1-rolik',
  },
  {
    tag: 'B2B-продажи',
    title: '5 ошибок в B2B-продажах, которые закрывает анимационный ролик',
    text: 'Эмоциональная пустота, длинные презентации, разный уровень продавцов и невидимая механика продукта.',
    href: 'https://tenchat.ru/media/3876249-5-oshibok-v-b2bprodazhakh-kotoryye-zakryvayet-animatsionniy-rolik',
  },
  {
    tag: 'Кейс',
    title: '«Наш продукт не понимают» — как мы решили проблему стартапа',
    text: 'Как сюжет и визуальный образ помогли объяснить продукт одновременно потребителю и B2B-покупателю.',
    href: 'https://tenchat.ru/media/3900526-nash-produkt-ne-ponimayut--kak-my-reshili-problemu-s-otklikami-dlya-startapa',
  },
  {
    tag: 'MedTech',
    title: 'Как мы «нечаянно» сделали брендинг MedTech-стартапу',
    text: 'Почему хороший ролик иногда становится началом визуальной системы, а не одноразовым контентом.',
    href: 'https://tenchat.ru/media/3835961-kak-my-nechayanno-sdelali-brending-medtech-startapu',
  },
  {
    tag: 'Выставки',
    title: 'Секретное оружие на выставке или питче',
    text: 'Как движение, короткая история и повторяемый сценарий помогают работать внутри визуального шума события.',
    href: 'https://tenchat.ru/media/3879625-sekretnoye-oruzhiye-na-vystavke-ili-pitche',
  },
];

const moreArticles = [
  ['Продавцы не дожимают: кто виноват и что делать', 'https://tenchat.ru/media/3904003-prodavtsy-ne-dozhimayut-kto-vinovat-i-chto-delat'],
  ['Продукт vs продажи', 'https://tenchat.ru/media/3890713-produkt-vs-prodazhi'],
  ['Спам или «они сами напишут» — как найти баланс', 'https://tenchat.ru/media/3867911-spam-ili-oni-sami-napishut--kak-nayti-balans'],
  ['Часто дёшево = плохо', 'https://tenchat.ru/media/3860469-chasto-deshevo--plokho'],
  ['Дооптимизировались: когда нейронки вредят, а не помогают', 'https://tenchat.ru/media/3856929-dooptimizirovalis-kogda-neyronki-vredyat-a-ne-pomogayut'],
  ['Нет продажников — кто виноват и что делать', 'https://tenchat.ru/media/3853330-net-prodazhnikov--kto-vinovat-i-chto-delat'],
  ['Ответьте, Бога ради! Или как пробиться к клиенту', 'https://tenchat.ru/media/3843713-otvette-boga-radi-ili-kak-probitsya-k-kliyentu'],
  ['ТОП-5 инструментов поддержки продаж', 'https://tenchat.ru/media/3827255-top5-instrumentov-podderzhki-prodazh-na-segodnya'],
  ['Как мы бустанули узнаваемость эндаумент-фонда', 'https://tenchat.ru/media/3812250-kak-my-buuuustanuli-uznavayemost-endaumentfonda'],
  ['Когда предпринимателю важно замедлиться', 'https://tenchat.ru/media/3915138-kogda-predprinimatelyu-vazhno-zamedlitsya'],
  ['Зачем стартапам акселераторы — 5 неочевидных причин', 'https://tenchat.ru/media/3813952-zachem-startapam-akseleratory--5-neochevidnykh-prichin'],
  ['Так ли хорош Moscow Startup Summit, как его малюют', 'https://tenchat.ru/media/3864265-tak-li-khorosh-moscow-startup-summit-kak-yego-malyuyut'],
  ['Как не попасть под запрет пропаганды ЛГБТ в 2025 году', 'https://tenchat.ru/media/3808184-kak-ne-popast-pod-zapret-propagandy-lgbt-v-2025-godu'],
];

const faq = [
  {
    question: 'Почему обычной презентации бывает недостаточно?',
    answer: 'Презентация хранит факты, но не всегда управляет последовательностью внимания. Ролик фиксирует темп, причинно-следственные связи, визуальные акценты и эмоциональный маршрут зрителя. При этом презентация остаётся полезной для деталей после первого понимания.',
  },
  {
    question: 'Любая анимация повышает запоминаемость?',
    answer: 'Нет. Декоративное движение может перегрузить восприятие. Работает спроектированный мультимедийный материал: нужные слова и изображения синхронизированы, лишнее убрано, а драматургия ведёт к конкретному выводу.',
  },
  {
    question: 'Как мультформат помогает отделу продаж?',
    answer: 'Он закрепляет лучший сценарий объяснения продукта. Его можно отправить до звонка, показать на встрече и повторить в follow-up. Менеджер тратит время на диалог и диагностику задачи, а не каждый раз заново собирает базовое объяснение.',
  },
  {
    question: 'Подходит ли этот подход для фармы, MedTech и охраны труда?',
    answer: 'Да, особенно там, где важны точность и цена непонимания. Но содержание должен проверить профильный эксперт или валидатор клиента. Визуальный материал усиливает обязательные процедуры и доказательную коммуникацию, а не подменяет их.',
  },
  {
    question: 'Как понять, что ролик сработал?',
    answer: 'Метрика зависит от точки применения: досмотры и удержание, переходы к демо, качество лидов, скорость объяснения, прохождение теста, число повторных вопросов или использование материала менеджерами. Метрики фиксируем до сценария.',
  },
];

function LazyShowreel() {
  const [started, setStarted] = useState(false);

  return (
    <div className="why-video">
      <div className="why-video__frame">
        {started ? (
          <iframe
            src={SHOWREEL.embed}
            width="1280"
            height="720"
            title="Showreel Anix: мультформат и анимация для сложных бизнес-задач"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
            frameBorder="0"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" onClick={() => setStarted(true)} aria-label="Смотреть showreel Anix">
            <picture>
              <source
                type="image/webp"
                srcSet={`${publicAsset('/optimized/showreel-640.webp')} 640w, ${publicAsset('/optimized/showreel-960.webp')} 960w, ${publicAsset('/optimized/showreel-1344.webp')} 1344w`}
                sizes="(max-width: 760px) 92vw, 78vw"
              />
              <img
                src={publicAsset('/optimized/showreel-960.webp')}
                alt="Кадры анимационных и AI-проектов Anix"
                width="1342"
                height="752"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <span className="why-video__play"><Play aria-hidden="true" /></span>
            <span className="why-video__label">Смотреть showreel</span>
          </button>
        )}
      </div>
      <a href={SHOWREEL.external} target="_blank" rel="noreferrer">
        Открыть во VK Видео <ExternalLink aria-hidden="true" />
      </a>
    </div>
  );
}

function InternalLink({ href, className, children }) {
  return <a className={className} href={toPublicHref(href)}>{children}</a>;
}

export default function WhyItWorksPage() {
  return (
    <main className="why-page">
      <header className="why-header">
        <InternalLink href="/" className="why-header__logo">
          <BrandLogo alt="Anix Studio" width={120} height={44} />
        </InternalLink>
        <nav aria-label="Навигация страницы «Почему это работает»">
          <a href="#science">Исследования</a>
          <a href="#mechanics">Механика</a>
          <a href="#tasks">Задачи</a>
          <a href="#articles">Статьи</a>
        </nav>
        <a className="why-header__cta" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
          Обсудить задачу
        </a>
      </header>

      <section className="why-hero">
        <div className="why-hero__copy">
          <p className="why-eyebrow">Почему мультформат работает</p>
          <h1>История делает сложное понятным. Визуал делает его видимым.</h1>
          <p className="why-hero__lead">
            Anix соединяет драматургию, анимацию, дизайн, звук и точную работу
            со смыслом. Так сложный продукт, правило или научная идея проходят
            путь от первого внимания до понимания и действия.
          </p>
          <div className="why-hero__actions">
            <a className="why-button why-button--primary" href={TELEGRAM_URL} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" /> Обсудить проект
            </a>
            <InternalLink className="why-button" href="/cases">
              Смотреть кейсы <ArrowRight aria-hidden="true" />
            </InternalLink>
          </div>
        </div>

        <div className="why-hero__visual" aria-label="Примеры визуальных миров Anix">
          <figure className="why-hero-card why-hero-card--main">
            <img src={aviandrImage} alt="Визуальный мир фармацевтического проекта Авиандр" width="1920" height="1080" fetchPriority="high" decoding="async" />
            <figcaption>Научная логика → история</figcaption>
          </figure>
          <figure className="why-hero-card why-hero-card--left">
            <img src={tpesImage} alt="Кейс промышленного B2B-продукта ТПЭС" width="1200" height="675" decoding="async" />
            <figcaption>Технология → понятная проблема</figcaption>
          </figure>
          <figure className="why-hero-card why-hero-card--right">
            <img src={multonImage} alt="Маскот проекта по охране труда Мултон Партнерс" width="1200" height="675" decoding="async" />
            <figcaption>Правило → герой</figcaption>
          </figure>
        </div>
      </section>

      <section className="why-section why-science" id="science">
        <div className="why-section__head">
          <p className="why-eyebrow">Доказательная база</p>
          <h2>Не «люди любят мультики». Работают конкретные механизмы.</h2>
          <p>
            Исследования поддерживают пользу повествования и сочетания слов с
            изображениями. Но сами по себе движение и яркость ничего не гарантируют:
            материал должен быть собран под восприятие человека.
          </p>
        </div>
        <div className="why-science__grid">
          {science.map((item) => (
            <article key={item.value}>
              <strong>{item.value}</strong>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.source} <ExternalLink aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <p className="why-science__note">
          Важная оговорка: цифры описывают результаты конкретных исследований и
          образовательных материалов, а не обещают одинаковый рост бизнес-метрик в каждом проекте.
        </p>
      </section>

      <section className="why-section why-mechanics" id="mechanics">
        <div className="why-section__head why-section__head--split">
          <div>
            <p className="why-eyebrow">Механика воздействия</p>
            <h2>Четыре перехода, которые должен пройти зритель</h2>
          </div>
          <p>
            Хороший ролик — не контейнер для всех фактов. Это управляемый маршрут,
            где каждый кадр помогает перейти к следующему состоянию.
          </p>
        </div>
        <ol className="why-mechanics__flow">
          {mechanics.map(({ icon: Icon, ...item }) => (
            <li key={item.number}>
              <div className="why-mechanics__number">{item.number}</div>
              <Icon aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="why-section why-story">
        <div className="why-story__statement">
          <p className="why-eyebrow">Почему нужна драматургия</p>
          <h2>Анимация без истории — просто движущаяся презентация.</h2>
          <p>
            Мы не «оживляем текст». Сначала понимаем конфликт зрителя с темой,
            затем строим сценарий и только после этого выбираем визуальный язык.
          </p>
        </div>
        <div className="why-story__ingredients">
          {storyIngredients.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <CheckCircle2 aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="why-section why-video-section">
        <div className="why-section__head why-section__head--split">
          <div>
            <p className="why-eyebrow">Мультформат в работе</p>
            <h2>Один смысл. Разные визуальные языки.</h2>
          </div>
          <p>
            2D-анимация, AI-видео, моушн, маскоты, научная визуализация и mixed media —
            не список услуг, а инструменты под конкретную задачу зрителя.
          </p>
        </div>
        <LazyShowreel />
      </section>

      <section className="why-section why-tasks" id="tasks">
        <div className="why-section__head">
          <p className="why-eyebrow">Где это даёт бизнесу пользу</p>
          <h2>Чем выше цена непонимания, тем ценнее ясная история</h2>
          <p>
            По аналитике Anix самые сильные сценарии возникают там, где продукт
            невидим, процесс сложен, сообщение нужно повторять, а ошибка дорого стоит.
          </p>
        </div>
        <div className="why-tasks__grid">
          {businessTasks.map(({ icon: Icon, ...item }) => (
            <article key={item.title}>
              <div className="why-tasks__icon"><Icon aria-hidden="true" /></div>
              <p className="why-eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <InternalLink href={item.href}>
                {item.link} <ArrowRight aria-hidden="true" />
              </InternalLink>
            </article>
          ))}
        </div>
      </section>

      <section className="why-section why-cases">
        <div className="why-section__head why-section__head--split">
          <div>
            <p className="why-eyebrow">Как это выглядит в проектах</p>
            <h2>Не теория отдельно. Не кейсы отдельно.</h2>
          </div>
          <InternalLink href="/cases" className="why-text-link">
            Все кейсы <ArrowRight aria-hidden="true" />
          </InternalLink>
        </div>
        <div className="why-cases__grid">
          {cases.map((item) => (
            <InternalLink className="why-case" href={item.href} key={item.title}>
              <div className="why-case__media">
                <img src={item.image} alt={`Кейс Anix: ${item.title}`} width="1200" height="675" loading="lazy" decoding="async" />
              </div>
              <div className="why-case__body">
                <span>{item.title}</span>
                <h3>{item.result}</h3>
                <p>{item.text}</p>
                <strong>Смотреть кейс <ArrowRight aria-hidden="true" /></strong>
              </div>
            </InternalLink>
          ))}
        </div>
      </section>

      <section className="why-section why-articles" id="articles">
        <div className="why-section__head">
          <p className="why-eyebrow">Практика и наблюдения</p>
          <h2>Саша пишет о продажах, внимании и сложных продуктах</h2>
          <p>
            Не абстрактный SEO-блог, а заметки CEO Anix из реальных проектов,
            выставок, стартапов и разговоров с командами продаж.
          </p>
        </div>
        <div className="why-articles__featured">
          {featuredArticles.map((item) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.href}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>Читать в TenChat <ExternalLink aria-hidden="true" /></strong>
            </a>
          ))}
        </div>
        <div className="why-articles__more">
          <div>
            <BookOpen aria-hidden="true" />
            <h3>Ещё 13 разборов</h3>
            <p>Продажи, продукт, подрядчики, AI-контент и жизнь фаундера.</p>
          </div>
          <div className="why-articles__links">
            {moreArticles.map(([title, href]) => (
              <a href={href} target="_blank" rel="noreferrer" key={href}>
                {title} <ArrowRight aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="why-section why-faq">
        <div className="why-section__head why-section__head--split">
          <div>
            <p className="why-eyebrow">Коротко о главном</p>
            <h2>Вопросы о мультформате и бизнес-задачах</h2>
          </div>
          <Workflow aria-hidden="true" />
        </div>
        <div className="why-faq__list">
          {faq.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true">+</span></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="why-final">
        <div>
          <p className="why-eyebrow">Есть сложная тема?</p>
          <h2>Давайте найдём историю, после которой её поймут.</h2>
        </div>
        <div>
          <p>
            Покажите продукт, правило, исследование или презентацию. Мы разберём,
            где теряется понимание, и предложим формат под реальную точку применения.
          </p>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" /> Обсудить задачу
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
