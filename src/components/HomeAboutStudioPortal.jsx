import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Clapperboard, FlaskConical, Layers3, Sparkles } from 'lucide-react';
import foundersPhoto from '../images/ceo/alexandra-andrey-anix.webp';
import './HomeAboutStudioPortal.css';

const principles = [
  {
    title: 'Режиссура и драматургия',
    text: 'Основатели студии Андрей Царёв и Александра Севостьянова сами работают со сценариями и режиссурой. Внутри команды — более 10 лет опыта в драматургии и создании историй.',
    icon: Clapperboard,
  },
  {
    title: 'Наукоёмкий бэкграунд',
    text: 'В команде есть опыт работы с научными и технологическими темами. Поэтому мы умеем разбираться в сложной фактуре, а не только красиво её оформлять.',
    icon: FlaskConical,
  },
  {
    title: 'AI + классический продакшн',
    text: 'Anix — полноценная анимационная студия. AI мы профессионально используем как часть режиссёрского и производственного процесса — вместе с анимацией, дизайном, монтажом и постпродакшном.',
    icon: Sparkles,
  },
  {
    title: 'От ролика до визуальной системы',
    text: 'Можем сделать один ролик, а можем развить из него маскота, стиль, серию материалов, презентационные и обучающие форматы.',
    icon: Layers3,
  },
];

function AboutStudioSection() {
  return (
    <section className="d1-section d1-about-studio" id="about-studio">
      <div className="d1-container d1-about-studio__layout">
        <div className="d1-about-studio__media">
          <img
            src={foundersPhoto}
            alt="Основатели Anix Studio Андрей Царёв и Александра Севостьянова"
            loading="lazy"
          />
          <span className="d1-about-studio__caption">Андрей Царёв и Александра Севостьянова</span>
        </div>

        <div className="d1-about-studio__content">
          <p className="d1-eyebrow">О студии</p>
          <h2>Anix собирает сложные продукты в истории, которые хочется досмотреть</h2>
          <p className="d1-about-studio__lead">
            Мы соединяем режиссуру, драматургию, анимацию и современные AI-инструменты,
            чтобы объяснять то, что трудно показать одним кадром или пересказать одним абзацем.
          </p>

          <div className="d1-about-studio__principles">
            {principles.map((item) => {
              const Icon = item.icon;
              return (
                <article className="d1-about-studio__principle" key={item.title}>
                  <Icon aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeAboutStudioPortal({ path }) {
  const [host, setHost] = useState(null);

  useEffect(() => {
    if (path !== '/') return undefined;

    let createdHost = null;
    let observer = null;

    const attach = () => {
      if (document.querySelector('.d1-about-studio-host')) return true;
      const finalCta = document.querySelector('.d1-final-cta');
      if (!finalCta?.parentNode) return false;

      createdHost = document.createElement('div');
      createdHost.className = 'd1-about-studio-host';
      finalCta.parentNode.insertBefore(createdHost, finalCta);
      setHost(createdHost);
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => {
        if (attach()) observer?.disconnect();
      });
      observer.observe(document.getElementById('root') || document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      observer?.disconnect();
      if (createdHost?.parentNode) createdHost.parentNode.removeChild(createdHost);
      setHost(null);
    };
  }, [path]);

  if (!host) return null;
  return createPortal(<AboutStudioSection />, host);
}
