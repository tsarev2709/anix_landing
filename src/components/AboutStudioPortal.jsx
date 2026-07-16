import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import foundersPhoto from '../images/ceo/alexandra-andrey-anix.webp';
import './AboutStudioPortal.css';

const pillars = [
  {
    title: 'Режиссура и драматургия',
    text: 'Основатели студии Андрей Царёв и Александра Севостьянова сами работают со сценариями и режиссурой. В команде — более 10 лет опыта в драматургии и создании историй.',
  },
  {
    title: 'Наукоёмкий бэкграунд',
    text: 'В команде есть опыт работы с научными и технологическими темами. Поэтому мы умеем разбираться в сложной фактуре, а не только красиво её оформлять.',
  },
  {
    title: 'AI + классический продакшн',
    text: 'Anix — полноценная анимационная студия. Мы профессионально используем AI как часть режиссёрского и производственного процесса — вместе с анимацией, дизайном, монтажом и другими инструментами.',
  },
  {
    title: 'От ролика до визуальной системы',
    text: 'Можем сделать один ролик, а можем развить из него маскота, визуальный язык, серию материалов, презентационные и обучающие форматы.',
  },
];

export default function AboutStudioPortal({ path }) {
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (path !== '/') return undefined;

    let portalNode = null;
    let observer = null;

    const attach = () => {
      const finalCta = document.querySelector('.d1-final-cta');
      if (!finalCta || portalNode) return false;

      portalNode = document.createElement('div');
      portalNode.dataset.aboutStudioPortal = 'true';
      finalCta.parentNode.insertBefore(portalNode, finalCta);
      setMountNode(portalNode);
      return true;
    };

    if (!attach()) {
      observer = new MutationObserver(() => {
        if (attach() && observer) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      if (observer) observer.disconnect();
      if (portalNode?.parentNode) portalNode.parentNode.removeChild(portalNode);
    };
  }, [path]);

  if (path !== '/' || !mountNode) return null;

  return createPortal(
    <section className="d1-section d1-about-studio" id="about-studio" aria-labelledby="about-studio-title">
      <div className="d1-container d1-about-studio-layout">
        <div className="d1-about-studio-media">
          <img
            src={foundersPhoto}
            alt="Основатели Anix Studio Андрей Царёв и Александра Севостьянова"
            loading="lazy"
            decoding="async"
          />
          <p className="d1-about-studio-caption">Андрей Царёв и Александра Севостьянова — основатели Anix Studio</p>
        </div>

        <div className="d1-about-studio-copy">
          <p className="d1-eyebrow">О студии</p>
          <h2 id="about-studio-title">Собираем сложные темы в истории, которые хочется досмотреть</h2>
          <p className="d1-about-studio-intro">
            Anix Studio объединяет режиссуру, драматургию, анимацию и современные AI-инструменты. Мы работаем с продуктами и темами, где одного красивого кадра недостаточно: сначала нужно разобраться, что именно человек должен понять и почувствовать.
          </p>

          <div className="d1-about-studio-pillars">
            {pillars.map((pillar) => (
              <article className="d1-about-studio-pillar" key={pillar.title}>
                <h3>{pillar.title}</h3>
                <p>{pillar.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>,
    mountNode,
  );
}
