import React, { useState, useEffect, useRef, Suspense } from 'react';
import './App.css';
import Section from './components/Section';
import LiteVimeo from './components/LiteVimeo';
const AnixLandingPage = React.lazy(
  () => import('./components/AnixLandingPage')
);
import god from './images/god.jpg';
import bestie from './images/bestie.jpg';
import vanya from './images/vanya.JPG';
import sber from './images/sber.png';
import yandex from './images/yandex.png';
import inno from './images/inno.png';
import moscow from './images/moscow.png';
import fiztech from './images/fiztech.png';
import clappy from './images/clappy.png';
import hemoai from './images/hemoai.png';
import kolbox from './images/kolbox.png';
import lida from './images/lida.jpg';
import dasha from './images/dasha.jpg';
import TPES from './images/TPES.png';
const BlogCard = React.lazy(() => import('./components/BlogCard'));
const CookieBanner = React.lazy(() => import('./components/CookieBanner'));

// Helper for responsive img attributes
const makeSrcSet = (src) => `${src} 1x, ${src} 2x`;
const responsiveSizes = '(max-width: 768px) 100vw, 600px';

const AnixAILanding = () => {
  const translations = {
    ru: {
      heroTitle:
        'Креативные видео, которые повышают ваши продажи уже в первый месяц',
      heroSubtitle:
        'Мы объясняем ваши сложные продукты простым визуальным языком, который удерживает внимание, пробивает баннерную слепоту и улучшает конверсию на всех этапах воронки. Быстро, точно и под вашу цель.',
      heroCTA: 'Получить анализ вашей воронки и 3 точки роста за 15 минут',
      heroBenefits: [
        {
          title: 'Анализируем воронку',
          description:
            'Делаем сценарий, который решает конкретную бизнес-боль.',
        },
        {
          title: 'Видео, созданное инженерно',
          description: 'Драматургия + нейросети + композиция.',
        },
        {
          title: 'Результат за 3,7 дня',
          description: 'Без артефактов и с высокой визуальной точностью.',
        },
        {
          title: '+15-25% конверсии',
          description: 'Средний прирост у клиентов.',
        },
      ],
      ctaFullTitle: 'Получите анализ вашей воронки ➜ 3 точки роста за 15 минут',
      ctaFullSubtitle:
        'Мы разберем вашу текущую коммуникацию, найдем узкие места и предложим решение с прогнозом, как изменится конверсия после внедрения видео.',
      formNameLabel: 'Имя',
      formContactLabel: 'Телефон / Telegram',
      formProductLabel: 'Опишите ваш продукт в 1-2 предложениях',
      formProductPlaceholder:
        'Кто ваша аудитория и какую задачу решает продукт',
      formSubmit: 'Получить анализ бесплатно',
      audienceTitle: 'К кому мы подходим',
      audienceSubtitle:
        'Мы работаем там, где продукт сложный, объяснения важнее эстетики',
      audienceCards: [
        {
          title: 'Компании с комплексными B2B-решениями',
          items: [
            'Технологические компании',
            'IT-продукты и SaaS',
            'Фарма, биотех',
            'Финтех',
            'Логистика и промышленность',
          ],
          theme: 'violet',
        },
        {
          title: 'Команды, выходящие на рост и инвестиции',
          items: ['Стартапы', 'Гранты', 'Акселераторы'],
          theme: 'green',
        },
        {
          title: 'Корпоративные подразделения, которым важно объяснять',
          items: ['PR-отделы', 'Отделы продаж', 'Маркетинг'],
          theme: 'amber',
        },
      ],
      teamTitle: 'Команда, которая продаёт вместо вас',
      technologyTitleLines: [
        'Технологии Anix',
        'которые делают ваш проект быстрее и лучше',
      ],
      technologyFeatures: [
        {
          title: 'Собственная нейросеть Anix',
          description:
            'Модульная генерация кадров с контролем стиля и динамики.',
          icon: '🧠',
          size: 'large',
        },
        {
          title: 'Поиск и исправление артефактов',
          description:
            'Скрипты для очистки, inpainting и правок без ручного ретуша.',
          icon: '🛠️',
        },
        {
          title: 'Ускорение продакшена',
          description:
            'Пайплайны, которые сокращают сборку ролика с недель до дней.',
          icon: '⚡',
        },
        {
          title: 'Контроль качества',
          description:
            'Алгоритмы, отслеживающие целостность анимации и деталей.',
          icon: '🛰️',
        },
        {
          title: 'Композиция и цвет',
          description: 'Физичная глубина, CG-эффекты и тонкая работа с цветом.',
          icon: '🎛️',
        },
      ],
      riskTitle: 'Снимаем риски до старта',
      riskBullets: [
        {
          title: 'Не сработает?',
          description: 'Показываем сегментные кейсы',
          link: '#cases',
        },
        {
          title: 'Дорого?',
          description: 'Видео — актив, который работает месяцами.',
        },
        {
          title: 'Для моего рынка подходит?',
          description: 'Делаем видео для сложных сегментов.',
        },
        {
          title: 'Нет времени?',
          description: 'Собираем ролики за 3–7 дней.',
        },
      ],
      pricingTitle:
        'Прозрачный и честный: стоимость зависит только от вашей задачи',
      pricingText:
        'Средний проект стоит от 400 до 900 тысяч рублей. Для крупных компаний — помесячная работа. Есть быстрые форматы.',
      pricingCTA: 'Получить точный расчёт стоимости',
      finalCTATitle:
        'Получите анализ вашей воронки, росты конверсий за 15 минут',
      finalCTADescription:
        'Форма как в первом блоке: оставьте контакты, расскажите о продукте — мы вернёмся с точками роста.',
      subscribeTitle: 'Хотите видеть, как мы собираем видео изнутри?',
      subscribeSubtitle:
        'В Telegram — backstage, советы и примеры лучших роликов Anix',
      subscribeCTA: '💬 Подписаться в Telegram → @anixpro',
      subscribeNote:
        'Перейдёте в наш Telegram-канал с бэкстейджем, советами и примерами лучших роликов.',
      salesVideoTitle: 'Видео, которое помогает продавать',
      ndaTitle: 'Что мы уже сделали (и не всегда можем назвать)',
    },
    en: {
      heroTitle: 'Creative videos that boost your sales from month one',
      heroSubtitle:
        'We explain complex products with clear visuals that keep attention, fight banner blindness, and improve conversion across the funnel. Fast, precise, and goal-focused.',
      heroCTA: 'Get a funnel audit and 3 growth points in 15 minutes',
      heroBenefits: [
        {
          title: 'We audit the funnel',
          description:
            'We craft a script that solves a concrete business pain.',
        },
        {
          title: 'Engineering-first videos',
          description: 'Storytelling + neural networks + composition.',
        },
        {
          title: 'Results in 3–7 days',
          description: 'No artifacts and with high visual accuracy.',
        },
        {
          title: '+15–25% conversion',
          description: 'Average uplift for our clients.',
        },
      ],
      ctaFullTitle: 'Get a funnel audit ➜ 3 growth ideas in 15 minutes',
      ctaFullSubtitle:
        'We review your communication, find bottlenecks, and propose a solution with an expected conversion impact.',
      formNameLabel: 'Name',
      formContactLabel: 'Phone / Telegram',
      formProductLabel: 'Describe your product in 1–2 sentences',
      formProductPlaceholder:
        'Who is your audience and what problem do you solve?',
      formSubmit: 'Get the audit for free',
      audienceTitle: 'Who we are a fit for',
      audienceSubtitle:
        'We work where products are complex and clarity matters more than pure aesthetics',
      audienceCards: [
        {
          title: 'Companies with complex B2B solutions',
          items: [
            'Technology companies',
            'IT products and SaaS',
            'Pharma and biotech',
            'Fintech',
            'Logistics and manufacturing',
          ],
          theme: 'violet',
        },
        {
          title: 'Teams aiming for growth and investment',
          items: ['Startups', 'Grants', 'Accelerators'],
          theme: 'green',
        },
        {
          title: 'Corporate teams that need clear explanations',
          items: ['PR departments', 'Sales teams', 'Marketing'],
          theme: 'amber',
        },
      ],
      teamTitle: 'A team that sells instead of you',
      technologyTitleLines: [
        'Anix Technologies',
        'built to make your project faster and better',
      ],
      technologyFeatures: [
        {
          title: 'Proprietary Anix neural network',
          description:
            'Modular frame generation with controllable style and motion.',
          icon: '🧠',
          size: 'large',
        },
        {
          title: 'Artifact detection and fixing',
          description:
            'Scripts for cleanup, inpainting, and corrections without manual retouch.',
          icon: '🛠️',
        },
        {
          title: 'Production acceleration',
          description:
            'Pipelines that cut video assembly from weeks down to days.',
          icon: '⚡',
        },
        {
          title: 'Quality control',
          description:
            'Algorithms tracking animation integrity and fine details.',
          icon: '🛰️',
        },
        {
          title: 'Compositing and color',
          description: 'Physical depth, CG effects, and precise color work.',
          icon: '🎛️',
        },
      ],
      riskTitle: 'De-risking before launch',
      riskBullets: [
        {
          title: "Won't work?",
          description: 'We show segment-specific cases',
          link: '#cases',
        },
        {
          title: 'Too expensive?',
          description: 'Video is an asset that works for months.',
        },
        {
          title: 'Will it fit my market?',
          description: 'We build videos for complex segments.',
        },
        {
          title: 'No time?',
          description: 'We deliver in 3–7 days.',
        },
      ],
      pricingTitle: 'Transparent and fair: pricing depends only on your task',
      pricingText:
        'An average project costs 400–900k RUB. For large companies we work month-to-month. Fast-track formats are available.',
      pricingCTA: 'Get an exact quote',
      finalCTATitle:
        'Get a funnel audit and conversion growth plan in 15 minutes',
      finalCTADescription:
        'Same form as the first CTA: leave contacts and product details — we will reply with growth points.',
      subscribeTitle: 'Want to see how we assemble videos from the inside?',
      subscribeSubtitle:
        'Telegram has backstage, tips, and the best Anix video examples',
      subscribeCTA: '💬 Subscribe on Telegram → @anixpro',
      subscribeNote:
        'You will jump to our Telegram channel with backstage, tips, and top videos.',
      salesVideoTitle: 'A video that helps you sell',
      ndaTitle: 'What we have already built (even under NDA)',
    },
  };

  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(-1);
  const [counters, setCounters] = useState({ projects: 0, hours: 0 });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [processInView, setProcessInView] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const [isPageBlurred, setIsPageBlurred] = useState(false);
  const processRef = useRef(null);
  const awardsScrollRef = useRef(null);
  const swipeStart = useRef(0);
  const [activeService, setActiveService] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [language, setLanguage] = useState('ru');
  const isEnglish = language === 'en';
  const t = (ru, en) => (isEnglish ? en : ru);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Lead magnet popup removed

  const handleTouchStart = (e) => {
    swipeStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - swipeStart.current;
    if (deltaX > 50) scrollAwards('left');
    if (deltaX < -50) scrollAwards('right');
  };

  const handleMouseDown = (e) => {
    swipeStart.current = e.clientX;
  };

  const handleMouseUp = (e) => {
    const deltaX = e.clientX - swipeStart.current;
    if (deltaX > 50) scrollAwards('left');
    if (deltaX < -50) scrollAwards('right');
  };

  // Animated counter effect
  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000;
      const projectsTarget = 150;
      const hoursTarget = 5000;

      const startTime = Date.now();

      const updateCounters = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCounters({
          projects: Math.floor(projectsTarget * easeOut),
          hours: Math.floor(hoursTarget * easeOut),
        });

        if (progress < 1) {
          requestAnimationFrame(updateCounters);
        }
      };

      updateCounters();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    });

    if (processRef.current) {
      observer.observe(processRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced Process Animation System
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !processStarted) {
            setProcessInView(true);
            setProcessStarted(true);

            // Reset and start the animation sequence
            setCurrentStep(-1);

            const startProcessAnimation = () => {
              // Initial delay before starting
              setTimeout(() => {
                let stepIndex = 0;

                const animateStep = () => {
                  if (stepIndex < processSteps.length) {
                    setCurrentStep(stepIndex);
                    stepIndex++;

                    // Longer delay between steps for dramatic effect
                    setTimeout(animateStep, 2000);
                  }
                };

                animateStep();
              }, 800);
            };

            startProcessAnimation();
          }
        });
      },
      { threshold: 0.2 }
    );

    if (processRef.current) {
      observer.observe(processRef.current);
    }

    return () => observer.disconnect();
  }, [processStarted]);

  // Process steps with enhanced data
  const processSteps = [
    {
      title: t('Анализ Сценария', 'Script analysis'),
      icon: '📝',
      description: t(
        'ИИ анализирует ваш бриф и создает увлекательное повествование',
        'AI reviews your brief and builds a compelling storyline'
      ),
      time: t('2 часа', '2 hours'),
      saved: '75%',
      details: [
        t('Обработка брифа', 'Brief processing'),
        t('Анализ целевой аудитории', 'Target audience analysis'),
        t('Оптимизация сценария', 'Script optimization'),
      ],
      color: '#8b45ff',
      bgGradient: 'linear-gradient(135deg, #8b45ff, #b465ff)',
    },
    {
      title: t('Генерация Ключевых Кадров', 'Key frame generation'),
      icon: '🎯',
      description: t(
        'Нейронные сети автоматически генерируют идеальные ключевые кадры',
        'Neural networks auto-generate precise key frames'
      ),
      time: t('4 часа', '4 hours'),
      saved: '60%',
      details: [
        t(
          'Автоматическое создание ключевых кадров',
          'Automatic key frame creation'
        ),
        t('Визуальная композиция', 'Visual composition'),
        t('Оптимизация тайминга', 'Timing optimization'),
      ],
      color: '#20b2aa',
      bgGradient: 'linear-gradient(135deg, #20b2aa, #48cae4)',
    },
    {
      title: t('ИИ Анимация', 'AI animation'),
      icon: '🤖',
      description: t(
        'Продвинутый ИИ создает плавную, профессиональную анимацию',
        'Advanced AI builds smooth, professional animation'
      ),
      time: t('1 час', '1 hour'),
      saved: '90%',
      details: [
        t('Нейронный рендеринг', 'Neural rendering'),
        t('Синтез движения', 'Motion synthesis'),
        t('Перенос стиля', 'Style transfer'),
      ],
      color: '#ff7f50',
      bgGradient: 'linear-gradient(135deg, #ff7f50, #ff9a76)',
    },
    {
      title: t('Улучшение', 'Enhancement'),
      icon: '⚡',
      description: t(
        'ИИ улучшает качество и добавляет финальные штрихи',
        'AI polishes quality and adds final touches'
      ),
      time: t('30 мин', '30 min'),
      saved: '85%',
      details: [
        t('Улучшение качества', 'Quality enhancement'),
        t('Цветокоррекция', 'Color grading'),
        t('Обработка эффектов', 'Effects processing'),
      ],
      color: '#9d4edd',
      bgGradient: 'linear-gradient(135deg, #9d4edd, #c77dff)',
    },
    {
      title: t('Доставка', 'Delivery'),
      icon: '📊',
      description: t(
        'Финальная оптимизация и интеграция аналитики',
        'Final optimization and analytics integration'
      ),
      time: t('15 мин', '15 min'),
      saved: '95%',
      details: [
        t('Оптимизация форматов', 'Format optimization'),
        t('Настройка аналитики', 'Analytics setup'),
        t('Отслеживание производительности', 'Performance tracking'),
      ],
      color: '#06ffa5',
      bgGradient: 'linear-gradient(135deg, #06ffa5, #39ff14)',
    },
  ];

  const teamMembers = [
    {
      name: 'Андрей Царёв',
      role: 'Стратег и продюсер B2B-видео',
      roleEn: 'B2B video strategist and producer',
      benefit: 'Понимает рынок, превращает суть в продающий аргумент',
      benefitEn:
        'Understands the market and turns essence into selling arguments',
      image: god,
      tags: ['B2B', 'Продуктовое позиционирование', 'Драматургия', 'Аналитика'],
      tagsEn: ['B2B', 'Product positioning', 'Storytelling', 'Analytics'],
    },
    {
      name: 'Александра Севостьянова',
      role: 'Сценарист-продажник и режиссёр',
      roleEn: 'Sales-focused scriptwriter and director',
      benefit: 'Превращает сложное в ясную и цепляющую подачу',
      benefitEn: 'Turns complexity into clear, engaging storytelling',
      image: bestie,
      tags: [
        'B2B-питчи',
        'Театральная режиссура',
        'Продажный текст',
        'Клиентские боли',
      ],
      tagsEn: [
        'B2B pitches',
        'Theatre directing',
        'Sales copy',
        'Customer pains',
      ],
    },
    {
      name: 'Иван Кухарук',
      role: 'Технический директор',
      roleEn: 'CTO',
      benefit: 'Проектирует процесс и следит, чтобы всё работало',
      benefitEn: 'Designs the process and keeps everything running',
      image: vanya,
      tags: [
        'Проджект-менеджмент',
        'Бизнес-анализ',
        'AI-интеграция',
        'Процесс',
      ],
      tagsEn: [
        'Project management',
        'Business analysis',
        'AI integration',
        'Process',
      ],
    },
    {
      name: 'Дарья Косичкина',
      role: 'Нейроаниматор',
      roleEn: 'Neuro-animator',
      benefit: 'Делает визуал, который объясняет и цепляет',
      benefitEn: 'Builds visuals that explain and hook',
      image: dasha,
      tags: [
        '2D-анимация',
        'Моушн-дизайн',
        'Визуальные метафоры',
        'Раскадровка',
      ],
      tagsEn: [
        '2D animation',
        'Motion design',
        'Visual metaphors',
        'Storyboarding',
      ],
    },
    {
      name: 'Лидия Солнышко',
      role: 'Нейроаниматор',
      roleEn: 'Neuro-animator',
      benefit: 'Собирает AI-видео, чтобы быстро и качественно',
      benefitEn: 'Assembles AI videos quickly and with quality',
      image: lida,
      tags: ['AI-видео', 'Постпродакшн', 'Алгоритмы', 'Motion pipeline'],
      tagsEn: ['AI video', 'Post-production', 'Algorithms', 'Motion pipeline'],
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Мария Воронова',
      company: 'CMO Kolobox',
      website: 'https://kolo-box.ru/',
      text: 'Запрос: объяснить продут пользователю быстро и просто. Результат: демо-просмотры выросли на 22%, ролик включили во все рекламные акции.',
      videoThumbnail: kolbox,
      videoUrl: 'https://player.vimeo.com/video/1078357836?h=a4d72de864',
      reach: 25,
      conversion: 18,
    },
    {
      id: 2,
      name: 'Дмитрий Потапов',
      company: 'генеральный директор ТПЭС',
      website: 'https://tpes-iest.com/',
      text: 'Запрос: произвести впечатление на консервативное производство и прогреть ЛПРов. Результат: конверсия встреч выросла на 35%, ролик показали на LED-экране стенда и в follow-up рассылке, собрали 12 стратегических созвонов.',
      videoThumbnail: TPES,
      videoUrl: 'https://player.vimeo.com/video/1078354208',
      reach: 30,
      conversion: 30,
    },
    {
      id: 3,
      name: 'Татьяна Куркина',
      company: 'CEO Clappy',
      website: 'https://clappy.ru/',
      text: 'Запрос: понятно рассказать про новое ЭКО решение без участия фаундера. Результат: конверсия лендинга выросла на 18%, ролик используют на питчах, демо и в онбординге партнёров.',
      videoThumbnail: clappy,
      videoUrl: 'https://player.vimeo.com/video/1078358379?h=8fc297f159',
      reach: 40,
      conversion: 16,
    },
    {
      id: 4,
      name: 'Екатерина Поликер',
      company: 'CEO Hemotech AI',
      website: 'https://hemotech.ai/',
      text: 'Запрос: показать ценность биотех-продукта врачам и инвесторам без сложной терминологии. Результат: конверсия холодных лидов выросла на 26%, ролик работает на сайте, в email-посеве и на отраслевых выставках.',
      textEn:
        'Goal: show biotech value to doctors and investors without complex jargon. Result: cold-lead conversion grew by 26%; the video works on the site, in email outreach, and at industry expos.',
      videoThumbnail: hemoai,
      videoUrl: 'https://player.vimeo.com/video/1078358021?h=afe067a81f',
      reach: 53,
      conversion: 22,
    },
    {
      id: 5,
      name: 'Светлана Красночуб',
      company: 'Исполнительный директор ФЦК МФТИ',
      companyEn: 'Executive Director, MIPT Endowment',
      website: 'https://fund.mipt.ru/',
      text: 'Запрос: собрать выпускников вокруг фонда и передать дух Физтеха. Результат: регистрации на мероприятие выросли на 45%, ролик транслируется на встречах спонсоров и в закрытых сообществах выпускников.',
      textEn:
        'Goal: rally alumni around the fund and convey the MIPT spirit. Result: event registrations grew by 45%; the video plays at sponsor meetings and in private alumni communities.',
      videoThumbnail: 'https://vumbnail.com/1102413873.jpg',
      videoUrl:
        'https://player.vimeo.com/video/1102413873?badge=0&autopause=0&player_id=0&app_id=58479',
      reach: 100,
      conversion: 10,
    },
    {
      id: 6,
      name: 'Алексей Лычке',
      company: 'Генеральный директор, Б в Кубе',
      companyEn: 'CEO, B v Kube',
      website: 'https://companiab.cu/',
      text: 'Запрос: выйти на новых клиентов в области охраны труда и донести ценность за 40 секунд. Результат: конверсия в заявки от франшизы выросла на 19%, ролик транслируется на интерактивных столах в шоуруме компании и в онлайн-демо, помог закрыть контракт с рядом предприятий.',
      textEn:
        'Goal: reach new occupational safety clients and deliver value in 40 seconds. Result: franchise application conversion grew by 19%; the video runs on interactive tables in the showroom and online demos, helping close deals with several enterprises.',
      videoThumbnail: 'https://vumbnail.com/1118064088.jpg',
      videoUrl: 'https://player.vimeo.com/video/1118064088',
      reach: 28,
      conversion: 19,
    },
  ];

  const conversionSteps = [
    {
      title: t('Анализируем воронку', 'We audit the funnel'),
      description: t(
        'Определяем, где видео даст максимальный прирост.',
        'We identify where video will create the biggest uplift.'
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <path
            d="M12 30.5V34a2 2 0 0 0 2 2h20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M20 14v12M28 18v8M36 22v4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 22.5c2-1.5 5-1.5 7 0s5 1.5 7 0 5-1.5 7 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
      ),
    },
    {
      title: t('Формируем сценарий', 'We craft the script'),
      description: t(
        'В формате решения боли аудитории.',
        'Built to address audience pain points.'
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <rect
            x="12"
            y="10"
            width="24"
            height="28"
            rx="3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M18 18h12M18 24h8M18 30h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M28 10v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
    },
    {
      title: t('Делаем визуализацию', 'We build visuals'),
      description: t(
        'Которая удерживает внимание.',
        'That keeps the audience engaged.'
      ),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <circle
            cx="24"
            cy="24"
            r="12"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M18 24.5h4l2 3 2-7 2 4h4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 14 10 10M34 14l4-4M14 34l-4 4M34 34l4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: t('Используем нейросети', 'We use neural networks'),
      description: t('Там, где нужен темп.', 'Where speed is critical.'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
          <path d="m22 6-8 18h8l-4 18 14-22h-8l6-14H22Z" fill="currentColor" />
        </svg>
      ),
    },
  ];

  const awards = [
    {
      title: 'ТОП-25 проектов акселератора 2024',
      category: 'Инновации',
      year: '2024',
      image: sber,
    },
    {
      title: 'Победители в номинации "Маркетинг"',
      category: 'Маркетинг',
      year: '2024',
      image: yandex,
    },
    {
      title: 'Победители "Меняющие реальность"',
      category: 'Социальное Воздействие',
      year: '2024',
      image: inno,
    },
    {
      title: 'Победители второго потока',
      category: 'Акселератор',
      year: '2024',
      image: moscow,
    },
    {
      title: 'Победители',
      category: 'Общая категория',
      year: '2023',
      image: fiztech,
    },
  ];

  const ndaCases = [
    {
      area: t('Корпоративная безопасность', 'Corporate security'),
      before: t('3% отклик на тренинги', '3% engagement with training'),
      after: t(
        '27% вовлечённость, 2× завершения',
        '27% engagement, 2× completions'
      ),
    },
    {
      area: t('HR в госкорпорации', 'HR in a state corporation'),
      before: t('непонимание миссии', 'mission unclear to teams'),
      after: t(
        '5 отделов перестроили процессы',
        '5 departments rebuilt their processes'
      ),
    },
    {
      area: 'SaaS in LinkedIn',
      before: t('1–2 ответа на 100', '1–2 replies per 100 messages'),
      after: t('18% reply rate, 12% демо', '18% reply rate, 12% demos'),
    },
    {
      area: t('Видео на IT-фестивале', 'Video for an IT festival'),
      before: t('слабый поток', 'low booth traffic'),
      after: t('+400% у стенда спикера', '+400% traffic at the speaker booth'),
    },
  ];

  const faqData = [
    {
      question: 'Как именно нейросети помогают в создании ролика?',
      answer:
        'Нейросети ускоряют визуальное производство: мы превращаем сценарий в готовую анимацию за 10 дней вместо 2–3 месяцев, не теряя в качестве. Итог: быстрее запуск, меньше бюджет, больше тестов.',
    },
    {
      question: 'Сколько стоит ваш ролик?',
      answer:
        'Диапазон — от 200\u00a0000 до 1,5 млн ₽. Цены зависят от длительности, визуального уровня и задач. Мы гибкие: подходим как для стартапов, так и корпораций. В любом случае — ролик себя окупает.',
    },
    {
      question: 'Сможем ли мы вносить правки?',
      answer:
        'Да. Мы закладываем итерации правок на ключевых этапах: сценарий, раскадровка, визуал. Это коллаборация, а не чёрный ящик.',
    },
    {
      question: 'Сколько времени уходит на создание ролика?',
      answer:
        'Типовой цикл — 7–14 дней. Быстрее, если есть чёткое понимание задач. Работаем итерационно: сценарий — раскадровка — визуал — продакшн.',
    },
    {
      question: 'А вы делали что-то подобное в нашей отрасли?',
      answer:
        'Скорее всего — да. Мы специализируемся на сложных B2B-продуктах: нейронки, биотех, промышленность, GovTech, SaaS, хардвер. Но если кейса нет — мы быстро вкапываемся и делаем ролик, который звучит с первого кадра.',
    },
    {
      question: 'Нам нужен строгий стиль, всё по брендбуку — вы сможете?',
      answer:
        'Да. Работаем строго в фирменном стиле, если он есть. Если нет — подбираем стиль, который логично ляжет в вашу коммуникацию (и отдел маркетинга скажет спасибо).',
    },
    {
      question: 'Чем вы отличаетесь от обычной студии или фрилансеров?',
      answer:
        'У нас нет креатива ради креатива. Мы думаем в логике продаж: ролик — это инструмент. Сценарий пишет продюсер с опытом в продажах. А продакшн строим на AI и своих автоматизациях — это быстро, гибко.',
    },
    {
      question: 'Можно ли использовать один ролик в разных каналах?',
      answer:
        'Да, это наша сильная сторона. Мы сразу продумываем сценарий так, чтобы ролик работал в нескольких форматах: сайт, соцсети, питч, презентация.',
    },
    {
      question: 'Что нужно, чтобы начать?',
      answer:
        'Заполнить короткий бриф — это займёт 3–5 минут. Дальше мы сами соберём всё остальное и предложим концепцию. Если ок — двигаемся.',
    },
  ];

  const redirectToTelegram = () => {
    window.open('https://t.me/anix_helper', '_blank');
  };

  const generateQRCode = () => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://t.me/anix_helper`;
  };

  const scrollAwards = (direction) => {
    if (awardsScrollRef.current) {
      requestAnimationFrame(() => {
        const container = awardsScrollRef.current;
        const card = container.querySelector('.award-card');
        const cardWidth =
          window.innerWidth <= 768
            ? container.clientWidth
            : card
              ? card.offsetWidth + 32
              : 300;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (direction === 'left') {
          if (container.scrollLeft <= 0) {
            container.scrollTo({ left: maxScroll, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
          }
        } else {
          if (container.scrollLeft >= maxScroll) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: cardWidth, behavior: 'smooth' });
          }
        }
      });
    }
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const copy = translations[language];

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="neural-loader">
            <div className="neural-pulse"></div>
            <div className="neural-pulse"></div>
            <div className="neural-pulse"></div>
          </div>
          <h2 className="loading-text">Инициализация нейронных сетей...</h2>
        </div>
      </div>
    );
  }

  const problemCards = [
    {
      icon: '📢',
      label: t('Проблема №1', 'Problem #1'),
      description: t(
        'Люди не читают текст — его никто не понимает.',
        'People skip the text — nobody understands it.'
      ),
      tone: 'ruby',
    },
    {
      icon: '🎬',
      label: t('Проблема №2', 'Problem #2'),
      description: t(
        'В классическом видео теряется логика.',
        'Traditional video loses the logic.'
      ),
      tone: 'indigo',
    },
    {
      icon: '📈',
      label: t('Проблема №3', 'Problem #3'),
      description: t(
        'Customer Acquisition Cost растет ➜ Неэффективные стандартные методы маркетинга.',
        'Customer Acquisition Cost climbs ➜ standard marketing tactics underperform.'
      ),
      tone: 'teal',
    },
    {
      icon: '🛠️',
      label: t('Проблема №4', 'Problem #4'),
      description: t(
        'Нужен инструмент, который объяснит быстро.',
        'You need a tool that explains quickly.'
      ),
      tone: 'aqua',
    },
  ];

  return (
    <div className="anix-landing">
      {isPageBlurred && <div className="page-blur-overlay"></div>}

      {/* Hero Section */}
      <Section id="hero" bg="#0f0f1f" stickyTransition>
        <div className="hero-section">
          <div className="hero-background">
            <LiteVimeo videoId="1102413873" />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <div className="language-toggle" aria-label="language switcher">
              <button
                type="button"
                className={`language-toggle-button ${isEnglish ? 'active' : ''}`}
                onClick={() => setLanguage(isEnglish ? 'ru' : 'en')}
              >
                <span className={!isEnglish ? 'active' : ''}>RU</span>
                <div className="toggle-knob" />
                <span className={isEnglish ? 'active' : ''}>EN</span>
              </button>
            </div>
            <div className="hero-grid">
              <div className="hero-text">
                <h1 className="hero-title">{copy.heroTitle}</h1>
                <p className="hero-subtitle">{copy.heroSubtitle}</p>
                <a
                  href="https://t.me/m/i23MvBuLOGJi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button primary hero-cta"
                  onMouseEnter={() => setIsPageBlurred(true)}
                  onMouseLeave={() => setIsPageBlurred(false)}
                >
                  <span>{copy.heroCTA}</span>
                  <div className="button-glow"></div>
                </a>
              </div>
              <div className="hero-benefits-panel">
                <div className="hero-benefits-grid">
                  {copy.heroBenefits.map((benefit, index) => (
                    <div key={index} className="hero-benefit-card">
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Full CTA Section */}
      <Section id="cta" bg="#0f0f1f" stickyTransition>
        <div className="cta-full-section">
          <div className="container">
            <div className="cta-full-content">
              <div>
                <h2 className="cta-full-title">{copy.ctaFullTitle}</h2>
                <p className="cta-full-subtitle">{copy.ctaFullSubtitle}</p>
              </div>
              <form className="cta-full-form">
                <label>
                  {copy.formNameLabel}
                  <input
                    type="text"
                    name="name"
                    placeholder={copy.formNameLabel}
                  />
                </label>
                <label>
                  {copy.formContactLabel}
                  <input
                    type="text"
                    name="contact"
                    placeholder="+7 (999) 999-99-99 / @username"
                  />
                </label>
                <label>
                  {copy.formProductLabel}
                  <textarea
                    name="product"
                    rows="3"
                    placeholder={copy.formProductPlaceholder}
                  ></textarea>
                </label>
                <button type="submit" className="cta-button primary">
                  {copy.formSubmit}
                  <div className="button-glow"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* Problem Solution Section */}
      <Section id="problem" bg="#141429" stickyTransition>
        <div className="problem-section">
          <div className="container problem-grid">
            <div className="problem-text">
              <h2 className="section-title">
                {t(
                  'Бизнесу трудно продавать, когда продукт сложный',
                  'Selling is hard when the product is complex'
                )}
              </h2>
              <p className="problem-description">
                {t(
                  'Сегодня маркетинг буксует: баннерную слепоту уже ничем не пробить, а CAC растёт каждый месяц. Клиенты не понимают продукт, а отделы продаж тонут в долгих объяснениях.',
                  'Marketing is stalling: banner blindness is unbreakable, CAC keeps growing, customers do not understand the product, and sales teams drown in lengthy explanations.'
                )}
              </p>
            </div>
            <div className="problem-cards">
              {problemCards.map((card, index) => (
                <div key={card.label} className={`problem-card ${card.tone}`}>
                  <div className="problem-icon" aria-hidden="true">
                    {card.icon}
                  </div>
                  <div className="problem-card-text">
                    <div className="problem-card-label">{card.label}</div>
                    <div className="problem-card-description">
                      {card.description}
                    </div>
                  </div>
                  <div className="problem-card-index">{index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Anix Difference Section */}
      <Section id="difference" bg="#1a1a33" stickyTransition>
        <div className="difference-section">
          <div className="container">
            <h2 className="section-title">
              {t(
                'Anix — это не студия, это инструмент для роста вашей конверсии',
                'Anix is not a studio — it is your conversion growth engine'
              )}
            </h2>
            <div className="difference-grid">
              <div className="difference-card">
                <div className="difference-icon">🧩</div>
                <div className="difference-text">
                  {t(
                    'Уникальный подход: бизнес анализ + драматургия + нейросети.',
                    'Unique blend: business analysis + storytelling + neural networks.'
                  )}
                </div>
              </div>
              <div className="difference-card">
                <div className="difference-icon">🤖</div>
                <div className="difference-text">
                  {t(
                    'Собственная нейросеть Anix Interpolator. Быстрее и лучше рынка.',
                    'In-house Anix Interpolator neural network. Faster and better than the market.'
                  )}
                </div>
              </div>
              <div className="difference-card">
                <div className="difference-icon">🧬</div>
                <div className="difference-text">
                  {t(
                    'Глубокое понимание сложных продуктов: IT, фарма, AI, финтех.',
                    'Deep understanding of complex products: IT, pharma, AI, fintech.'
                  )}
                </div>
              </div>
              <div className="difference-card">
                <div className="difference-icon">🎓</div>
                <div className="difference-text">
                  {t(
                    'Выпускники МФТИ + сильная творческая экспертиза.',
                    'MIPT alumni + strong creative expertise.'
                  )}
                </div>
              </div>
              <div className="difference-card">
                <div className="difference-icon">🎯</div>
                <div className="difference-text">
                  {t(
                    'Работаем под задачу, а не "красиво". Ролики дают результат.',
                    'We work for outcomes, not “beauty”. Videos deliver results.'
                  )}
                </div>
              </div>
            </div>
            <div className="difference-cta-wrapper">
              <a
                href="https://t.me/m/i23MvBuLOGJi"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button primary"
                onMouseEnter={() => setIsPageBlurred(true)}
                onMouseLeave={() => setIsPageBlurred(false)}
              >
                <span>Узнать, чем мы отличаемся от других</span>
                <div className="button-glow"></div>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* Conversion Section */}
      <Section id="conversion" bg="#0f0f1f" stickyTransition>
        <div className="conversion-section">
          <div className="container">
            <h2 className="section-title">Как мы повышаем конверсию</h2>
            <p className="conversion-intro">
              {t(
                'Мы строим видео, которое работает как элемент воронки, а не просто красиво.',
                'We build video that works as part of the funnel, not just looks pretty.'
              )}
            </p>
            <div className="conversion-grid">
              {conversionSteps.map((step, index) => (
                <div className="conversion-card" key={index}>
                  <div className="conversion-icon">{step.icon}</div>
                  <div className="conversion-text">
                    <div className="conversion-card-title">{step.title}</div>
                    <div className="conversion-card-desc">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="conversion-boost">
              <span className="conversion-boost-value">+15–25%</span>
              <span className="conversion-boost-label">
                {t('конверсии', 'conversion uplift')}
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="cases" bg="#202040" stickyTransition>
        <div className="testimonials-section">
          <div className="container">
            <h2 className="section-title">Истории Успеха Клиентов</h2>
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => {
                const baseText =
                  isEnglish && testimonial.textEn
                    ? testimonial.textEn
                    : testimonial.text;
                const maxLen = isMobile ? 275 : 350;
                const previewText =
                  baseText.length > maxLen
                    ? `${baseText.slice(0, maxLen)}...`
                    : baseText;
                return (
                  <div key={testimonial.id} className="testimonial-card">
                    <div
                      className="video-preview"
                      onClick={() => {
                        setSelectedVideo(testimonial);
                        setShowVideoModal(true);
                      }}
                    >
                      <img
                        src={testimonial.videoThumbnail}
                        srcSet={makeSrcSet(testimonial.videoThumbnail)}
                        sizes={responsiveSizes}
                        alt="анимационный ролик объясняющий B2B продукт"
                        width="600"
                        height="338"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="video-play-button">
                        <div className="play-icon">▶</div>
                      </div>
                      <div className="ai-indicator">
                        {t('Повышение охвата', 'Reach uplift')}: X
                        {testimonial.reach}
                      </div>
                      <div className="conversion-indicator">
                        {t('Повышение конверсии', 'Conversion uplift')} +
                        {testimonial.conversion}%
                      </div>
                    </div>
                    <div className="testimonial-content">
                      <p>{previewText}</p>
                      <div className="testimonial-author">
                        <strong>{testimonial.name}</strong>
                        {testimonial.website ? (
                          <a
                            href={testimonial.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {isEnglish && testimonial.companyEn
                              ? testimonial.companyEn
                              : testimonial.company}
                          </a>
                        ) : (
                          <span>
                            {isEnglish && testimonial.companyEn
                              ? testimonial.companyEn
                              : testimonial.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Audience Fit Section */}
      <Section id="audience" bg="#0f0f1f" className="audience-section">
        <div className="container">
          <h2 className="section-title">{copy.audienceTitle}</h2>
          <p className="audience-subtitle">{copy.audienceSubtitle}</p>
          <div className="audience-grid">
            {copy.audienceCards.map((card, index) => (
              <div
                key={index}
                className={`audience-card theme-${card.theme}`}
                aria-label={card.title}
              >
                <div className="audience-card-content">
                  <h3 className="audience-card-title">{card.title}</h3>
                  <ul className="audience-list">
                    {card.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section id="team" bg="#1a1a1a" className="team-section">
        <div className="container">
          <h2 className="section-title">{copy.teamTitle}</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img
                    src={member.image}
                    srcSet={makeSrcSet(member.image)}
                    sizes={responsiveSizes}
                    alt="анимационный ролик объясняющий B2B продукт"
                    width="400"
                    height="400"
                    className="team-image"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="team-overlay">
                    <div className="expertise-badges">
                      {member.tags.map((tag, i) => (
                        <span key={i} className="expertise-badge">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <p className="benefit">{member.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Technology Section */}
      <Section id="technology" bg="#0f0f1f" className="technology-section">
        <div className="technology-container">
          <div className="technology-title-wrapper">
            <h2 className="technology-title">
              {copy.technologyTitleLines.map((line, index) => (
                <span key={index} className="technology-title-line">
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </h2>
          </div>

          <div className="technology-stack">
            {copy.technologyFeatures?.map((item, index) => {
              const rhythm = ['hero', 'step', 'step', 'lift', 'medium'];
              const tierClass = rhythm[index] || 'medium';

              return (
                <div
                  key={`${item.title}-${index}`}
                  className={`technology-card technology-card--${tierClass}`}
                >
                  <span className="technology-card__glow" aria-hidden="true" />
                  <div className="technology-icon" aria-hidden="true">
                    <span className="technology-icon-symbol">{item.icon}</span>
                  </div>
                  <div className="technology-copy">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Risk Handling Section */}
      <Section id="risk" bg="#0f0f1f" className="risk-section">
        <div className="container">
          <h2 className="section-title">{copy.riskTitle}</h2>
          <div className="risk-grid">
            {copy.riskBullets.map((risk, index) => (
              <div key={index} className="risk-card">
                <h3>{risk.title}</h3>
                <p>
                  {risk.link ? (
                    <>
                      {risk.description}{' '}
                      <a href={risk.link} className="risk-link">
                        →
                      </a>
                    </>
                  ) : (
                    risk.description
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing Overview Section */}
      <Section
        id="pricing"
        bg="#1a1a33"
        className="transparent-pricing-section"
      >
        <div className="container">
          <h2 className="section-title">{copy.pricingTitle}</h2>
          <p className="pricing-description">{copy.pricingText}</p>
          <a
            href="https://t.me/m/i23MvBuLOGJi"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button primary"
            onMouseEnter={() => setIsPageBlurred(true)}
            onMouseLeave={() => setIsPageBlurred(false)}
          >
            <span>{copy.pricingCTA}</span>
            <div className="button-glow"></div>
          </a>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section id="final-cta" bg="#0f0f1f" className="cta-full-section">
        <div className="container">
          <div className="cta-full-content">
            <div>
              <h2 className="cta-full-title">{copy.finalCTATitle}</h2>
              <p className="cta-full-subtitle">{copy.finalCTADescription}</p>
            </div>
            <form className="cta-full-form">
              <label>
                {copy.formNameLabel}
                <input
                  type="text"
                  name="name"
                  placeholder={copy.formNameLabel}
                />
              </label>
              <label>
                {copy.formContactLabel}
                <input
                  type="text"
                  name="contact"
                  placeholder="+7 (999) 999-99-99 / @username"
                />
              </label>
              <label>
                {copy.formProductLabel}
                <textarea
                  name="product"
                  rows="3"
                  placeholder={copy.formProductPlaceholder}
                ></textarea>
              </label>
              <button type="submit" className="cta-button primary">
                {copy.formSubmit}
                <div className="button-glow"></div>
              </button>
            </form>
          </div>
        </div>
      </Section>

      <div className="container text-center my-12 md:my-16">
        <a
          href="https://t.me/m/i23MvBuLOGJi"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button primary block w-full md:w-auto text-base md:text-lg"
          onMouseEnter={() => setIsPageBlurred(true)}
          onMouseLeave={() => setIsPageBlurred(false)}
        >
          <span>🧠 Разобрать мой продукт в Telegram</span>
          <div className="button-glow"></div>
        </a>
        <p className="text-sm md:text-base text-[#B0B0B0] mt-1">
          В Telegram обсудим ваш продукт и подберём лучший формат видео.
        </p>
      </div>

      {/*  👉 ставим Roadmap ЗА пределами .container */}
      <Suspense fallback={null}>
        <AnixLandingPage />
      </Suspense>

      <div className="container text-center my-12 md:my-16">
        <a
          href="https://t.me/m/i23MvBuLOGJi"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button primary block w-full md:w-auto text-base md:text-lg"
          onMouseEnter={() => setIsPageBlurred(true)}
          onMouseLeave={() => setIsPageBlurred(false)}
        >
          <span>🚀 Узнать доход от видео в Telegram</span>
          <div className="button-glow"></div>
        </a>
        <p className="text-sm md:text-base text-[#B0B0B0] mt-1">
          В Telegram рассчитаем, сколько дополнительной прибыли принесёт видео.
        </p>
      </div>

      {/* Enhanced Awards Section */}
      <Section id="awards" bg="#2d1b3d" className="awards-section">
        <div className="container">
          <h2 className="section-title">Признание Индустрии</h2>

          <div className="awards-scroll-container">
            <button
              className="scroll-button left"
              aria-label="Предыдущая награда"
              onClick={() => scrollAwards('left')}
            >
              ◀
            </button>

            <div
              className="awards-scroll"
              ref={awardsScrollRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
            >
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="award-card w-full max-w-xs flex-none"
                >
                  <div className="award-trophy">
                    <img
                      src={award.image}
                      srcSet={makeSrcSet(award.image)}
                      sizes={responsiveSizes}
                      alt="анимационный ролик объясняющий B2B продукт"
                      width="200"
                      height="200"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="trophy-glow"></div>
                  </div>
                  <div className="award-info">
                    <h3>{award.title}</h3>
                    <p className="award-category">{award.category}</p>
                    <span className="award-year">{award.year}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="scroll-button right"
              aria-label="Следующая награда"
              onClick={() => scrollAwards('right')}
            >
              ▶
            </button>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section id="faq" bg="#404080" stickyTransition>
        <div className="faq-section">
          <div className="container">
            <h2 className="section-title">Часто Задаваемые Вопросы</h2>
            <div className="faq-list">
              {faqData.map((faq, index) => (
                <div key={index} className="faq-item">
                  <button
                    className={`faq-question ${activeFAQ === index ? 'active' : ''}`}
                    onClick={() =>
                      setActiveFAQ(activeFAQ === index ? null : index)
                    }
                  >
                    <span>{faq.question}</span>
                    <div className="faq-icon">
                      {activeFAQ === index ? '−' : '+'}
                    </div>
                  </button>
                  <div
                    className={`faq-answer ${activeFAQ === index ? 'expanded' : ''}`}
                  >
                    <div className="faq-answer-content">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Brief Section (temporarily hidden) */}
      {/*
      <section className="brief-section">
        <div className="container subscribe-container">
          <h3>
            Хотите заполнить бриф? Можете сделать это в нашем телеграм-боте
            текстом или голосовыми сообщениями
          </h3>
          <a
            href="https://t.me/AnixBriefBot"
            target="_blank"
            rel="noopener noreferrer"
            className="subscribe-btn"
            onMouseEnter={() => setIsPageBlurred(true)}
            onMouseLeave={() => setIsPageBlurred(false)}
          >
            Заполнить бриф
            <span className="sparkles" />
          </a>
        </div>
        </div>
      </Section>
      */}

      {/* Contact Section */}
      <Section id="contact" bg="#2d1b3d" className="contact-section">
        <div className="container">
          <h2 className="section-title">Свяжитесь с Нами</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Готовы прокачать вашу воронку продаж?</h3>
              <p>
                Свяжитесь с нами любым удобным способом. Мы ответим в течение
                часа!
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">📞</div>
                  <div className="contact-details">
                    <strong>Телефон</strong>
                    <a href="tel:+79770890309">+7(977)-089-03-09</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-details">
                    <strong>Email</strong>
                    <a href="mailto:anix.ai@yandex.ru">anix.ai@yandex.ru</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">✈️</div>
                  <div className="contact-details">
                    <strong>Telegram</strong>
                    <a
                      href="https://t.me/anix_helper"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @anix_helper
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-visual">
              <div className="contact-animation">
                <div className="floating-elements">
                  <div className="element element-1">🎬</div>
                  <div className="element element-2">🤖</div>
                  <div className="element element-3">⚡</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Blog Section */}
      <Section id="blog" bg="#1a1a1a" className="blog-section">
        <div className="container">
          <h2 className="section-title">Последние Новости</h2>
          <div className="blog-grid">
            <Suspense fallback={null}>
              <BlogCard
                url="https://vc.ru/ai/2028376-startap-anix-iz-mfti-2d-animatsiya"
                category="Новости"
                headline="Стартап Anix из МФТИ автоматизирует 2D‑анимацию"
                description="VC.ru рассказывает об образовательных корнях проекта и его ИИ‑технологиях."
                date="2025-05-01"
                image="%PUBLIC_URL%/3.png"
              />
            </Suspense>

            <a
              href="https://vc.ru/marketing/1934034-kontent-marketing-s-animatsiey"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card"
            >
              <div className="blog-category">
                <span className="category-tag">#Маркетинг</span>
              </div>
              <h3>Контент‑маркетинг с анимацией: практические советы</h3>
              <p>
                Материал о том, как использовать ролики для усиления воронки
                продаж.
              </p>
              <div className="blog-meta">
                <span>4 мин чтения</span>
                <span>Апр 2025</span>
              </div>
            </a>

            <a
              href="https://me-forum.ru/media/events/mef-2025-sessiya-5-molodye-predprinimateli-v-mosko/"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card"
            >
              <div className="blog-category">
                <span className="category-tag">#MEF2025</span>
              </div>
              <h3>Anix выступил на сессии молодых предпринимателей MEF</h3>
              <p>
                На Московском экономическом форуме команда поделилась опытом
                нейроанимации.
              </p>
              <div className="blog-meta">
                <span>2 мин чтения</span>
                <span>Мар 2025</span>
              </div>
            </a>

            <a
              href="https://vc.ru/life/1916917-kak-b2b-kompaniyam-sozdat-uspeshnyy-animatsionnyy-rolik"
              target="_blank"
              rel="noopener noreferrer"
              className="blog-card"
            >
              <div className="blog-category">
                <span className="category-tag">#B2BВидео</span>
              </div>
              <h3>Как B2B‑компаниям создать успешный анимационный ролик</h3>
              <p>
                Подробный гид по выбору формата и ключевым этапам производства.
              </p>
              <div className="blog-meta">
                <span>6 мин чтения</span>
                <span>Фев 2025</span>
              </div>
            </a>
          </div>
        </div>
      </Section>

      {/* Services Section (moved below news) */}
      <Section id="services" bg="#1a1a33" stickyTransition>
        <div className="services-section">
          <div className="container">
            <h2 className="section-title">{copy.salesVideoTitle}</h2>
            <div className="services-grid">
              <div
                className="service-card"
                onClick={() => setActiveService(activeService === 0 ? null : 0)}
              >
                <div className="service-icon">🎬</div>
                <h3>Сокращение цикла сделки</h3>
                <p>
                  Меньше времени уходит на прогрев, презентации и убеждение.
                </p>
                <p>
                  &quot;Мы теряем клиентов из-за долгих обсуждений и
                  недопонимания&quot;.
                </p>
                <div
                  className={`service-overlay ${activeService === 0 ? 'show' : ''}`}
                >
                  <div className="case-study">
                    <h4>Превентивная победа</h4>
                    <p>
                      Наши клиенты в среднем сократили цикл сделки в 3 раза.
                    </p>
                    <div className="metrics">
                      <span>Доверие: +21 пункт</span>
                      <span>x2 Меньше возражений</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="service-card"
                onClick={() => setActiveService(activeService === 1 ? null : 1)}
              >
                <div className="service-icon">⚡</div>
                <h3>Масштабирование</h3>
                <p>
                  Видео легко тиражируется, работает на новых рынках, языках,
                  партнёрах.
                </p>
                <p>
                  &quot;Хочу выйти в США, но нужен контент под локаль&quot;.
                </p>
                <div
                  className={`service-overlay ${activeService === 1 ? 'show' : ''}`}
                >
                  <div className="case-study">
                    <h4>История успеха</h4>
                    <p>
                      Обычно наш клиент увеличивает конверсию в отклик от 10
                      раз.
                    </p>
                    <div className="metrics">
                      <span>x10 Повышение охватов</span>
                      <span>+16% Конверсий</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="service-card"
                onClick={() => setActiveService(activeService === 2 ? null : 2)}
              >
                <div className="service-icon">🎨</div>
                <h3>Конкурентная Упаковка</h3>
                <p>
                  Продукт визуально и эмоционально выигрывает у конкурентов.
                </p>
                <p>
                  &quot;На фоне других выглядим скучно, нас не запоминают&quot;.
                </p>
                <div
                  className={`service-overlay ${activeService === 2 ? 'show' : ''}`}
                >
                  <div className="case-study">
                    <h4>Вау эффект</h4>
                    <p>Выделитесь на конференции и лендинге</p>
                    <div className="metrics">
                      <span>Лояльность: +30 пунктов</span>
                      <span>x3 Узнаваемость бренда</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* NDA Cases Section (moved below news) */}
      <Section id="nda" bg="#0f0f0f" className="nda-cases-section">
        <div className="container">
          <h2 className="section-title">{copy.ndaTitle}</h2>
          <div className="nda-grid">
            {ndaCases.map((item, index) => (
              <div key={index} className="nda-card">
                <div className="nda-card-header">
                  <p className="nda-area">{item.area}</p>
                  <span className="nda-pill">
                    {t('Было → Стало', 'Before → After')}
                  </span>
                </div>
                <div className="nda-card-body">
                  <div className="nda-stat">
                    <p className="nda-label">{t('До', 'Before')}</p>
                    <p className="nda-value">{item.before}</p>
                  </div>
                  <div className="nda-divider" aria-hidden="true"></div>
                  <div className="nda-stat">
                    <p className="nda-label nda-label-strong">
                      {t('После', 'After')}
                    </p>
                    <p className="nda-value nda-value-strong">{item.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Telegram Subscribe Section (moved below news) */}
      <Section id="subscribe" bg="#2c2c59" stickyTransition>
        <div className="telegram-subscribe py-20 bg-gradient-to-r from-[#5f35ff] to-[#4ac9ff] text-white text-center">
          <div className="container max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">{copy.subscribeTitle}</h2>
            <p className="text-lg text-[#e0e0e0] mb-6">
              {copy.subscribeSubtitle}
            </p>

            <a
              href="https://t.me/anixpro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#5f35ff] px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
            >
              {copy.subscribeCTA}
            </a>
            <p className="text-sm text-[#B0B0B0] mt-1">{copy.subscribeNote}</p>
          </div>
        </div>
      </Section>

      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>

      {/* Floating Telegram Button */}
      <div
        className="floating-telegram"
        onMouseEnter={() => setShowQRCode(true)}
        onMouseLeave={() => setShowQRCode(false)}
        onClick={redirectToTelegram}
      >
        <div className="telegram-icon">✈</div>
        <span>🔮 Получить расчёт под мой проект</span>
        <div className="telegram-glow"></div>

        {showQRCode && (
          <div className="qr-modal">
            <img
              src={generateQRCode()}
              srcSet={`${generateQRCode()} 1x, ${generateQRCode()} 2x`}
              sizes={responsiveSizes}
              alt="анимационный ролик объясняющий B2B продукт"
              width="180"
              height="180"
              loading="lazy"
              decoding="async"
            />
            <p>Сканируйте для связи</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="video-modal-overlay"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowVideoModal(false)}
            >
              ×
            </button>
            {selectedVideo && (
              <div className="modal-content">
                <iframe
                  src={selectedVideo.videoUrl}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={`Видео от ${selectedVideo.name}`}
                  loading="lazy"
                ></iframe>
                <div className="progress-bar-container">
                  <div className="progress-label">Повышение охвата</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="progress-percentage">
                    X{selectedVideo.reach}
                  </div>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-label">Повышение конверсии</div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="progress-percentage">
                    +{selectedVideo.conversion}%
                  </div>
                </div>
                <div className="modal-info">
                  <h3>{selectedVideo.name}</h3>
                  <p>{selectedVideo.company}</p>
                  <p>&quot;{selectedVideo.text}&quot;</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnixAILanding;
