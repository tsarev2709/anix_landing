import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Play, Zap, BarChart3, Palette, Brain } from 'lucide-react';
import one from '../images/1.png';
import two from '../images/2.png';
import three from '../images/3.png';
import four from '../images/4.png';
import five from '../images/5.png';
import six from '../images/6.png';

// Helper for responsive images
const makeSrcSet = (img) => `${img} 1x, ${img} 2x`;
const responsiveSizes = '(max-width: 768px) 100vw, 600px';

const AnixLandingPage = () => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeStep, setActiveStep] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const processSteps = [
    {
      id: 1,
      title: "Диагностика",
      subtitle: "Разбираем, где болит",
      description: "Выясняем, где у вас «проседает»: в воронке, понимании продукта, объяснении для клиентов или сопротивлении закупщиков. Роем глубже, чем бриф.",
      icon: <Brain className="w-8 h-8" />,
      image: one,
      color: "from-anix-purple to-anix-coral",
      delay: 0
    },
    {
      id: 2,
      title: "Месседж",
      subtitle: "Что нужно вбить в голову клиенту",
      description: "Формулируем ключевое сообщение, которое должно застрять в голове. Основа — не креатив, а логика продаж.",
      icon: <Zap className="w-8 h-8" />,
      image: two,
      color: "from-anix-teal to-anix-purple",
      delay: 0.1
    },
    {
      id: 3,
      title: "Сценарий",
      subtitle: "Упаковка сложного продукта в 60 секунд",
      description: "Собираем из боли, пользы и решений ясный сценарий. Без воды, с конкретными смыслами, которые двигают клиента к действию. Умеем делать так, чтобы это цепляло.",
      icon: <Palette className="w-8 h-8" />,
      image: three,
      color: "from-anix-coral to-anix-teal",
      delay: 0.2
    },
    {
      id: 4,
      title: "Визуализация",
      subtitle: "Видео, понятное даже закупщику",
      description: "Готовим раскадровку, подбираем визуальные метафоры и стиль. Не ради красоты — ради ясности и понимания.",
      icon: <Play className="w-8 h-8" />,
      image: four,
      color: "from-anix-coral to-anix-teal",
      delay: 0.3
    },
    {
      id: 5,
      title: "AI-Продакшн",
      subtitle: "Быстро. Качественно. Без студийных затрат",
      description: "Собираем финальный ролик с помощью AI-инструментов и отточенного пайплайна. За 10 дней, а не за 3 месяца.",
      icon: <BarChart3 className="w-8 h-8" />,
      image: five,
      color: "from-anix-teal to-anix-coral",
      delay: 0.4
    },
    {
      id: 6,
      title: "Проверка в бою",
      subtitle: "Видео для воронки продаж",
      description: "Тестируем в бою: воронка, охват, питч инвесторам или onboarding. Увеличить конверсию с помощью видео и улучшить восприятие продукта.",
      icon: <BarChart3 className="w-8 h-8" />,
      image: six,
      color: "from-anix-teal to-anix-coral",
      delay: 0.5
    }
  ];

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const FloatingOrb = ({ delay, size, color }) => (
    <motion.div
      className={`absolute rounded-full blur-xl opacity-20 ${color}`}
      style={{
        width: size,
        height: size,
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.2, 0.8, 1],
      }}
      transition={{
        duration: 20,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );

  const TimelineConnector = ({ isActive, index }) => (
    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-32 mt-4">
      <motion.div
        className="w-full h-full bg-gradient-to-b from-anix-purple via-anix-teal to-anix-coral opacity-30"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0.3 }}
        transition={{ duration: 1, delay: index * 0.2 * (isMobile ? 0.5 : 1) }}
        style={{ originY: 0 }}
      />
      <motion.div
        className="absolute inset-0 w-full bg-gradient-to-b from-anix-purple to-anix-teal"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 * (isMobile ? 0.5 : 1) + 0.5 }}
        style={{ originY: 0 }}
      />
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-anix-dark overflow-hidden relative">
      {/* Animated Background Orbs */}
      <FloatingOrb delay={0} size="300px" color="bg-anix-purple" />
      <FloatingOrb delay={5} size="200px" color="bg-anix-teal" />
      <FloatingOrb delay={10} size="250px" color="bg-anix-coral" />
      
      {/* Cursor Following Gradient */}
      <motion.div
        className="fixed w-96 h-96 rounded-full bg-gradient-radial from-anix-purple/10 to-transparent pointer-events-none z-10"
        animate={{
          x: cursorPosition.x - 192,
          y: cursorPosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-20"
        style={{ y, opacity }}
      >

        {/* Our Process Timeline */}
        <section ref={timelineRef} className="pt-20 pb-10 px-4">
          <div className="roadmap-container">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6">
                Анимация сложных продуктов: путь к идеальной подаче
              </h3>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                От бизнес-задачи до измеримого результата — наш отлаженный AI-процесс создает мощную анимацию в рекордные сроки
              </p>
            </motion.div>

            {/* Timeline Container */}
            <div className="relative">
              {processSteps.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={activeStep >= index}
                  setActiveStep={setActiveStep}
                  isLast={index === processSteps.length - 1}
                />
              ))}
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

const TimelineStep = ({ step, index, isActive, setActiveStep, isLast, isMobile }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold: 0.3,
    margin: "-100px 0px"
  });

  useEffect(() => {
    if (isInView) {
      setActiveStep(index);
    }
  }, [isInView, index, setActiveStep]);

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className="relative mb-32"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: step.delay * (isMobile ? 0.5 : 1) }}
      viewport={{ once: true }}
    >
      {/* Timeline Connector */}
      {!isLast && (
        <div className="absolute left-1/2 transform -translate-x-1/2 top-48 w-1 h-32 z-10 hidden md:block">
          <motion.div
            className="w-full h-full bg-gradient-to-b from-transparent via-anix-purple/30 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isActive ? 1 : 0.3 }}
          transition={{ duration: 1.5, delay: index * 0.3 * (isMobile ? 0.5 : 1) }}
            style={{ originY: 0 }}
          />
        </div>
      )}

      <div className={`flex items-center gap-16 flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
        {/* Content Side */}
        <motion.div
          className="flex-1"
          initial={{ x: isEven ? -100 : 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: step.delay * (isMobile ? 0.5 : 1) + 0.2 }}
          viewport={{ once: true }}
        >
          <div className={`${isEven ? 'md:text-right md:pr-8 md:ml-auto' : 'md:text-left md:pl-8 md:mr-auto'} max-w-md text-center mx-auto`}>
            <motion.div
              className={`inline-flex items-center gap-3 mb-4 ${isEven ? 'flex-row-reverse' : 'flex-row'}`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} text-white shadow-lg`}>
                {step.icon}
              </div>
              <span className="text-6xl font-heading font-black text-white/20">
                0{step.id}
              </span>
            </motion.div>

            <motion.h4
              className="text-4xl md:text-5xl font-heading font-bold text-white mb-3"
              whileHover={{ 
                scale: 1.02,
              }}
              transition={{ duration: 0.3 }}
            >
              {step.title}
            </motion.h4>

            <p className="text-xl text-anix-teal font-semibold mb-4">
              {step.subtitle}
            </p>

            <p className="text-lg text-white/80 leading-relaxed">
              {step.description}
            </p>
          </div>
        </motion.div>

        {/* Central Timeline Node */}
        <motion.div
          className="relative z-20 hidden md:block"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15, 
            delay: step.delay * (isMobile ? 0.5 : 1) + 0.4
          }}
          viewport={{ once: true }}
        >
          <motion.div
            className="w-6 h-6 rounded-full bg-gradient-to-r from-anix-purple to-anix-teal shadow-lg"
            animate={isActive ? {
              boxShadow: [
                "0 0 20px rgba(110, 15, 216, 0.6)",
                "0 0 40px rgba(0, 224, 176, 0.8)",
                "0 0 20px rgba(110, 15, 216, 0.6)"
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Image Side */}
        <motion.div
          className="flex-1"
          initial={{ x: isEven ? 100 : -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: step.delay * (isMobile ? 0.5 : 1) + 0.3 }}
          viewport={{ once: true }}
        >
          <motion.div
            className={`relative ${isEven ? 'md:pl-8 md:mr-auto' : 'md:pr-8 md:ml-auto'} mt-8 md:mt-0 max-w-md`}
            whileHover={{ scale: 1.02, rotateY: isEven ? 5 : -5 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 p-1">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-anix-purple/20 via-anix-teal/20 to-anix-coral/20 rounded-2xl"
                animate={{
                  background: [
                    "linear-gradient(45deg, rgba(110, 15, 216, 0.2), rgba(0, 224, 176, 0.2))",
                    "linear-gradient(45deg, rgba(0, 224, 176, 0.2), rgba(255, 122, 109, 0.2))",
                    "linear-gradient(45deg, rgba(255, 122, 109, 0.2), rgba(110, 15, 216, 0.2))"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <img
                src={step.image}
                srcSet={makeSrcSet(step.image)}
                sizes={responsiveSizes}
                alt="анимационный ролик объясняющий B2B продукт"
                width="600"
                height="256"
                className="relative z-10 w-full h-64 object-cover rounded-xl"
                loading="lazy"
              />

              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnixLandingPage;
