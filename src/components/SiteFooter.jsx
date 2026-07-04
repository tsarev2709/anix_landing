import React from 'react';
import {
  ArrowRight,
  ExternalLink,
  HardHat,
  Mail,
  MessageCircle,
  Pill,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import logo from '../images/logoanix.png';
import './SiteFooter.css';

const telegramUrl = 'https://t.me/anix_helper';
const emailUrl = 'mailto:anix.ai@yandex.ru';
const videoFolderUrl =
  'https://drive.google.com/drive/folders/1XzaVX00V5xukMZwEF9Vb_WCbco2M7erA';

const pageLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Кейсы', href: '/#cases' },
  { label: 'Medicine', href: '/medicine/' },
  { label: 'HSE', href: '/hse/' },
  { label: 'HSE-демо', href: '/hse/mvp' },
  { label: 'Почему работает', href: '/why_it_works/' },
  { label: 'Тестовый дизайн', href: '/design1test/' },
  { label: 'Старый дизайн', href: '/design_old/' },
];

const directionLinks = [
  {
    label: 'Фарма и MedTech',
    href: '/medicine/',
    icon: Pill,
  },
  {
    label: 'Охрана труда и HSE',
    href: '/hse/',
    icon: HardHat,
  },
  {
    label: 'Все видео-кейсы',
    href: videoFolderUrl,
    icon: PlayCircle,
    external: true,
  },
];

function FooterLink({ item }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noreferrer' : undefined}
    >
      {Icon ? <Icon aria-hidden="true" /> : null}
      {item.label}
      {item.external ? <ExternalLink aria-hidden="true" /> : null}
    </a>
  );
}

export default function SiteFooter() {
  return (
    <footer className="anix-site-footer">
      <div className="anix-site-footer__inner">
        <div className="anix-site-footer__brand">
          <a href="/" aria-label="ANIX Studio">
            <img src={logo} alt="ANIX" />
          </a>
          <p>
            AI-видео, анимация, маскоты и визуальные системы для сложных
            продуктов, фармы, HSE и событий.
          </p>
        </div>

        <nav className="anix-site-footer__nav" aria-label="Страницы ANIX">
          <h2>Страницы</h2>
          {pageLinks.map((item) => (
            <FooterLink item={item} key={item.href} />
          ))}
        </nav>

        <nav className="anix-site-footer__nav" aria-label="Направления ANIX">
          <h2>Направления</h2>
          {directionLinks.map((item) => (
            <FooterLink item={item} key={item.href} />
          ))}
        </nav>

        <div className="anix-site-footer__contact">
          <h2>Контакт</h2>
          <a
            className="anix-site-footer__button"
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle aria-hidden="true" />
            Telegram
          </a>
          <a className="anix-site-footer__button" href={emailUrl}>
            <Mail aria-hidden="true" />
            Email
          </a>
          <p>
            <Sparkles aria-hidden="true" />
            Сложные штуки можно объяснять нормально.
          </p>
        </div>
      </div>

      <div className="anix-site-footer__bottom">
        <span>ANIX Studio</span>
        <a href="/medicine/">
          Medicine <ArrowRight aria-hidden="true" />
        </a>
        <a href="/hse/">
          HSE <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}
