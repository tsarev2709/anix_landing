import React, { useState, useEffect, useRef } from 'react';
import './App.css';

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
      
      // Draw connections
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
      name: 'Алексей Чен',
      role: 'Директор по ИИ',
      image: 'https://images.unsplash.com/photo-1637722883499-7782c2a64f07',
      expertise: ['Нейронные Сети', 'Моушн Дизайн'],
      experience: '8 лет опыта'
    },
    {
      name: 'Мария Родригес',
      role: 'Креативный Руководитель',
      image: 'https://images.unsplash.com/photo-1634794251656-9f286d822b05',
      expertise: ['Креативное Направление', 'ИИ Интеграция'],
      experience: '6 лет опыта'
    },
    {
      name: 'Давид Ким',
      role: 'Технический Руководитель',
      image: 'https://images.unsplash.com/photo-1637722883499-7782c2a64f07',
      expertise: ['Машинное Обучение', 'Анимация'],
      experience: '10 лет опыта'
    },
    {
      name: 'Елена Волкова',
      role: 'Ведущий Аниматор',
      image: 'https://images.unsplash.com/photo-1634794251656-9f286d822b05',
      expertise: ['3D Анимация', 'Визуальные Эффекты'],
      experience: '7 лет опыта'
    },
    {
      name: 'Сергей Новиков',
      role: 'Дата Сайентист',
      image: 'https://images.unsplash.com/photo-1637722883499-7782c2a64f07',
      expertise: ['Глубокое Обучение', 'Компьютерное Зрение'],
      experience: '9 лет опыта'
    },
    {
      name: 'Анна Смирнова',
      role: 'UX/UI Дизайнер',
      image: 'https://images.unsplash.com/photo-1634794251656-9f286d822b05',
      expertise: ['Интерфейс ИИ', 'Пользовательский Опыт'],
      experience: '5 лет опыта'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Сара Джонсон',
      company: 'ТехКорп Инк.',
      text: 'Anix AI преобразил наш рабочий процесс анимации. Результаты потрясающие, а экономия времени невероятная.',
      videoThumbnail: 'https://images.unsplash.com/photo-1642406415849-a410b5d01a94',
      videoUrl: 'https://vimeo.com/1078357836/a4d72de864',
      aiGenerated: 82
    },
    {
      id: 2,
      name: 'Михаил Браун',
      company: 'Креативные Студии',
      text: 'Технология нейронных сетей революционна. Наша продуктивность увеличилась на 300%.',
      videoThumbnail: 'https://images.unsplash.com/photo-1546358789-12e9019c9e84',
      videoUrl: 'https://vimeo.com/1078354208?share=copy',
      aiGenerated: 89
    }
  ];

  const awards = [
    { title: 'ТОП-25 проектов акселератора 2024', category: 'Инновации', year: '2024' },
    { title: 'Победители в номинации "Маркетинг"', category: 'Маркетинг', year: '2024' },
    { title: 'Победители "Меняющие реальность"', category: 'Социальное Воздействие', year: '2024' },
    { title: 'Победители второго потока', category: 'Акселератор', year: '2024' },
    { title: 'Победители', category: 'Общая категория', year: '2023' }
  ];

  const pricingPackages = {
    'Стартапы': [
      { name: 'Meaty Script', price: '100K₽', details: ['⚡ 5 дней доставка', '📊 Базовые метрики', '🎯 Одна концепция', '📝 Сценарий включен'] },
      { name: 'Explain in 30s', price: '250K₽', details: ['⚡ 7 дней доставка', '📊 Продвинутые метрики', '🎯 Несколько концепций', '🎨 Кастомные иллюстрации'] },
      { name: 'Content Start', price: '450K₽', details: ['⚡ 10 дней доставка', '📊 Полная аналитика', '🎯 Брендинговый пакет', '🎬 Несколько форматов'] }
    ],
    'Средний Бизнес': [
      { name: 'Full Production', price: '500K₽', details: ['⚡ 14 дней доставка', '📊 Расширенное отслеживание', '🎯 Мультиплатформа', '🎨 Премиум дизайн'] },
      { name: 'Result Series', price: '650K₽', details: ['⚡ 21 день доставка', '📊 Отслеживание ROI', '🎯 Серийный пакет', '🔄 Правки включены'] },
      { name: 'Feed Content', price: '720K₽', details: ['⚡ 30 дней доставка', '📊 Социальные метрики', '🎯 Контент-календарь', '📱 Все форматы'] }
    ],
    'Корпорации': [
      { name: 'Content System', price: '1.5M₽', details: ['⚡ 45 дней доставка', '📊 Корпоративная аналитика', '🎯 Брендинговая система', '👥 Обучение команды'] },
      { name: 'In-House Team', price: '5M₽', details: ['⚡ 90 дней настройка', '📊 Кастомная панель', '🎯 Полная интеграция', '🛠️ Лицензирование инструментов'] },
      { name: 'Court Viz', price: '1.75M₽', details: ['⚡ 60 дней доставка', '📊 Юридическое соответствие', '🎯 Готово для суда', '📋 Документация'] }
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
      const scrollAmount = 300;
      awardsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
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
      {/* Neural Network Particles Background */}
      <canvas ref={particlesRef} className="particles-canvas" />
      
      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-background">
          <img src="https://images.pexels.com/photos/5475810/pexels-photo-5475810.jpeg" alt="AI Technology" className="hero-bg-image" />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="logo-container">
            <img src="https://github.com/user-attachments/assets/1c4ee8a8-ffc8-43fe-b830-8ab71e326ec3" alt="Anix Logo" className="anix-logo" />
          </div>
          
          <h1 className="hero-title">
            <span className="title-line">Создаём</span>
            <span className="title-line glow-text">ИИ-Анимации</span>
            <span className="title-line">Нового Уровня</span>
          </h1>
          <p className="hero-subtitle">
            Революционная технология нейронных сетей превращает ваше видение в потрясающую анимацию за дни, а не месяцы.
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
          <h2 className="section-title">Революция в Анимации</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🎬</div>
              <h3>Генерация с помощью ИИ</h3>
              <p>Нейронные сети создают потрясающую анимацию из простых описаний</p>
              <div className="service-overlay">
                <div className="case-study">
                  <h4>Кейс: Кампания Nike</h4>
                  <p>Сократили время производства на 85%</p>
                  <div className="metrics">
                    <span>ROI: 340%</span>
                    <span>Время: 2 недели → 2 дня</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h3>Молниеносный Рендеринг</h3>
              <p>Продвинутые алгоритмы оптимизируют каждый кадр для максимального воздействия</p>
              <div className="service-overlay">
                <div className="case-study">
                  <h4>История успеха: Запуск стартапа</h4>
                  <p>Создали 50 анимаций за 1 день</p>
                  <div className="metrics">
                    <span>Скорость: в 10 раз быстрее</span>
                    <span>Качество: 4K HDR</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="service-card">
              <div className="service-icon">🎨</div>
              <h3>Креативный Интеллект</h3>
              <p>ИИ понимает художественные принципы и корпоративные стандарты</p>
              <div className="service-overlay">
                <div className="case-study">
                  <h4>Клиент: Fortune 500</h4>
                  <p>100% соответствие бренду в 200+ активах</p>
                  <div className="metrics">
                    <span>Точность: 99.7%</span>
                    <span>Одобрение: С первого раза</span>
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
          <h2 className="section-title">Эксперты по Нейронным Сетям</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img src={member.image} alt={member.name} className="team-image" />
                  <div className="team-overlay">
                    <div className="expertise-badges">
                      {member.expertise.map((skill, i) => (
                        <span key={i} className="expertise-badge pulse-effect">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <p className="role">{member.role}</p>
                  <p className="experience">{member.experience}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Completely Redesigned Process Timeline */}
      <section ref={processRef} className="process-section-v2">
        <div className="container">
          <h2 className="section-title">Наш ИИ Процесс</h2>
          <div className="process-subtitle">
            Пошаговая трансформация ваших идей в потрясающую анимацию
          </div>
          
          <div className="process-workspace">
            {/* Central AI Brain */}
            <div className="ai-brain-container">
              <div className={`ai-brain ${processInView ? 'active' : ''}`}>
                <div className="brain-core"></div>
                <div className="brain-waves">
                  {Array.from({length: 6}).map((_, i) => (
                    <div key={i} className={`wave wave-${i + 1}`}></div>
                  ))}
                </div>
                <div className="brain-particles">
                  {Array.from({length: 12}).map((_, i) => (
                    <div key={i} className={`particle particle-${i + 1}`}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Process Steps in Circle */}
            <div className="process-circle">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`process-step-v2 step-${index + 1} ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                  style={{
                    '--step-color': step.color,
                    '--step-gradient': step.bgGradient,
                    '--step-delay': `${index * 0.3}s`
                  }}
                >
                  <div className="step-orbit">
                    <div className="step-node">
                      <div className="step-icon-wrapper">
                        <span className="step-icon">{step.icon}</span>
                      </div>
                      <div className="step-number">{index + 1}</div>
                    </div>
                  </div>
                  
                  <div className="step-info-panel">
                    <div className="step-info-content">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.description}</p>
                      
                      <div className="step-metrics">
                        <div className="metric-item">
                          <span className="metric-label">Время:</span>
                          <span className="metric-value">{step.time}</span>
                        </div>
                        <div className="metric-item">
                          <span className="metric-label">Экономия:</span>
                          <span className="metric-value saved">{step.saved}</span>
                        </div>
                      </div>
                      
                      <div className="step-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: index <= currentStep ? step.saved : '0%'}}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="step-features">
                        {step.details.map((detail, i) => (
                          <div key={i} className="feature-tag" style={{'--delay': `${i * 0.1}s`}}>
                            {detail}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection Line to AI Brain */}
                  <div className="connection-line">
                    <div className="line-core"></div>
                    <div className="line-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Process Flow Visualization */}
            <div className="process-flow">
              {processSteps.map((step, index) => (
                <div key={index} className={`flow-step ${index <= currentStep ? 'active' : ''}`}>
                  <div className="flow-dot"></div>
                  {index < processSteps.length - 1 && (
                    <div className="flow-connector">
                      <div className="connector-line"></div>
                      <div className="connector-arrow">→</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="metrics-display">
            <div className="metric-item">
              <div className="metric-number">{counters.projects}+</div>
              <div className="metric-label">Завершенных Проектов</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">{counters.hours}+</div>
              <div className="metric-label">Сэкономленных Часов</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Packages Section */}
      <section className="pricing-section">
        <div className="container">
          <h2 className="section-title">Цены и Пакеты</h2>
          
          <div className="pricing-grid">
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
                  <img src={testimonial.videoThumbnail} alt="Превью видео" />
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
            
            <div className="awards-scroll" ref={awardsScrollRef}>
              {awards.map((award, index) => (
                <div key={index} className="award-card">
                  <div className="award-trophy">
                    <img src="https://images.unsplash.com/photo-1633904275835-4e0e2b7e0a49" alt="Награда" />
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
            <img src={generateQRCode()} alt="QR-код Telegram" />
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
