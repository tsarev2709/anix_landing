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
    title: 'Историю вспомнят быстрее, чем список фактов',
    text: 'Эту цифру приводит Дженнифер Аакер в материалах Stanford. Речь не про волшебную силу любого сюжета. Истории нужен герой, цель и причина досмотреть до конца.',
    source: 'Stanford / Jennifer Aaker',
    href: 'https://womensleadership.stanford.edu/tools-resources/voice-influence/harnessing-power-stories',
  },
  {
    value: '33 000+',
    title: '33 000 человек в исследованиях нарратива',
    text: 'Метаанализ собрал больше 75 выборок. В среднем повествовательные тексты люди понимали и вспоминали лучше, чем обычные объяснения.',
    source: 'Memory & Cognition / PubMed',
    href: 'https://pubmed.ncbi.nlm.nih.gov/33410100/',
  },
  {
    value: '1,50',
    title: 'Показать часто полезнее, чем ещё раз объяснить',
    text: 'В девяти исследованиях люди лучше переносили знания на новые задачи, когда слышали объяснение и одновременно видели, как всё устроено.',
    source: 'Cambridge Handbook of Multimedia Learning',
    href: 'https://assets.cambridge.org/052183/8738/excerpt/0521838738_excerpt.htm',
  },
];

const mechanics = [
  {
    number: '01',
    icon: Eye,
    title: 'Зацепить',
    text: 'Зритель узнаёт свою ситуацию, видит конфликт или неожиданную деталь и решает: ладно, смотрю дальше.',
  },
  {
    number: '02',
    icon: Lightbulb,
    title: 'Разобраться',
    text: 'На экране видно, что происходит, где начинается проблема и в какой момент продукт меняет ход событий.',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Запомнить',
    text: 'У идеи появляется образ, у фактов — порядок. Потом эту логику можно восстановить без шпаргалки на 50 слайдов.',
  },
  {
    number: '04',
    icon: Target,
    title: 'Сделать следующий шаг',
    text: 'Запросить демо. Обсудить пилот. Применить правило на производстве. Или наконец нормально пересказать идею коллеге.',
  },
];

const storyIngredients = [
  ['Результат', 'Сначала решаем, что человек должен унести с собой после просмотра.'],
  ['Первый интерес', 'Находим сцену или вопрос, ради которого хочется остаться ещё на несколько секунд.'],
  ['Герой', 'Зрителю нужен тот, за кем можно следить. Даже если герой ролика — молекула или станок.'],
  ['Изменение', 'Было трудно, что-то произошло, стало иначе. Без этого история стоит на месте.'],
  ['Что именно показать', 'Механику, процесс и последствия лучше один раз увидеть, чем трижды услышать.'],
  ['Ритм', 'Сложную мысль выдаём порциями. Где нужно — ускоряемся. Где нужно — даём рассмотреть.'],
];

const businessTasks = [
  {
    icon: Presentation,
    eyebrow: 'Продажи / B2B',
    title: 'Объяснить продукт, пока встреча не закончилась',
    text: 'Один сильный сценарий можно использовать на питче, демо и после звонка. Продавцу не приходится каждый раз собирать объяснение заново.',
    href: '/cases/b2b',
    link: 'Кейсы сложных продуктов',
  },
  {
    icon: Stethoscope,
    eyebrow: 'Pharma / MedTech',
    title: 'Показать то, чего камера не видит',
    text: 'Молекулу, рецептор, путь пациента или работу диагностической системы можно разобрать по шагам и показать без каши на экране.',
    href: '/medicine',
    link: 'Подход для медицины',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'HSE / Onboarding',
    title: 'Чтобы правило не закончилось на инструктаже',
    text: 'Сотрудник видит ситуацию, риск и правильное действие. Потом проходит проверку, а не просто ставит подпись под длинным текстом.',
    href: '/hse',
    link: 'Решения для охраны труда',
  },
  {
    icon: Sparkles,
    eyebrow: 'Бренд / События',
    title: 'Вытащить идею из шума',
    text: 'На выставке вокруг ещё двадцать экранов. Персонаж, история и узнаваемая картинка дают человеку повод остановиться именно у вашего.',
    href: '/cases',
    link: 'Все кейсы Anix',
  },
];

const cases = [
  {
    title: 'ТПЭС',
    result: 'Вместо 50 слайдов — одна история',
    text: 'Фаундер перестал начинать встречу с устройства технологии. Сначала мы показали проблему, которую она решает для завода.',
    image: tpesImage,
    href: '/cases/tpes',
  },
  {
    title: 'Clappy',
    result: 'Clappy стало проще объяснять двум аудиториям',
    text: 'Покупатель увидел свой сценарий использования. Производитель — зачем ему подключать продукт к своим продажам.',
    image: clappyImage,
    href: '/cases/clappy',
  },
  {
    title: 'Авиандр',
    result: 'У доказательной базы появились герои',
    text: 'Врачебную аудиторию не стали развлекать ради развлечения. Спокойно показали научную логику через мир Доктора Коалы и Авиандра.',
    image: aviandrImage,
    href: '/cases/aviandr',
  },
  {
    title: 'Мултон Партнерс',
    result: 'Правила заговорили голосом одного героя',
    text: 'Маскот возвращает сотрудников к безопасности между инструктажами и связывает разные темы в одну систему.',
    image: multonImage,
    href: '/cases/multon-partners',
  },
  {
    title: 'Hemotech AI',
    result: 'Диагностика без перегруза терминами',
    text: 'Мы начали с пути пользователя и только потом показали технологию. Так у MedTech-продукта появилась ясная точка входа.',
    image: hemotechImage,
    href: '/cases/hemotech-ai',
  },
  {
    title: 'Эндаумент-фонд МФТИ',
    result: 'Про фонд начали говорить через ролик',
    text: 'Персонажи и сюжет превратили сложную тему эндаумента в материал, которым хотелось делиться дальше.',
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
    answer: 'В презентации темп задаёт тот, кто её показывает. Если файл отправили без человека, зритель легко перескочит важный слайд или вообще не поймёт, с чего начинать. Ролик проводит его по мысли в нужном порядке. А презентация потом отлично работает для деталей.',
  },
  {
    question: 'Любая анимация повышает запоминаемость?',
    answer: 'Нет. Можно заставить двигаться вообще всё и получить дорогой визуальный шум. Запоминается материал, где слова и изображение помогают друг другу, а у зрителя есть понятная причина досмотреть.',
  },
  {
    question: 'Как мультформат помогает отделу продаж?',
    answer: 'Команда получает одно сильное объяснение вместо пяти версий от пяти менеджеров. Ролик можно отправить до звонка, показать на встрече и приложить после неё. Сам разговор остаётся для вопросов клиента и продажи.',
  },
  {
    question: 'Подходит ли этот подход для фармы, MedTech и охраны труда?',
    answer: 'Да. Там как раз много невидимых процессов, сложных терминов и высокая цена ошибки. Научную и нормативную часть проверяет профильный эксперт клиента, а мы отвечаем за то, чтобы её можно было понять с экрана.',
  },
  {
    question: 'Как понять, что ролик сработал?',
    answer: 'Смотрим, где ролик работает. В рекламе это удержание и переходы. В продажах — заявки, качество лидов и скорость объяснения. В обучении — результаты теста и число повторных ошибок. Метрику выбираем до сценария, иначе после запуска можно доказать вообще что угодно.',
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
          <h1>Мозг любит истории. Особенно когда всё сложно.</h1>
          <p className="why-hero__lead">
            Когда продукт приходится объяснять пятнадцать минут, обычно теряется
            не смысл, а человек. Мы собираем материал так, чтобы зритель быстро
            понял, что происходит, увидел пользу и запомнил главное.
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
          <h2>Почему это вообще работает</h2>
          <p>
            Человеку проще следить за событием, чем держать в голове россыпь
            фактов. Процесс легче понять, когда видно причинность. А у мысли с
            хорошим образом больше шансов остаться в памяти.
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
          Это результаты конкретных исследований, а не обещание умножить любую
          бизнес-метрику на 22. Плохой сценарий цифра из Stanford не спасёт.
        </p>
      </section>

      <section className="why-section why-mechanics" id="mechanics">
        <div className="why-section__head why-section__head--split">
          <div>
            <p className="why-eyebrow">Механика воздействия</p>
            <h2>Сначала зацепить. Потом объяснить.</h2>
          </div>
          <p>
            Если ролик пытается сразу рассказать всё, зритель получает свалку
            фактов. Поэтому мы собираем понятный маршрут из четырёх шагов.
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
          <h2>Без драматургии получается PowerPoint, который научился двигаться.</h2>
          <p>
            Можно оживить каждый заголовок, добавить персонажа и музыку. Но если
            непонятно, за кем следить и зачем, останется красивая свалка фактов.
            Поэтому сначала ищем конфликт и логику. Потом рисуем.
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
            <h2>По-разному. Но всегда по задаче.</h2>
          </div>
          <p>
            Где-то нужен 2D-персонаж, где-то научная схема, AI-видео или смешанная
            техника. Сначала смотрим, что нужно показать и кому. Потом выбираем форму.
          </p>
        </div>
        <LazyShowreel />
      </section>

      <section className="why-section why-tasks" id="tasks">
        <div className="why-section__head">
          <p className="why-eyebrow">Где это даёт бизнесу пользу</p>
          <h2>Где объяснение реально стоит денег</h2>
          <p>
            Продавец полчаса объясняет технологию. Врач не успевает разобраться в
            механизме. Сотрудник подписывает инструктаж и делает по привычке. Во
            всех трёх случаях проблема одна: важное осталось непонятным.
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
            <h2>Вот что менялось у клиентов</h2>
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
          <h2>Саша пишет о продажах. Без бодрого инфобизнеса.</h2>
          <p>
            Здесь разборы наших проектов, провальных разговоров, выставок,
            стартапов и ситуаций, когда хороший продукт почему-то не продаётся.
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
            <p>Продажи, продукт, подрядчики, AI-контент и нормальная жизнь фаундера между всем этим.</p>
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
            <h2>Вопросы, которые нам задают</h2>
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
          <h2>Покажите, что вам приходится долго объяснять.</h2>
        </div>
        <div>
          <p>
            Мы посмотрим, где человек обычно теряется, и предложим, что с этим
            сделать: ролик, серия, маскот или другой визуальный формат.
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
