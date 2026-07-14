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
import { toPublicHref } from '../seo/SeoHead';
import BrandLogo from './BrandLogo';
import './SiteFooter.css';

const telegramUrl = 'https://t.me/anix_helper';
const emailUrl = 'mailto:studio@anix-ai.pro';
const videoFolderUrl =
  'https://drive.google.com/drive/folders/1XzaVX00V5xukMZwEF9Vb_WCbco2M7erA';

const pageLinks = [
  { label: 'Главная', href: '/' },
  { label: 'Кейсы', href: '/cases' },
  { label: 'Medicine', href: '/medicine' },
  { label: 'HSE', href: '/hse' },
  { label: 'CEO', href: '/ceo' },
  { label: 'Почему работает', href: '/why_it_works' },
  { label: 'Проект «Рыбки»', href: '/rybki' },
  { label: 'Кейс Hemotech AI', href: '/cases/hemotech-ai' },
  { label: 'Кейс Мултон Партнерс', href: '/cases/multon-partners' },
  { label: 'HSE-демо', href: '/hse/mvp' },
  { label: 'Политика обработки персональных данных', href: '/personal-data' },
  { label: 'Политика конфиденциальности', href: '/privacy' },
];

const directionLinks = [
  {
    label: 'Фарма и MedTech',
    href: '/medicine',
    icon: Pill,
  },
  {
    label: 'Охрана труда и HSE',
    href: '/hse',
    icon: HardHat,
  },
  {
    label: 'CEO Anix',
    href: '/ceo',
    icon: Sparkles,
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
  const href = item.external ? item.href : toPublicHref(item.href);

  return (
    <a
      href={href}
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
          <a href="/" aria-label="Anix Studio">
            <BrandLogo className="anix-site-footer__logo" alt="Anix Studio" width={120} height={44} />
          </a>
          <p>
            AI-видео, анимация, маскоты и визуальные системы для сложных
            продуктов, фармы, HSE и событий.
          </p>
        </div>

        <nav className="anix-site-footer__nav" aria-label="Страницы Anix">
          <h2>Страницы</h2>
          {pageLinks.map((item) => (
            <FooterLink item={item} key={item.href} />
          ))}
        </nav>

        <nav className="anix-site-footer__nav" aria-label="Направления Anix">
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
        <span>Anix Studio</span>
        <a href={toPublicHref('/medicine')}>
          Medicine <ArrowRight aria-hidden="true" />
        </a>
        <a href={toPublicHref('/hse')}>
          HSE <ArrowRight aria-hidden="true" />
        </a>
        <a href={toPublicHref('/ceo')}>
          CEO <ArrowRight aria-hidden="true" />
        </a>
        <a href={toPublicHref('/personal-data')}>Политика обработки персональных данных</a>
        <a href={toPublicHref('/privacy')}>Политика конфиденциальности</a>
      </div>
    </footer>
  );
}
