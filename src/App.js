import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import AnixLandingPage from "./components/AnixLandingPage";
import god from './images/god.jpg';
import bestie from './images/bestie.jpg';
import vanya from './images/vanya.JPG';
import logo from './images/logo.png';
import sber from './images/sber.png';
import yandex from './images/yandex.png';
import inno from './images/inno.png';
import moscow from './images/moscow.png';
import fiztech from './images/fiztech.png';
import clappy from './images/clappy.png';
import hemoai from './images/hemoai.png';
import kolbox from './images/kolbox.png';
import TPES from './images/TPES.png';


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
  
  const heroRef = useRef(null);
  const processRef = useRef(null);
  const particlesRef = useRef(null);
  const awardsScrollRef = useRef(null);
  const pricingScrollRef = useRef(null);
  const swipeStart = useRef(0);
  const pricingSwipeStart = useRef(0);
  const [activeService, setActiveService] = useState(null);

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
          hours: Math.floor(hoursTarget * easeOut)
        });
        
        if (progress < 1) {
          requestAnimationFrame(updateCounters);
        }
      };
      
      updateCounters();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
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
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
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
    }, { threshold: 0.2 });

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
        
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
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
      
      particles.forEach(particle => {
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
      description: 'ИИ анализирует ваш бриф и создает увлекательное повествование', 
      time: '2 часа', 
      saved: '75%', 
      details: ['Обработка брифа', 'Анализ целевой аудитории', 'Оптимизация сценария'],
      color: '#8b45ff',
      bgGradient: 'linear-gradient(135deg, #8b45ff, #b465ff)'
    },
    { 
      title: 'Генерация Ключевых Кадров', 
      icon: '🎯', 
      description: 'Нейронные сети автоматически генерируют идеальные ключевые кадры', 
      time: '4 часа', 
      saved: '60%', 
      details: ['Автоматическое создание ключевых кадров', 'Визуальная композиция', 'Оптимизация тайминга'],
      color: '#20b2aa',
      bgGradient: 'linear-gradient(135deg, #20b2aa, #48cae4)'
    },
    { 
      title: 'ИИ Анимация', 
      icon: '🤖', 
      description: 'Продвинутый ИИ создает плавную, профессиональную анимацию', 
      time: '1 час', 
      saved: '90%', 
      details: ['Нейронный рендеринг', 'Синтез движения', 'Перенос стиля'],
      color: '#ff7f50',
      bgGradient: 'linear-gradient(135deg, #ff7f50, #ff9a76)'
    },
    { 
      title: 'Улучшение', 
      icon: '⚡', 
      description: 'ИИ улучшает качество и добавляет финальные штрихи', 
      time: '30 мин', 
      saved: '85%', 
      details: ['Улучшение качества', 'Цветокоррекция', 'Обработка эффектов'],
      color: '#9d4edd',
      bgGradient: 'linear-gradient(135deg, #9d4edd, #c77dff)'
    },
    { 
      title: 'Доставка', 
      icon: '📊', 
      description: 'Финальная оптимизация и интеграция аналитики', 
      time: '15 мин', 
      saved: '95%', 
      details: ['Оптимизация форматов', 'Настройка аналитики', 'Отслеживание производительности'],
      color: '#06ffa5',
      bgGradient: 'linear-gradient(135deg, #06ffa5, #39ff14)'
    }
  ];

  const teamMembers = [
    {
      name: 'Андрей Царёв',
      role: 'Стратег и продюсер B2B-видео',
      benefit: 'Понимает рынок, превращает суть в продающий аргумент',
      image: god,
      tags: ['B2B', 'Продуктовое позиционирование', 'Драматургия', 'Аналитика']
    },
    {
      name: 'Александра Севостьянова',
      role: 'Сценарист-продажник и режиссёр',
      benefit: 'Превращает сложное в ясную и цепляющую подачу',
      image: bestie,
      tags: ['B2B-питчи', 'Театральная режиссура', 'Продажный текст', 'Клиентские боли']
    },
    {
      name: 'Иван Кухарук',
      role: 'Технический директор',
      benefit: 'Проектирует процесс и следит, чтобы всё работало',
      image: vanya,
      tags: ['Проджект-менеджмент', 'Бизнес-анализ', 'AI-интеграция', 'Процесс']
    },
    {
      name: 'Дарья Косичкина',
      role: 'Нейроаниматор',
      benefit: 'Делает визуал, который объясняет и цепляет',
      image: 'https://images.unsplash.com/photo-1544723495-432537deda45',
      tags: ['2D-анимация', 'Моушн-дизайн', 'Визуальные метафоры', 'Раскадровка']
    },
    {
      name: 'Лидия Солнышко',
      role: 'Нейроаниматор',
      benefit: 'Собирает AI-видео, чтобы быстро и качественно',
      image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
      tags: ['AI-видео', 'Постпродакшн', 'Алгоритмы', 'Motion pipeline']
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Евгений Воронов',
      company: 'Kolobox',
      text: 'Anix AI преобразил наш рабочий процесс анимации. Результаты потрясающие, а экономия времени невероятная.',
      videoThumbnail: kolbox,
      videoUrl: 'https://player.vimeo.com/video/1078357836?h=a4d72de864',
      aiGenerated: 88
    },
    {
      id: 2,
      name: 'Дмитрий из ТПЭС',
      company: 'ТПЭС',
      text: 'Anix AI преобразил наш рабочий процесс анимации. Результаты потрясающие, а экономия времени невероятная.',
      videoThumbnail: TPES,
      videoUrl: 'https://player.vimeo.com/video/1078354208',
      aiGenerated: 91
    },
    {
      id: 3,
      name: 'Татьяна Куркина',
      company: 'Clappy',
      text: 'Anix AI преобразил наш рабочий процесс анимации. Результаты потрясающие, а экономия времени невероятная.',
      videoThumbnail: clappy,
      videoUrl: 'https://player.vimeo.com/video/1078358379?h=8fc297f159',
      aiGenerated: 85
    },
    {
      id: 4,
      name: 'Екатерина Поликер',
      company: 'Hemotech AI',
      text: 'Anix AI преобразил наш рабочий процесс анимации. Результаты потрясающие, а экономия времени невероятная.',
      videoThumbnail: hemoai,
      videoUrl: 'https://player.vimeo.com/video/1078358021?h=afe067a81f',
      aiGenerated: 95
    }
  ];

  const awards = [
    { 
      title: 'ТОП-25 проектов акселератора 2024', 
      category: 'Инновации', 
      year: '2024',
      image: sber
    },
    { 
      title: 'Победители в номинации "Маркетинг"', 
      category: 'Маркетинг', 
      year: '2024',
      image: yandex
    },
    { 
      title: 'Победители "Меняющие реальность"', 
      category: 'Социальное Воздействие', 
      year: '2024',
      image: inno
    },
    { 
      title: 'Победители второго потока', 
      category: 'Акселератор', 
      year: '2024',
      image: moscow
    },
    { 
      title: 'Победители', 
      category: 'Общая категория', 
      year: '2023',
      image: fiztech
    }
  ];

  const pricingPackages = {
    'Стартапы': [
      { name: 'Meaty Script', price: '100K₽', details: ['⚡ 5 дней доставка', '🎯 Что получите: Готовый сценарий + структура + бриф + визуальные советы', '📝 Для кого: Есть продакшн, но нет идей как донести суть'] },
      { name: 'Explain in 30s', price: '250K₽', details: ['⚡ 7 дней доставка', '🎯 Что получите: 1 продающий ролик (сценарий, анимация, звук)', '🎨 Для кого: Нужно быстро объяснить "Кто вы?" без лишних слов'] },
      { name: 'Content Start', price: '450K₽', details: ['⚡ 10 дней доставка', '🎯 Что получите: 3 адаптированных ролика для Reels/Shorts', '🎬 Для кого: Нужен недорогой тест анимации для соцсетей'] }
    ],
    'Средний Бизнес': [
      { name: 'Full Production', price: '500K₽', details: ['⚡ 5 дней доставка', '🎯 Что получите: Полный продакшен + стратегия + адаптация под все сети', '🎨 Для кого: Нужен мощный ролик под лиды, найм или запуск'] },
      { name: 'Result Series', price: '650K₽', details: ['⚡ 25 день доставка', '🎯 Что получите: 3-5 роликов в едином стиле + A/B-тесты', '🔄 Для кого: Нужно вести клиента по воронке контентом'] },
      { name: 'Feed Content', price: '720K₽', details: ['⚡ регулярно',  '🎯 Что получите: Месяц коротких роликов/анимированных постов', '📱 Для кого: Нужна регулярность без постоянных изобретений'] }
    ],
    'Корпорации': [
      { name: 'Content System', price: '1.5M₽', details: ['⚡ 45 дней доставка', '🎯  Что получите: Стратегия + продакшен + аналитика + фокус-группы', '👥 Для кого: Построение устойчивой контент-воронки'] },
      { name: 'In-House Team', price: '5M₽', details: ['⚡ 90 дней настройка', '🎯 Что получите: Построение внутреннего отдела (пайплайн, шаблоны, найм)', '🛠️ Для кого: Контент на потоке без фрилансеров'] },
      { name: 'Court Viz', price: '1.75M₽', details: ['⚡ 60 дней доставка', '🎯 Что получите: Презентации, HR-коммуникация, сериалы, супервайзинг', '📋 Для кого: Решение задач бренда, HR, ESG через анимацию'] }
    ]
  };

  const faqData = [
    {
      question: 'Как работает ИИ-анимация?',
      answer: 'Наша система использует нейронные сети для анализа сценария, автоматического создания ключевых кадров и генерации плавной анимации. ИИ понимает контекст и создает визуально привлекательные анимации, которые точно передают ваше сообщение.'
    },
    {
      question: 'Сколько времени занимает создание анимации?',
      answer: 'Благодаря ИИ-технологиям мы сократили время производства на 90%. Простые проекты готовы за 5 дней, сложные корпоративные решения - за 45-90 дней. Традиционная анимация заняла бы в 10 раз больше времени.'
    },
    {
      question: 'Можно ли вносить правки в готовую анимацию?',
      answer: 'Да! ИИ позволяет быстро вносить изменения на любом этапе. Мы предоставляем 3 раунда правок бесплатно для всех пакетов. Дополнительные правки обсуждаются индивидуально.'
    },
    {
      question: 'Какие форматы анимации вы создаете?',
      answer: 'Мы создаем анимации во всех популярных форматах: MP4, GIF, WebM для веба, высокое разрешение для презентаций, адаптивные форматы для социальных сетей и специальные форматы для конкретных платформ.'
    },
    {
      question: 'Подходит ли это для моей отрасли?',
      answer: 'ИИ-анимация универсальна! Мы работали с клиентами из IT, финансов, образования, здравоохранения, e-commerce и многих других сфер. ИИ адаптируется под специфику любой индустрии.'
    }
  ];

  const redirectToTelegram = () => {
    window.open('https://t.me/anix_helper', '_blank');
  };

  const generateQRCode = () => {
    return `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://t.me/anix_helper`;
  };

  const scrollAwards = (direction) => {
    if (awardsScrollRef.current) {
      const container = awardsScrollRef.current;
      const card = container.querySelector('.award-card');
      const cardWidth =
        window.innerWidth <= 768
          ? container.clientWidth
          : (card ? card.offsetWidth + 32 : 300);
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
    }
  };

  const scrollPricing = (direction) => {
    if (pricingScrollRef.current) {
      const container = pricingScrollRef.current;
      const card = container.querySelector('.pricing-column');
      const cardWidth =
        window.innerWidth <= 768
          ? container.clientWidth
          : (card ? card.offsetWidth + 32 : 400);
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
      {/* Neural Network Particles Background */}
      <canvas ref={particlesRef} className="particles-canvas" />
      
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-background">
          <img src="https://images.pexels.com/photos/5475810/pexels-photo-5475810.jpeg" alt="анимационный ролик объясняющий B2B продукт" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="logo-container">
            <img src={logo} alt="анимационный ролик объясняющий B2B продукт" className="anix-logo" />
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Explainer-видео для бизнеса</span>
            <span className="title-line glow-text">которое помогает продавать</span>
            <span className="title-line">за 10 дней</span>
          </h1>
          <p className="hero-subtitle">
            Революционная технология нейронных сетей делает анимацию сложных продуктов понятной и быстрой.
          </p>
          <button className="cta-button primary" onClick={redirectToTelegram}>
            <span>Создать ИИ-Анимацию</span>
            <div className="button-glow"></div>
          </button>
        </div>
        
        <div className="geometric-shapes">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
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
              <p>"Мы теряем клиентов из-за долгих обсуждений и недопонимания".</p>
              <div className={`service-overlay ${activeService === 0 ? 'show' : ''}`}>
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
              <p>Видео легко тиражируется, работает на новых рынках, языках, партнёрах.</p>
              <p>"Хочу выйти в США, но нужен контент под локаль".</p>
              <div className={`service-overlay ${activeService === 1 ? 'show' : ''}`}>
                <div className="case-study">
                  <h4>История успеха</h4>
                  <p>Обычно наш клиент увеличивает конверсию в отклик от 10 раз.</p>
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
              <p>"На фоне других выглядим скучно, нас не запоминают".</p>
              <div className={`service-overlay ${activeService === 2 ? 'show' : ''}`}>
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
            

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
      <h2 className="section-title">Команда, которая продаёт вместо вас</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img src={member.image} alt="анимационный ролик объясняющий B2B продукт" className="team-image" />
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




      {/*  👉 ставим Roadmap ЗА пределами .container */}
      <AnixLandingPage />


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
                    {category === 'Стартапы' && 'Идеально для растущего бизнеса'}
                    {category === 'Средний Бизнес' && 'Оптимально для устоявшихся компаний'}
                    {category === 'Корпорации' && 'Решения корпоративного уровня'}
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
                        onClick={() => setExpandedPackage(
                          expandedPackage === `${category}-${index}` ? null : `${category}-${index}`
                        )}
                      >
                        Подробнее {expandedPackage === `${category}-${index}` ? '−' : '+'}
                      </button>
                      
                      <div className={`package-details ${expandedPackage === `${category}-${index}` ? 'expanded' : ''}`}>
                        <div className="details-content">
                          {pkg.details.map((detail, i) => (
                            <div key={i} className="detail-item">{detail}</div>
                          ))}
                        </div>
                      </div>
                      
                      <button className="package-cta" onClick={redirectToTelegram}>
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

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">Истории Успеха Клиентов</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="video-preview" onClick={() => {
                  setSelectedVideo(testimonial);
                  setShowVideoModal(true);
                }}>
                  <img src={testimonial.videoThumbnail} alt="анимационный ролик объясняющий B2B продукт" />
                  <div className="video-play-button">
                    <div className="play-icon">▶</div>
                  </div>
                  <div className="ai-indicator">
                    Генерация ИИ: {testimonial.aiGenerated}%
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Awards Section */}
      <section className="awards-section">
        <div className="container">
          <h2 className="section-title">Признание Индустрии</h2>
          
          <div className="awards-scroll-container">
            <button className="scroll-button left" onClick={() => scrollAwards('left')}>
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
                <div key={index} className="award-card">
                  <div className="award-trophy">
                    <img src={award.image} alt="анимационный ролик объясняющий B2B продукт" />
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
            
            <button className="scroll-button right" onClick={() => scrollAwards('right')}>
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
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <div className="faq-icon">{activeFAQ === index ? '−' : '+'}</div>
                </button>
                <div className={`faq-answer ${activeFAQ === index ? 'expanded' : ''}`}>
                  <div className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Свяжитесь с Нами</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Готовы революционизировать вашу анимацию?</h3>
              <p>Свяжитесь с нами любым удобным способом. Мы ответим в течение часа!</p>
              
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
                    <a href="https://t.me/anix_helper" target="_blank" rel="noopener noreferrer">@anix_helper</a>
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
            <article className="blog-card">
              <div className="blog-category">
                <span className="category-tag">#ТехнологииАнимации</span>
              </div>
              <h3>Будущее ИИ-анимации: Нейронные сети против традиционных методов</h3>
              <p>Исследуем, как нейронные сети революционизируют индустрию анимации...</p>
              <div className="blog-meta">
                <span>5 мин чтения</span>
                <span>Дек 2024</span>
              </div>
            </article>
            
            <article className="blog-card">
              <div className="blog-category">
                <span className="category-tag">#ТехнологииАнимации</span>
              </div>
              <h3>Кейс: Как мы сократили время анимации на 90%</h3>
              <p>Глубокий анализ нашего ИИ-конвейера анимации и результатов...</p>
              <div className="blog-meta">
                <span>8 мин чтения</span>
                <span>Ноя 2024</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Floating Telegram Button */}
      <div 
        className="floating-telegram"
        onMouseEnter={() => setShowQRCode(true)}
        onMouseLeave={() => setShowQRCode(false)}
        onClick={redirectToTelegram}
      >
        <div className="telegram-icon">✈</div>
        <span>Написать в Telegram</span>
        <div className="telegram-glow"></div>
        
        {showQRCode && (
          <div className="qr-modal">
            <img src={generateQRCode()} alt="анимационный ролик объясняющий B2B продукт" />
            <p>Сканируйте для связи</p>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="video-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowVideoModal(false)}>×</button>
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
                ></iframe>
                <div className="progress-bar-container">
                  <div className="progress-label">Контент, сгенерированный ИИ</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${selectedVideo.aiGenerated}%`}}
                    ></div>
                  </div>
                  <div className="progress-percentage">{selectedVideo.aiGenerated}%</div>
                </div>
                <div className="modal-info">
                  <h3>{selectedVideo.name}</h3>
                  <p>{selectedVideo.company}</p>
                  <p>"{selectedVideo.text}"</p>
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
