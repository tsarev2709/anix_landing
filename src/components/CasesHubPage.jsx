import React from 'react';
import { ArrowRight, Camera, HardHat, Sparkles, Stethoscope, Workflow } from 'lucide-react';
import BrandLogo from './BrandLogo';
import SiteFooter from './SiteFooter';
import agrotechImage from '../images/cases/agrotech.webp';
import bondarchukImage from '../images/cases/bondarchuk.webp';
import borodinoImage from '../images/cases/borodino.webp';
import clappyImage from '../images/cases/clappy.webp';
import factoryDirectorImage from '../images/cases/factory-director.webp';
import hemotechImage from '../images/cases/hemotech-ai.webp';
import koloboxImage from '../images/cases/kolobox.webp';
import littlePrinceImage from '../images/cases/little-prince.webp';
import mftiImage from '../images/cases/mfti-endowment.webp';
import mosfarmaImage from '../images/cases/mosfarma.webp';
import multonImage from '../images/cases/multon-partners.webp';
import startechImage from '../images/cases/startech.webp';
import tpesImage from '../images/cases/tpes.webp';
import yurrobotImage from '../images/cases/yurrobot.webp';
import './CasesHubPage.css';

const categories = [
  { id: 'b2b', eyebrow: 'B2B / Technology', title: 'Технологии, B2B и сложные продукты', description: 'Когда продукт сложно объяснить одним слайдом: превращаем механику, пользу и контекст в историю, которую быстрее понимают клиенты, партнёры и инвесторы.', icon: Workflow, cases: [
    { title: 'Factory Director', image: factoryDirectorImage, note: 'Маскот и конференционный ролик для сложного B2B-продукта.', href: null },
    { title: 'Стартех', image: startechImage, note: 'Переупаковка продукта и объясняющий ролик для регионального B2B.', href: null },
    { title: 'Kolobox', image: koloboxImage, note: 'Яркая визуальная история для продукта с непростой первой реакцией аудитории.', href: 'https://drive.google.com/file/d/1eI5mODOu-mJ54QLPM_q0YuUP9bWjLN5k/view' },
    { title: 'ЮРРОБОТ', image: yurrobotImage, note: 'Короткий ролик для узкой профессиональной аудитории.', href: 'https://drive.google.com/file/d/1bwItNtWXY-IfIrG910jVYGbsOH9BJukR/view' },
    { title: 'АгроТех', image: agrotechImage, note: 'История, в которой технологичная отрасль становится живым миром будущего.', href: null },
    { title: 'ТПЭС', image: tpesImage, note: 'Промышленный B2B: объяснить реактивные потери быстрее 50 слайдов.', href: '/cases/tpes/' },
    { title: 'Эндаумент-фонд МФТИ', image: mftiImage, note: 'Анимационная система, которая стала самостоятельным инфоповодом.', href: '/cases/mfti-endowment/' },
    { title: 'Clappy', image: clappyImage, note: 'Explainer для продукта, который раньше приходилось долго объяснять.', href: '/cases/clappy/' },
  ] },
  { id: 'medicine', eyebrow: 'Pharma / MedTech', title: 'Pharma, MedTech и медицина', description: 'Работаем там, где одновременно важны точность, доверие и внимание: медицинские продукты, препараты, научная логика, врачи и пациенты.', icon: Stethoscope, cases: [
    { title: 'Hemotech AI', image: hemotechImage, note: 'Спокойная визуальная система для инновационного MedTech-продукта.', href: '/cases/hemotech-ai/' },
    { title: 'Мосфарма', image: mosfarmaImage, note: 'ТВ-ролик с бренд-персонажами и требованиями федерального эфира.', href: '/cases/mosfarma/' },
    { title: 'Авиандр', image: null, note: 'Медицинская анимация, доказательная база, маскоты и визуальная система препарата.', href: '/cases/aviandr/', placeholder: 'А' },
  ] },
  { id: 'cinema', eyebrow: 'Cinema / Creative', title: 'Cinema & Creative', description: 'Кинематографичные прототипы, исторические миры и авторские эксперименты — там, где важны атмосфера, художественный язык и скорость проверки идеи.', icon: Camera, cases: [
    { title: 'Очень сладкий кейс', image: null, note: 'AI внутри анимационного production: консистентность персонажей, рецептурная сцена и чистое движение.', href: '/cases/very-sweet-case/', placeholder: '🍮' },
    { title: 'Маленький принц', image: littlePrinceImage, note: 'Имиджевый ролик-фантазия, собранный за один день.', href: '/cases/little-prince/' },
    { title: 'Фёдор Бондарчук', image: bondarchukImage, note: 'Кинематографичный прототип сцены с нужной атмосферой за несколько часов.', href: 'https://drive.google.com/file/d/1wnRsoYIgio_MilkNFRlEBuTfgJfzx25d/view' },
    { title: 'Бородино', image: borodinoImage, note: 'Исторический ролик с вниманием к форме, оружию, среде и масштабу.', href: '/cases/borodino/' },
  ] },
  { id: 'hse', eyebrow: 'HSE / Safety', title: 'Охрана труда', description: 'Визуальные системы, которые помогают правилам безопасности не растворяться в регламентах и действительно оставаться в поле внимания сотрудников.', icon: HardHat, cases: [{ title: 'Мултон Партнерс', image: multonImage, note: 'Маскот и визуальная система коммуникации жизненно важных правил.', href: '/cases/multon-partners/', featured: true }] },
];

function CaseCard({ item }) {
  const content = <><div className={`cases-hub-card__media${item.image ? '' : ' cases-hub-card__media--placeholder'}`}>{item.image ? <img src={item.image} alt={`Кейс Anix: ${item.title}`} loading="lazy" /> : <span>{item.placeholder}</span>}</div><div className="cases-hub-card__body"><h3>{item.title}</h3><p>{item.note}</p><span className="cases-hub-card__action">{item.href ? 'Смотреть кейс' : 'Страница кейса готовится'}{item.href ? <ArrowRight aria-hidden="true" /> : null}</span></div></>;
  if (!item.href) return <article className={`cases-hub-card${item.featured ? ' cases-hub-card--featured' : ''}`}>{content}</article>;
  const external = /^https?:\/\//.test(item.href);
  return <a className={`cases-hub-card${item.featured ? ' cases-hub-card--featured' : ''}`} href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{content}</a>;
}

export default function CasesHubPage() {
  return <main className="cases-hub-page"><header className="cases-hub-header"><a href="/" className="cases-hub-logo" aria-label="Anix Studio — на главную"><BrandLogo alt="Anix Studio" width={120} height={44} /></a><a className="cases-hub-header__cta" href="https://t.me/anix_helper" target="_blank" rel="noreferrer">Обсудить проект</a></header><section className="cases-hub-hero"><p className="cases-hub-eyebrow">Кейсы Anix Studio</p><h1>Сложные продукты, которые стали понятными историями</h1><p>Здесь собраны проекты для технологий, B2B, фармы, MedTech, кино и охраны труда.</p><nav className="cases-hub-jump" aria-label="Категории кейсов">{categories.map((category) => <a href={`/cases/${category.id}/`} key={category.id}>{category.title}</a>)}<a href="#events">Events</a></nav></section>{categories.map((category) => { const Icon = category.icon; return <section className="cases-hub-category" id={category.id} key={category.id}><div className="cases-hub-category__head"><div className="cases-hub-category__icon"><Icon aria-hidden="true" /></div><div><p className="cases-hub-eyebrow">{category.eyebrow}</p><h2>{category.title}</h2><p>{category.description}</p><a href={`/cases/${category.id}/`}>Открыть категорию <ArrowRight aria-hidden="true" /></a></div></div><div className={`cases-hub-grid${category.cases.length === 1 ? ' cases-hub-grid--single' : ''}`}>{category.cases.map((item) => <CaseCard item={item} key={item.title} />)}</div></section>; })}<section className="cases-hub-events" id="events"><div className="cases-hub-events__icon"><Sparkles aria-hidden="true" /></div><p className="cases-hub-eyebrow">Events</p><h2>Скоро</h2><p>Добавим проекты с экранным контентом, AI-визуалами и режиссурой событий.</p></section><section className="cases-hub-cta"><p className="cases-hub-eyebrow">Новая задача</p><h2>Не нашли кейс ровно из вашей отрасли?</h2><p>Покажите продукт или идею. Разберёмся в задаче и предложим формат, который имеет смысл именно для неё.</p><a href="https://t.me/anix_helper" target="_blank" rel="noreferrer">Обсудить проект <ArrowRight aria-hidden="true" /></a></section><SiteFooter /></main>;
}
