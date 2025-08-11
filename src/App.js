import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AnixLandingPage from './components/AnixLandingPage';
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
import BlogCard from './components/BlogCard';
import CookieBanner from './components/CookieBanner';
import LeadForm from './components/LeadForm';

// Helper for responsive img attributes
const makeSrcSet = (src) => `${src} 1x, ${src} 2x`;
const responsiveSizes = '(max-width: 768px) 100vw, 600px';

const AnixAILanding = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(-1);
  const [counters, setCounters] = useState({ projects: 0, hours: 0 });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [processInView, setProcessInView] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const [isPageBlurred, setIsPageBlurred] = useState(false);

  const heroRef = useRef(null);
  const processRef = useRef(null);
  const particlesRef = useRef(null);
  const awardsScrollRef = useRef(null);
  const pricingScrollRef = useRef(null);
  const swipeStart = useRef(0);
  const pricingSwipeStart = useRef(0);
  const [activeService, setActiveService] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
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

  const handlePricingTouchStart = (e) => {
    pricingSwipeStart.current = e.touches[0].clientX;
  };

  const handlePricingTouchEnd = (e) => {
    const deltaX = e.changedTouches[0].clientX - pricingSwipeStart.current;
    if (deltaX > 50) scrollPricing('left');
    if (deltaX < -50) scrollPricing('right');
  };

  const handlePricingMouseDown = (e) => {
    pricingSwipeStart.current = e.clientX;
  };

  const handlePricingMouseUp = (e) => {
    const deltaX = e.clientX - pricingSwipeStart.current;
    if (deltaX > 50) scrollPricing('left');
    if (deltaX < -50) scrollPricing('right');
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

  // Neural network particle animation
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 69, 255, 0.8)';
        ctx.fill();

        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 3
        );
        gradient.addColorStop(0, 'rgba(139, 69, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(139, 69, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      // Draw connection
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139, 69, 255, ${1 - distance / 100})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Process steps with enhanced data
  const processSteps = [
    {
      title: 'Анализ Сценария',
      icon: '📝',
      description:
        'ИИ анализирует ваш бриф и создает увлекательное повествование',
      time: '2 часа',
      saved: '75%',
      details: [
        'Обработка брифа',
        'Анализ целевой аудитории',
        'Оптимизация сценария',
      ],
      color: '#8b45ff',
      bgGradient: 'linear-gradient(135deg, #8b45ff, #b465ff)',
    },
    {
      title: 'Генерация Ключевых Кадров',
      icon: '🎯',
      description:
        'Нейронные сети автоматически генерируют идеальные ключевые кадры',
      time: '4 часа',
      saved: '60%',
      details: [
        'Автоматическое создание ключевых кадров',
        'Визуальная композиция',
        'Оптимизация тайминга',
      ],
      color: '#20b2aa',
      bgGradient: 'linear-gradient(135deg, #20b2aa, #48cae4)',
    },
    {
      title: 'ИИ Анимация',
      icon: '🤖',
      description: 'Продвинутый ИИ создает плавную, профессиональную анимацию',
      time: '1 час',
      saved: '90%',
      details: ['Нейронный рендеринг', 'Синтез движения', 'Перенос стиля'],
      color: '#ff7f50',
      bgGradient: 'linear-gradient(135deg, #ff7f50, #ff9a76)',
    },
    {
      title: 'Улучшение',
      icon: '⚡',
      description: 'ИИ улучшает качество и добавляет финальные штрихи',
      time: '30 мин',
      saved: '85%',
      details: ['Улучшение качества', 'Цветокоррекция', 'Обработка эффектов'],
      color: '#9d4edd',
      bgGradient: 'linear-gradient(135deg, #9d4edd, #c77dff)',
    },
    {
      title: 'Доставка',
      icon: '📊',
      description: 'Финальная оптимизация и интеграция аналитики',
      time: '15 мин',
      saved: '95%',
      details: [
        'Оптимизация форматов',
        'Настройка аналитики',
        'Отслеживание производительности',
      ],
      color: '#06ffa5',
      bgGradient: 'linear-gradient(135deg, #06ffa5, #39ff14)',
    },
  ];

  const teamMembers = [
    {
      name: 'Андрей Царёв',
      role: 'Стратег и продюсер B2B-видео',
      benefit: 'Понимает рынок, превращает суть в продающий аргумент',
      image: god,
      tags: ['B2B', 'Продуктовое позиционирование', 'Драматургия', 'Аналитика'],
    },
    {
      name: 'Александра Севостьянова',
      role: 'Сценарист-продажник и режиссёр',
      benefit: 'Превращает сложное в ясную и цепляющую подачу',
      image: bestie,
      tags: [
        'B2B-питчи',
        'Театральная режиссура',
        'Продажный текст',
        'Клиентские боли',
      ],
    },
    {
      name: 'Иван Кухарук',
      role: 'Технический директор',
      benefit: 'Проектирует процесс и следит, чтобы всё работало',
      image: vanya,
      tags: [
        'Проджект-менеджмент',
        'Бизнес-анализ',
        'AI-интеграция',
        'Процесс',
      ],
    },
    {
      name: 'Дарья Косичкина',
      role: 'Нейроаниматор',
      benefit: 'Делает визуал, который объясняет и цепляет',
      image: dasha,
      tags: [
        '2D-анимация',
        'Моушн-дизайн',
        'Визуальные метафоры',
        'Раскадровка',
      ],
    },
    {
      name: 'Лидия Солнышко',
      role: 'Нейроаниматор',
      benefit: 'Собирает AI-видео, чтобы быстро и качественно',
      image: lida,
      tags: ['AI-видео', 'Постпродакшн', 'Алгоритмы', 'Motion pipeline'],
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Мария Воронова',
      company: 'CMO Kolobox',
      website: 'https://kolo-box.ru/',
      text: 'Работать с Anix — это кайф. Очень бережно подошли к брифу, уловили суть, предлагали идеи, оперативно реагировали на фидбек и в итоге сделали видео, которое нам до сих пор не надоело пересматривать. Получилось живо, динамично, душевно. ',
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
      text: 'Приняли решение сделать ролик, потому что сработала моя интуиция, а еще было жгучее чувство, что ролик очень важен для нас - особенно на РВФ, куда нужно было с собой что-то вести, и это должно было быть чем-то весомым, достойным и привлекающим внимание. По итогу ролик безусловно отработал на 150% в Казани, мы себя чувствовали уверенно, даже перед высокопоставленными лицами и официальными делегациями, еще разослали его по своим ресурсам, групповым чатам и т.д. Сейчас есть необходимость перевода ролика на английский язык. Оценка ролика и работы команды Anix самая высокая.',
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
      text: 'Мы заказывали в Anix создание ролика-эксплейнера, который мог бы рассказать потенциальному партнеру о том, что это за продукт, зачем он нужен и в целом, что с ним делать. Среди пожеланий было: учесть айдентику продукта, продумать понятное и наглядное объяснение для каждого последовательности шагов при пользовании продуктом, донести до смотрящего ценности, которые мы вкладываем в продукт, попасть в сердечко нашей ЦА, а она у нас непростая. Откровенно говоря, серьезных ограничений по срокам у нас не было, но названный ребятами срок в 1 месяц очень подкупил. Я сначала отнеслась скептически, так как все мы знаем, как сдвигаются дедлайны, но всё было чётко и со вкусом. И по итогу месяца сотворчества ролик был готов) Прокрутила в голове процесс работы и поняла, что Anix полностью снял с моей команды необходимость заниматься генерацией сценария. Эта задача пугала меня больше всего, а на деле оказалось, что нам надо просто читать предлагаемые варианты сюжета и давать правки-комментарии. Я видела восторженные глаза людей на питчах и выставках, когда помимо сухой презентации, в дело шёл еще и видео-эксплейнер. Видимо, все мы в душе дети (даже взрослые дядьки-ЛПРы), поэтому сказочный ролик заходит намного больше сухой типовой презентации',
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
      text: 'Сначала были сомнения, поймет ли команда мой специфический запрос, потом увидела скетчи будущего мультфильма и успокоилась. Я абсолютно везде использую иллюстрации. Это стало визитной карточкой, все узнают эти картинки. Неожиданным моментом стало то, что мало кто из стартапов пользуются роликами эксплейнерами. По итогу ролик используем на сайте, на выставках, на листовках и в презентации. Результат превзошел все ожидания.',
      videoThumbnail: hemoai,
      videoUrl: 'https://player.vimeo.com/video/1078358021?h=afe067a81f',
      reach: 53,
      conversion: 22,
    },
    {
      id: 5,
      name: 'Светлана Красночуб',
      company: 'Исполнительный директор ФЦК МФТИ',
      website: 'https://fund.mipt.ru/',
      text: 'Мы внутри фонда, сделали коммуникационную стратегию, и дальше начался этап и поиски людей, которые смогут помочь её реализовать. У нас было только описание чувств, которые мы хотим передать в нашем ролике. Нам повезло, и мы нашли по настоящему креативную команду. Буквально за несколько установочных встреч, они смогли перевести весь наш поток эмоций в сценарий. Ролик получился ярким, вдохновляющим, узнаваемым для всех поколений Физтехов. Удалось передать дух Физтеха, добавить юмор. Мы только в начале внедрения и на выпускном, получили очень положительные отзывы. Дизайн вошëл в основу нового брендинга. Все неточности и замечания, были отработаны. От совместной работы только хорошее впечатление. Думаю сотрудничество с Anix будет долгосрочным. Рекомендую команду и для воплощения ваших идей.',
      videoThumbnail: 'https://vumbnail.com/1102413873.jpg',
      videoUrl:
        'https://player.vimeo.com/video/1102413873?badge=0&autopause=0&player_id=0&app_id=58479',
      reach: 100,
      conversion: 10,
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

  const pricingPackages = {
    Стартапы: [
      {
        name: 'Meaty Script',
        price: '100K₽',
        details: [
          '⚡ 5 дней доставка',
          '🎯 Что получите: Готовый сценарий + структура + бриф + визуальные советы',
          '📝 Для кого: Есть продакшн, но нет идей как донести суть',
        ],
      },
      {
        name: 'Explain in 30s',
        price: '250K₽',
        details: [
          '⚡ 7 дней доставка',
          '🎯 Что получите: 1 продающий ролик (сценарий, анимация, звук)',
          '🎨 Для кого: Нужно быстро объяснить "Кто вы?" без лишних слов',
        ],
      },
      {
        name: 'Content Start',
        price: '450K₽',
        details: [
          '⚡ 10 дней доставка',
          '🎯 Что получите: 3 адаптированных ролика для Reels/Shorts',
          '🎬 Для кого: Нужен недорогой тест анимации для соцсетей',
        ],
      },
    ],
    'Средний Бизнес': [
      {
        name: 'Full Production',
        price: '500K₽',
        details: [
          '⚡ 5 дней доставка',
          '🎯 Что получите: Полный продакшен + стратегия + адаптация под все сети',
          '🎨 Для кого: Нужен мощный ролик под лиды, найм или запуск',
        ],
      },
      {
        name: 'Result Series',
        price: '650K₽',
        details: [
          '⚡ 25 день доставка',
          '🎯 Что получите: 3-5 роликов в едином стиле + A/B-тесты',
          '🔄 Для кого: Нужно вести клиента по воронке контентом',
        ],
      },
      {
        name: 'Feed Content',
        price: '720K₽',
        details: [
          '⚡ регулярно',
          '🎯 Что получите: Месяц коротких роликов/анимированных постов',
          '📱 Для кого: Нужна регулярность без постоянных изобретений',
        ],
      },
    ],
    Корпорации: [
      {
        name: 'Content System',
        price: '1.5M₽',
        details: [
          '⚡ 45 дней доставка',
          '🎯  Что получите: Стратегия + продакшен + аналитика + фокус-группы',
          '👥 Для кого: Построение устойчивой контент-воронки',
        ],
      },
      {
        name: 'In-House Team',
        price: '5M₽',
        details: [
          '⚡ 90 дней настройка',
          '🎯 Что получите: Построение внутреннего отдела (пайплайн, шаблоны, найм)',
          '🛠️ Для кого: Контент на потоке без фрилансеров',
        ],
      },
      {
        name: 'Court Viz',
        price: '1.75M₽',
        details: [
          '⚡ 60 дней доставка',
          '🎯 Что получите: Презентации, HR-коммуникация, сериалы, супервайзинг',
          '📋 Для кого: Решение задач бренда, HR, ESG через анимацию',
        ],
      },
    ],
  };

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

  const scrollPricing = (direction) => {
    if (pricingScrollRef.current) {
      requestAnimationFrame(() => {
        const container = pricingScrollRef.current;
        const card = container.querySelector('.pricing-column');
        const cardWidth =
          window.innerWidth <= 768
            ? container.clientWidth
            : card
              ? card.offsetWidth + 32
              : 400;
        const scrollAmount = cardWidth / 1.5;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (direction === 'left') {
          if (container.scrollLeft <= 0) {
            container.scrollTo({ left: maxScroll, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        } else {
          if (container.scrollLeft >= maxScroll) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      });
    }
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

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

  return (
    <div className="anix-landing">
      {isPageBlurred && <div className="page-blur-overlay"></div>}
      {/* Neural Network Particles Background */}
      <canvas ref={particlesRef} className="particles-canvas" />

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">
              Мультик, который делает твой продукт
            </span>
            <span className="title-line glow-text">на 500% понятнее</span>
            <span className="title-line">и в 2 раза дороже</span>
          </h1>
          <p className="hero-subtitle">
            Революционный пайплайн Anix делает анимацию сложных продуктов
            понятной и быстрой.
          </p>
          <a
            href="https://t.me/m/i23MvBuLOGJi"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button primary block w-full md:w-auto text-base md:text-lg"
            onMouseEnter={() => setIsPageBlurred(true)}
            onMouseLeave={() => setIsPageBlurred(false)}
          >
            <span>
              {isMobile
                ? 'Повысить продажи'
                : '🎯 Получить видео, которое увеличит demo rate'}
            </span>
            <div className="button-glow"></div>
          </a>
        </div>

        <div className="geometric-shapes">
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </section>

      {/* Pain Section */}
      <section className="pain-section">
        <div className="container">
          <h2 className="section-title">
            Пока вы объясняете, кто-то уже продал
          </h2>
          <ul className="pain-list">
            <li>❌ Ваш продукт классный. Но его не понимают.</li>
            <li>❌ Вы делаете демо — а до него доходят 3% лидов.</li>
            <li>
              ❌ Вас сравнивают с конкурентами, не понимая вашей ценности.
            </li>
          </ul>
          <p className="pain-summary">
            🎯 Мы — ваша презентация, упаковка и sales-инструмент в одном видео.
            Объясняем продукт так, что его начинают покупать.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Видео, которое помогает продавать</h2>
          <div className="services-grid">
            <div
              className="service-card"
              onClick={() => setActiveService(activeService === 0 ? null : 0)}
            >
              <div className="service-icon">🎬</div>
              <h3>Сокращение цикла сделки</h3>
              <p>Меньше времени уходит на прогрев, презентации и убеждение.</p>
              <p>
                &quot;Мы теряем клиентов из-за долгих обсуждений и
                недопонимания&quot;.
              </p>
              <div
                className={`service-overlay ${activeService === 0 ? 'show' : ''}`}
              >
                <div className="case-study">
                  <h4>Превентивная победа</h4>
                  <p>Наши клиенты в среднем сократили цикл сделки в 3 раза.</p>
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
              <p>&quot;Хочу выйти в США, но нужен контент под локаль&quot;.</p>
              <div
                className={`service-overlay ${activeService === 1 ? 'show' : ''}`}
              >
                <div className="case-study">
                  <h4>История успеха</h4>
                  <p>
                    Обычно наш клиент увеличивает конверсию в отклик от 10 раз.
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
              <p>Продукт визуально и эмоционально выигрывает у конкурентов.</p>
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
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Истории Успеха Клиентов</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => {
              const maxLen = isMobile ? 275 : 350;
              const previewText =
                testimonial.text.length > maxLen
                  ? `${testimonial.text.slice(0, maxLen)}...`
                  : testimonial.text;
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
                      Повышение охвата: X{testimonial.reach}
                    </div>
                    <div className="conversion-indicator">
                      Повышение конверсии +{testimonial.conversion}%
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>&quot;{previewText}&quot;</p>
                    <div className="testimonial-author">
                      <strong>{testimonial.name}</strong>
                      {testimonial.website ? (
                        <a
                          href={testimonial.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {testimonial.company}
                        </a>
                      ) : (
                        <span>{testimonial.company}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container text-center my-12 md:my-16">
        <a
          href="https://t.me/m/i23MvBuLOGJi"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button primary block w-full md:w-auto text-base md:text-lg"
          onMouseEnter={() => setIsPageBlurred(true)}
          onMouseLeave={() => setIsPageBlurred(false)}
        >
          <span>📊 Хочу, чтобы вы разобрали мой продукт</span>
          <div className="button-glow"></div>
        </a>
      </div>

      {/*  👉 ставим Roadmap ЗА пределами .container */}
      <AnixLandingPage />

      <div className="container text-center my-12 md:my-16">
        <a
          href="https://t.me/m/i23MvBuLOGJi"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-button primary block w-full md:w-auto text-base md:text-lg"
          onMouseEnter={() => setIsPageBlurred(true)}
          onMouseLeave={() => setIsPageBlurred(false)}
        >
          <span>🚀 Рассчитайте, сколько денег приносит объяснение</span>
          <div className="button-glow"></div>
        </a>
      </div>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Команда, которая продаёт вместо вас</h2>
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
      </section>

      {/* NDA Cases Section */}
      <section className="nda-cases-section">
        <div className="container">
          <h2 className="section-title">
            Что мы уже сделали (и не всегда можем назвать)
          </h2>
          <div className="nda-table-wrapper">
            <table className="nda-table">
              <thead>
                <tr>
                  <th>Сфера применения</th>
                  <th>Что было до видео</th>
                  <th>Что стало после видео</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Корпоративная безопасность</td>
                  <td>3% отклик на тренинги</td>
                  <td>27% вовлечённость, 2× завершения</td>
                </tr>
                <tr>
                  <td>HR в госкорпорации</td>
                  <td>непонимание миссии</td>
                  <td>5 отделов перестроили процессы</td>
                </tr>
                <tr>
                  <td>SaaS в LinkedIn</td>
                  <td>1–2 ответа на 100</td>
                  <td>18% reply rate, 12% демо</td>
                </tr>
                <tr>
                  <td>Видео на IT-фестивале</td>
                  <td>слабый поток</td>
                  <td>+400% у стенда спикера</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section className="lead-form-section">
        <div className="container lead-form-container">
          <h3>Получите чек-лист по explainer-видео</h3>
          <LeadForm />
        </div>
      </section>

      {/* Telegram Subscribe Section */}
      <section className="telegram-subscribe py-20 bg-gradient-to-r from-[#5f35ff] to-[#4ac9ff] text-white text-center">
        <div className="container max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">
            Хотите видеть, как мы собираем видео изнутри?
          </h2>
          <p className="text-lg text-[#e0e0e0] mb-6">
            В Telegram — backstage, советы и примеры лучших роликов Anix
          </p>

          <a
            href="https://t.me/anixpro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[#5f35ff] px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Подписаться → @anixpro
          </a>

          <p className="text-sm text-[#cccccc] mt-6">
            Уже 400+ фаундеров и продактов читают нас каждую неделю
          </p>
        </div>
      </section>

      {/* Pricing & Packages Section */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">Цены и Пакеты</h2>

          <div className="pricing-carousel-container">
            <div
              className="pricing-carousel"
              ref={pricingScrollRef}
              onTouchStart={handlePricingTouchStart}
              onTouchEnd={handlePricingTouchEnd}
              onMouseDown={handlePricingMouseDown}
              onMouseUp={handlePricingMouseUp}
            >
              {Object.entries(pricingPackages).map(([category, packages]) => (
                <div key={category} className="pricing-column">
                  <div className="column-header">
                    <h3>{category}</h3>
                    <div className="column-subtitle">
                      {category === 'Стартапы' &&
                        'Идеально для растущего бизнеса'}
                      {category === 'Средний Бизнес' &&
                        'Оптимально для устоявшихся компаний'}
                      {category === 'Корпорации' &&
                        'Решения корпоративного уровня'}
                    </div>
                  </div>

                  <div className="packages-list">
                    {packages.map((pkg, index) => (
                      <div key={index} className="package-card">
                        <div className="package-header">
                          <h4>{pkg.name}</h4>
                          <div className="package-price">{pkg.price}</div>
                        </div>

                        <button
                          className="details-button"
                          onClick={() =>
                            setExpandedPackage(
                              expandedPackage === `${category}-${index}`
                                ? null
                                : `${category}-${index}`
                            )
                          }
                        >
                          Подробнее{' '}
                          {expandedPackage === `${category}-${index}`
                            ? '−'
                            : '+'}
                        </button>

                        <div
                          className={`package-details ${expandedPackage === `${category}-${index}` ? 'expanded' : ''}`}
                        >
                          <div className="details-content">
                            {pkg.details.map((detail, i) => (
                              <div key={i} className="detail-item">
                                {detail}
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          className="package-cta"
                          onClick={redirectToTelegram}
                        >
                          Начать
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Awards Section */}
      <section className="awards-section">
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
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
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
      </section>

      {/* Brief Section */}
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
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Свяжитесь с Нами</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Готовы революционизировать вашу анимацию?</h3>
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
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="container">
          <h2 className="section-title">Последние Новости</h2>
          <div className="blog-grid">
            <BlogCard
              url="https://vc.ru/ai/2028376-startap-anix-iz-mfti-2d-animatsiya"
              category="Новости"
              headline="Стартап Anix из МФТИ автоматизирует 2D‑анимацию"
              description="VC.ru рассказывает об образовательных корнях проекта и его ИИ‑технологиях."
              date="2025-05-01"
              image="%PUBLIC_URL%/3.png"
            />

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
      </section>

      <CookieBanner />

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
