import React, { Suspense, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Camera,
  ExternalLink,
  FileVideo,
  HardHat,
  Mail,
  MessageCircle,
  MonitorPlay,
  Pill,
  PlayCircle,
  Scissors,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Video,
  Workflow,
} from 'lucide-react';
import '../App.css';
import '../DesignOldPage.css';
import SiteFooter from './SiteFooter';
import logo from '../images/logoanix.png';
import agrotechCaseImage from '../images/cases/agrotech.webp';
import bondarchukCaseImage from '../images/cases/bondarchuk.webp';
import borodinoCaseImage from '../images/cases/borodino.webp';
import clappyCaseImage from '../images/cases/clappy.webp';
import factoryDirectorCaseImage from '../images/cases/factory-director.webp';
import hemoCaseImage from '../images/cases/hemotech-ai.webp';
import koloboxCaseImage from '../images/cases/kolobox.webp';
import littlePrinceCaseImage from '../images/cases/little-prince.webp';
import mftiCaseImage from '../images/cases/mfti-endowment.webp';
import mosfarmaCaseImage from '../images/cases/mosfarma.webp';
import multonCaseImage from '../images/cases/multon-partners.webp';
import startechCaseImage from '../images/cases/startech.webp';
import tpesCaseImage from '../images/cases/tpes.webp';
import yurrobotCaseImage from '../images/cases/yurrobot.webp';

const CookieBanner = React.lazy(() => import('./CookieBanner'));

const telegramUrl = 'https://t.me/anix_helper';
const showreelUrl =
  'https://vkvideo.ru/video_ext.php?oid=-174933827&id=456239051&hash=8a2d51037c33a713&hd=3&autoplay=1';
const videoFolderUrl =
  'https://drive.google.com/drive/folders/1XzaVX00V5xukMZwEF9Vb_WCbco2M7erA';

const directions = [
  {
    title: 'РџСЂРѕРґР°Р¶Рё СЃР»РѕР¶РЅС‹С… B2B-РїСЂРѕРґСѓРєС‚РѕРІ',
    text: 'Explainer-СЂРѕР»РёРєРё, visual sales kits Рё РєРѕРЅС‚РµРЅС‚ РґР»СЏ РїРµСЂРІРѕРіРѕ РєР°СЃР°РЅРёСЏ, РґРµРјРѕ, РєРѕРЅС„РµСЂРµРЅС†РёР№ Рё follow-up.',
    icon: Workflow,
    href: '#cases',
  },
  {
    title: 'Р¤Р°СЂРјР°, MedTech Рё biotech',
    text: 'РњРµС…Р°РЅРёР·Рј РґРµР№СЃС‚РІРёСЏ, РґРѕРІРµСЂРёРµ РІСЂР°С‡РµР№, РјР°СЃРєРѕС‚С‹ РїСЂРµРїР°СЂР°С‚РѕРІ, РєРѕРЅС„РµСЂРµРЅС†РёРѕРЅРЅС‹Рµ СЂРѕР»РёРєРё Рё СЃРµСЂРёРё РјР°С‚РµСЂРёР°Р»РѕРІ.',
    icon: Pill,
    href: '/medicine',
  },
  {
    title: 'РћС…СЂР°РЅР° С‚СЂСѓРґР° Рё HSE',
    text: 'Р’РёРґРµРѕ-onboarding, Life Saving Rules, QR-СЃС†РµРЅР°СЂРёРё, РєР°СЂС‚РѕС‡РєРё, РјР°СЃРєРѕС‚С‹ Рё РєР°РјРїР°РЅРёРё РґР»СЏ СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ.',
    icon: HardHat,
    href: '/hse',
  },
  {
    title: 'Р РµР¶РёСЃСЃСѓСЂР° СЃРѕР±С‹С‚РёР№ Рё AI-СЂРѕР»РёРєРё',
    text: 'Р•РґРёРЅР°СЏ РєРѕРЅС†РµРїС†РёСЏ РјРµСЂРѕРїСЂРёСЏС‚РёСЏ: СЃСЉРµРјРєР°, Р·РІСѓРє, РјРѕРЅС‚Р°Р¶, СЌРєСЂР°РЅРЅС‹Р№ РєРѕРЅС‚РµРЅС‚ Рё AI-РІРёР·СѓР°Р»С‹.',
    icon: Camera,
    href: '#rch',
  },
];

const proofMetrics = [
  {
    value: '15%+',
    label: 'СЃСЂРµРґРЅРёР№ СЂРѕСЃС‚ РєРѕРЅРІРµСЂСЃРёРё РІ РљРџ',
  },
  { value: 'x10', label: 'ERV Сѓ СЂРѕР»РёРєР° С„РѕРЅРґР° РњР¤РўР' },
  { value: '30%', label: 'СЂРѕСЃС‚ РѕС‚РєР»РёРєР° РІ РєРµР№СЃРµ РўРџР­РЎ' },
  { value: '3-7 РґРЅРµР№', label: 'РґР»СЏ Р±С‹СЃС‚СЂС‹С… С„РѕСЂРјР°С‚РѕРІ' },
];

const services = [
  {
    title: 'РЎС‚СЂР°С‚РµРіРёСЏ Рё РґСЂР°РјР°С‚СѓСЂРіРёСЏ',
    text: 'Р Р°Р·Р±РёСЂР°РµРј РІРѕСЂРѕРЅРєСѓ, Р°СѓРґРёС‚РѕСЂРёРё, РІРѕР·СЂР°Р¶РµРЅРёСЏ Рё РѕРґРёРЅ РєР»СЋС‡РµРІРѕР№ СЃС†РµРЅР°СЂРёР№, РєРѕС‚РѕСЂС‹Р№ РґРѕР»Р¶РµРЅ СЃС‚Р°С‚СЊ РїРѕРЅСЏС‚РЅС‹Рј.',
    icon: Brain,
  },
  {
    title: 'AI-РїСЂРѕРґР°РєС€РµРЅ Рё Р°РЅРёРјР°С†РёСЏ',
    text: 'РЎРѕР±РёСЂР°РµРј РІРёР·СѓР°Р»СЊРЅС‹Р№ СЏР·С‹Рє, СЂРѕР»РёРє, РјРѕРЅС‚Р°Р¶, Р·РІСѓРє, Р°РґР°РїС‚Р°С†РёРё Рё РјР°С‚РµСЂРёР°Р»С‹ РІРѕРєСЂСѓРі РѕСЃРЅРѕРІРЅРѕРіРѕ РІРёРґРµРѕ.',
    icon: Sparkles,
  },
  {
    title: 'Р—Р°РїСѓСЃРє РІ РєР°РЅР°Р»Р°С…',
    text: 'Р“РѕС‚РѕРІРёРј РІРµСЂСЃРёРё РґР»СЏ СЃР°Р№С‚Р°, РєРѕРЅС„РµСЂРµРЅС†РёРё, СЂР°СЃСЃС‹Р»РєРё, Telegram, СЌРєСЂР°РЅРѕРІ, QR-С‚РѕС‡РµРє Рё РїСЂРµР·РµРЅС‚Р°С†РёР№.',
    icon: MonitorPlay,
  },
  {
    title: 'РњРµС‚СЂРёРєРё Рё РїРѕРІС‚РѕСЂ',
    text: 'РЎРјРѕС‚СЂРёРј РѕС‚РєР»РёРє, РґРѕСЃРјРѕС‚СЂС‹, РѕС…РІР°С‚С‹, Р»РёРґС‹ Рё СѓСЃРёР»РёРІР°РµРј С‚Рµ СЃРІСЏР·РєРё, РєРѕС‚РѕСЂС‹Рµ СЂРµР°Р»СЊРЅРѕ РґРІРёРіР°СЋС‚ СЃРґРµР»РєСѓ.',
    icon: BarChart3,
  },
];

const featuredCases = [
  {
    name: 'Clappy',
    area: 'B2B2C explainer',
    result:
      'РѕС‚РєР»РёРє РІС‹СЂРѕСЃ РІ РЅРµСЃРєРѕР»СЊРєРѕ РґРµСЃСЏС‚РєРѕРІ СЂР°Р·',
    text: 'РЎР»РѕР¶РЅС‹Р№ РїСЂРѕРґСѓРєС‚ РґР»СЏ РїРѕР»СЊР·РѕРІР°С‚РµР»РµР№ Рё РїСЂРѕРёР·РІРѕРґСЃС‚РІ РїСЂРµРІСЂР°С‚РёР»Рё РІ РєРѕСЂРѕС‚РєСѓСЋ РїРѕРЅСЏС‚РЅСѓСЋ РёСЃС‚РѕСЂРёСЋ. РџРѕСЃР»Рµ Р·Р°РїСѓСЃРєР° РїРѕСЏРІРёР»РёСЃСЊ РїРµСЂРІС‹Рµ РїРёР»РѕС‚С‹.',
    image: clappyCaseImage,
    href: 'https://drive.google.com/file/d/1EYWBYlhSgIK4Wd4F0nTKR1kQxYhXGc5j/view',
  },
  {
    name: 'Hemotech AI',
    area: 'MedTech / AI-РґРёР°РіРЅРѕСЃС‚РёРєР°',
    result: 'СЂРѕР»РёРє СЃС‚Р°Р» С‡Р°СЃС‚СЊСЋ Р±СЂРµРЅРґР°',
    text: 'РЎРЅРёР·РёР»Рё РЅРµРґРѕРІРµСЂРёРµ Рє РёРЅРЅРѕРІР°С†РёРѕРЅРЅРѕРјСѓ РїСЂРѕРґСѓРєС‚Сѓ С‡РµСЂРµР· РјРёРЅРёРјР°Р»РёСЃС‚РёС‡РЅС‹Р№ СЂРѕР»РёРє-РІРёР·РёС‚РєСѓ РґР»СЏ РІСЂР°С‡РµР№, РєР»РёРЅРёРє Рё РєРѕРЅС„РµСЂРµРЅС†РёР№.',
    image: hemoCaseImage,
    href: 'https://drive.google.com/file/d/1Q6RQlNbAKBGugpo-MH1-_6omwwnmPQ8E/view',
  },
  {
    name: 'РўРџР­РЎ',
    area: 'РџСЂРѕРјС‹С€Р»РµРЅРЅС‹Р№ B2B',
    result: '+30% Рє РѕС‚РєР»РёРєСѓ',
    text: 'Р—Р°РјРµРЅРёР»Рё 50-СЃС‚СЂР°РЅРёС‡РЅС‹Рµ РїСЂРµР·РµРЅС‚Р°С†РёРё СЂРѕР»РёРєРѕРј, РєРѕС‚РѕСЂС‹Р№ Р±С‹СЃС‚СЂРѕ РїРѕРєР°Р·С‹РІР°РµС‚ РїСЂРѕР±Р»РµРјСѓ, СЂРµС€РµРЅРёРµ Рё РјРёСЃСЃРёСЋ СЌРЅРµСЂРіРѕСЌС„С„РµРєС‚РёРІРЅРѕСЃС‚Рё.',
    image: tpesCaseImage,
    href: 'https://drive.google.com/file/d/1BgJs_mKyvEVtDlWeaXGY9rmFjPKrTes5/view',
  },
  {
    name: 'Р­РЅРґР°СѓРјРµРЅС‚-С„РѕРЅРґ РњР¤РўР',
    area: 'PR Рё СѓР·РЅР°РІР°РµРјРѕСЃС‚СЊ',
    result: 'Telegram x2, СЃР°Р№С‚ x3, ERV x10',
    text: 'РџРµСЂРµРІРµР»Рё СЂРµР°Р»СЊРЅС‹Рµ С„РѕС‚РѕРіСЂР°С„РёРё РњР¤РўР РІ С‚РµРїР»СѓСЋ Р°РЅРёРјР°С†РёРѕРЅРЅСѓСЋ СЃРёСЃС‚РµРјСѓ, РєРѕС‚РѕСЂР°СЏ СЃС‚Р°Р»Р° РёРЅС„РѕРїРѕРІРѕРґРѕРј Рё С‡Р°СЃС‚СЊСЋ РєРѕРјРјСѓРЅРёРєР°С†РёР№ С„РѕРЅРґР°.',
    image: mftiCaseImage,
    href: '#cases',
  },
  {
    name: 'РњРѕСЃС„Р°СЂРјР°',
    area: 'Р¤Р°СЂРјР° / РўР’-СЂРµРєР»Р°РјР°',
    result:
      'СЂРѕР»РёРє РїСЂРѕС€РµР» С‚СЂРµР±РѕРІР°РЅРёСЏ РџРµСЂРІРѕРіРѕ РєР°РЅР°Р»Р°',
    text: 'РЎРѕС…СЂР°РЅРёР»Рё Р±СЂРµРЅРґ-РїРµСЂСЃРѕРЅР°Р¶РµР№, РЅРѕ СЃРґРµР»Р°Р»Рё РёС… Р¶РёРІРµРµ Рё С‚РµРїР»РµРµ, С‡С‚РѕР±С‹ СЂРµРєР»Р°РјР° РїСЂРµРїР°СЂР°С‚Р° РІС‹Р·С‹РІР°Р»Р° РґРѕРІРµСЂРёРµ.',
    image: mosfarmaCaseImage,
    href: 'https://drive.google.com/file/d/1Uw9e-ZFzg9AVK8NnoN_EHwfR0ZPvD_M0/view',
  },
  {
    name: 'РњСѓР»С‚РѕРЅ РџР°СЂС‚РЅРµСЂСЃ',
    area: 'HSE / Life Saving Rules',
    result: 'РјР°СЃРєРѕС‚ Рё РєР°СЂС‚РѕС‡РєРё СЃС‚Р°Р»Рё СЃРёСЃС‚РµРјРѕР№',
    text: 'РЎ РЅСѓР»СЏ СЂР°Р·СЂР°Р±РѕС‚Р°Р»Рё РїРµСЂСЃРѕРЅР°Р¶Р° РєР°РјРїР°РЅРёРё Рё РІРёР·СѓР°Р»СЊРЅС‹Р№ С„РѕСЂРјР°С‚, РєРѕС‚РѕСЂС‹Р№ РґРµР»Р°РµС‚ РїСЂР°РІРёР»Р° РѕС…СЂР°РЅС‹ С‚СЂСѓРґР° Р·Р°РјРµС‚РЅРµРµ Рё Р¶РёРІРµРµ.',
    image: multonCaseImage,
    href: '/hse',
  },
];

const compactCases = [
  {
    name: 'Kolobox',
    text: 'РџРµСЂРµСѓРїР°РєРѕРІР°Р»Рё СЃРїРѕСЂРЅРѕРµ РІРѕСЃРїСЂРёСЏС‚РёРµ РґРѕСЃС‚Р°РІРєРё РёР·Р»РёС€РєРѕРІ РµРґС‹ РІ РґСЂСѓР¶РµР»СЋР±РЅС‹Р№, СЏСЂРєРёР№ РѕР±СЂР°Р·.',
    image: koloboxCaseImage,
    href: 'https://drive.google.com/file/d/1eI5mODOu-mJ54QLPM_q0YuUP9bWjLN5k/view',
  },
  {
    name: 'Р®Р Р РћР‘РћРў',
    text: '15-СЃРµРєСѓРЅРґРЅС‹Р№ СЂРѕР»РёРє РґР»СЏ Telegram-С‡Р°С‚РѕРІ СЋСЂРёСЃС‚РѕРІ СЃ РїСЂРѕРіРЅРѕР·РѕРј СЃРёР»СЊРЅРѕР№ РєРѕРЅРІРµСЂСЃРёРё РІ Р·Р°СЏРІРєСѓ.',
    image: yurrobotCaseImage,
    href: 'https://drive.google.com/file/d/1bwItNtWXY-IfIrG910jVYGbsOH9BJukR/view',
  },
  {
    name: 'Little Prince',
    text: 'РРјРёРґР¶РµРІС‹Р№ СЂРѕР»РёРє-С„Р°РЅС‚Р°Р·РёСЏ Р·Р° РѕРґРёРЅ РґРµРЅСЊ, РєРѕС‚РѕСЂС‹Р№ СЃРѕР±СЂР°Р» СЃРѕС‚РЅРё РѕС‚Р·С‹РІРѕРІ РѕС‚ РёРЅРґСѓСЃС‚СЂРёРё.',
    image: littlePrinceCaseImage,
    href: 'https://drive.google.com/file/d/1xIOgHxhhloGtBRtrnwp3xpV9AkShUNqT/view',
  },
  {
    name: 'РђРіСЂРѕРўРµС…',
    text: 'РЎСЋР¶РµС‚РЅС‹Р№ СЂРѕР»РёРє РґР»СЏ С…Р°РєР°С‚РѕРЅР°, РєРѕС‚РѕСЂС‹Р№ РїРѕР±РµРґРёР» РІ Р·СЂРёС‚РµР»СЊСЃРєРѕРј РіРѕР»РѕСЃРѕРІР°РЅРёРё.',
    image: agrotechCaseImage,
    href: '#cases',
  },
  {
    name: 'РЎС‚Р°СЂС‚РµС…',
    text: 'РџРµСЂРµСѓРїР°РєРѕРІРєР° РїСЂРѕРґСѓРєС‚Р° РїРѕРґ СЂРµРіРёРѕРЅР°Р»СЊРЅС‹Рµ B2B-РєРѕРјРїР°РЅРёРё Рё СЂРѕР»РёРє РґР»СЏ РїСЂРѕРґР°Р¶.',
    image: startechCaseImage,
    href: '#cases',
  },
  {
    name: 'Р‘РѕРЅРґР°СЂС‡СѓРє',
    text: 'Р—Р° 4 С‡Р°СЃР° СЃРѕР±СЂР°Р»Рё РєРёРЅРµРјР°С‚РѕРіСЂР°С„РёС‡РЅС‹Р№ РїСЂРѕС‚РѕС‚РёРї СЃС†РµРЅС‹ СЃ Р°РєС‚РµСЂСЃРєРёРјРё Р»РёС†Р°РјРё.',
    image: bondarchukCaseImage,
    href: 'https://drive.google.com/file/d/1wnRsoYIgio_MilkNFRlEBuTfgJfzx25d/view',
  },
  {
    name: 'Р‘РѕСЂРѕРґРёРЅРѕ',
    text: 'РСЃС‚РѕСЂРёС‡РµСЃРєРё РїРѕРґРіРѕС‚РѕРІР»РµРЅРЅС‹Р№ СѓР»СЊС‚СЂР°СЂРµР°Р»РёСЃС‚РёС‡РЅС‹Р№ СЂРѕР»РёРє СЃ РІРЅРёРјР°РЅРёРµРј Рє РєРѕСЃС‚СЋРјР°Рј, Р±С‹С‚Сѓ Рё Р°С‚РјРѕСЃС„РµСЂРµ.',
    image: borodinoCaseImage,
    href: 'https://drive.google.com/file/d/1d2iXB33lqPgG3Y0M4e216nzw2QYGmssP/view',
  },
  {
    name: 'Factory Director',
    text: 'РљРѕРЅС„РµСЂРµРЅС†РёРѕРЅРЅС‹Р№ СЂРѕР»РёРє РЅР° Р±Р°Р·Рµ РјР°СЃРєРѕС‚Р°, РєРѕС‚РѕСЂС‹Р№ СЃС‚Р°Р» РІРёР·РёС‚РЅРѕР№ РєР°СЂС‚РѕС‡РєРѕР№ Р±СЂРµРЅРґР°.',
    image: factoryDirectorCaseImage,
    href: '#cases',
  },
];

const rchStack = [
  {
    title: 'Р РµР¶РёСЃСЃРµСЂСЃРєР°СЏ РєРѕРЅС†РµРїС†РёСЏ',
    text: 'РЎРѕР±СЂР°Р»Рё СЃРѕР±С‹С‚РёРµ РєР°Рє С†РµР»СЊРЅРѕРµ РІС‹СЃРєР°Р·С‹РІР°РЅРёРµ, Р° РЅРµ РЅР°Р±РѕСЂ СЂР°Р·СЂРѕР·РЅРµРЅРЅС‹С… СЂРѕР»РёРєРѕРІ Рё СЌРєСЂР°РЅРѕРІ.',
    icon: FileVideo,
  },
  {
    title: 'РЎСЉРµРјРєР° Рё Р·РІСѓРє',
    text: 'РЎРЅСЏР»Рё РјР°С‚РµСЂРёР°Р»С‹ РІ РІС‹СЃРѕРєРѕРј РєР°С‡РµСЃС‚РІРµ, РїСЂРѕРґСѓРјР°Р»Рё Р·РІСѓРє, С‚РµРјРї Рё РѕС‰СѓС‰РµРЅРёРµ РїСЂРёСЃСѓС‚СЃС‚РІРёСЏ.',
    icon: Video,
  },
  {
    title: 'РњРѕРЅС‚Р°Р¶ Рё AI-РІРёР·СѓР°Р»С‹',
    text: 'РЎРѕР±СЂР°Р»Рё СЂРѕР»РёРєРё, РјРѕРЅС‚Р°Р¶РЅС‹Рµ СЃРІСЏР·РєРё Рё AI-С‡Р°СЃС‚Рё С‚Р°Рє, С‡С‚РѕР±С‹ РѕРЅРё СЂР°Р±РѕС‚Р°Р»Рё РЅР° РѕРґРЅСѓ РґСЂР°РјР°С‚СѓСЂРіРёСЋ.',
    icon: Scissors,
  },
];

const process = [
  'РќР°С…РѕРґРёРј, РіРґРµ Р°СѓРґРёС‚РѕСЂРёСЏ С‚РµСЂСЏРµС‚ СЃРјС‹СЃР»: РІ РїРёСЃСЊРјРµ, РґРµРјРѕ, РєРѕРЅС„РµСЂРµРЅС†РёРё, РёРЅСЃС‚СЂСѓРєС†РёРё РёР»Рё РІРЅСѓС‚СЂРµРЅРЅРµР№ РєРѕРјРјСѓРЅРёРєР°С†РёРё.',
  'Р¤РёРєСЃРёСЂСѓРµРј РѕРґРЅСѓ СѓРїСЂР°РІР»СЏРµРјСѓСЋ Р·Р°РґР°С‡Сѓ: РїСЂРѕРґСѓРєС‚РѕРІС‹Р№ СЃС†РµРЅР°СЂРёР№, РїСЂРµРїР°СЂР°С‚, РїСЂР°РІРёР»Рѕ Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё, СЃРѕР±С‹С‚РёРµ РёР»Рё PR-РёРЅС„РѕРїРѕРІРѕРґ.',
  'РџРёС€РµРј РґСЂР°РјР°С‚СѓСЂРіРёСЋ, РІРёР·СѓР°Р»СЊРЅС‹Р№ СЏР·С‹Рє Рё С„РѕСЂРјР°С‚ РІС‹РґР°С‡Рё РґРѕ РїСЂРѕРґР°РєС€РµРЅР°, С‡С‚РѕР±С‹ РЅРµ СЂР°Р·РґСѓРІР°С‚СЊ scope.',
  'РџСЂРѕРёР·РІРѕРґРёРј СЂРѕР»РёРє Рё Р°РґР°РїС‚Р°С†РёРё: РіРѕСЂРёР·РѕРЅС‚Р°Р»СЊ, РІРµСЂС‚РёРєР°Р»СЊ, СЌРєСЂР°РЅ, СЂР°СЃСЃС‹Р»РєР°, РїСЂРµР·РµРЅС‚Р°С†РёСЏ, QR-СЃС‚СЂР°РЅРёС†Р° РёР»Рё РєР°СЂС‚РѕС‡РєРё.',
  'РџРѕРјРѕРіР°РµРј РІСЃС‚СЂРѕРёС‚СЊ РјР°С‚РµСЂРёР°Р» РІ РєР°РЅР°Р» Рё СЃРјРѕС‚СЂРёРј, РіРґРµ РѕРЅ РґР°РµС‚ РѕС‚РєР»РёРє, Р»РёРґС‹, РґРѕСЃРјРѕС‚СЂ РёР»Рё РІРѕРІР»РµС‡РµРЅРёРµ.',
];

const partnerPages = [
  {
    title: 'Anix Medicine',
    text: 'РћС‚РґРµР»СЊРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° РґР»СЏ С„Р°СЂРјС‹, MedTech, biotech, РІСЂР°С‡РµР№, РїСЂРµРїР°СЂР°С‚РѕРІ, РјР°СЃРєРѕС‚РѕРІ Рё visual sales kits.',
    href: '/medicine',
    icon: Stethoscope,
  },
  {
    title: 'Anix HSE',
    text: 'РћС‚РґРµР»СЊРЅР°СЏ СЃС‚СЂР°РЅРёС†Р° РґР»СЏ РѕС…СЂР°РЅС‹ С‚СЂСѓРґР°: video-onboarding, LSR, QR, С‚РµСЃС‚С‹, РєР°СЂС‚РѕС‡РєРё Рё РєР°РјРїР°РЅРёРё.',
    href: '/hse',
    icon: ShieldCheck,
  },
];

function DirectionCard({ item }) {
  const Icon = item.icon;

  return (
    <a className="sr-direction" href={item.href}>
      <Icon aria-hidden="true" />
      <span>{item.title}</span>
      <p>{item.text}</p>
      <ArrowRight aria-hidden="true" />
    </a>
  );
}

function FeaturedCase({ item }) {
  return (
    <article className="sr-case">
      <a className="sr-case-media" href={item.href}>
        <img
          src={item.image}
          alt={`РљРµР№СЃ Anix: ${item.name}`}
          loading="lazy"
        />
      </a>
      <div className="sr-case-copy">
        <p>{item.area}</p>
        <h3>{item.name}</h3>
        <strong>{item.result}</strong>
        <span>{item.text}</span>
      </div>
    </article>
  );
}

function DesignOldPage() {
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  return (
    <main className="studio-refresh">
<section className="sr-hero" id="top">
        <div className="sr-hero-shade" aria-hidden="true" />

        <nav className="sr-nav" aria-label="РќР°РІРёРіР°С†РёСЏ Anix">
          <a className="sr-logo" href="#top" aria-label="Anix Studio">
            <img src={logo} alt="Anix" />
          </a>
          <div className="sr-nav-links">
            <a href="#cases">РљРµР№СЃС‹</a>
            <a href="/medicine">Medicine</a>
            <a href="/hse">HSE</a>
            <a href="#contact">РљРѕРЅС‚Р°РєС‚С‹</a>
          </div>
        </nav>

        <div className="sr-hero-content">
          <p className="sr-eyebrow">
            AI video production / creative direction / sales enablement
          </p>
          <h1>Anix Studio</h1>
          <p className="sr-hero-lead">
            РџСЂРµРІСЂР°С‰Р°РµРј СЃР»РѕР¶РЅС‹Рµ РїСЂРѕРґСѓРєС‚С‹,
            РїСЂРµРїР°СЂР°С‚С‹, РїСЂР°РІРёР»Р° Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё Рё
            СЃРѕР±С‹С‚РёСЏ РІ РІРёР·СѓР°Р»СЊРЅС‹Рµ РёСЃС‚РѕСЂРёРё,
            РєРѕС‚РѕСЂС‹Рµ Р±С‹СЃС‚СЂРѕ РїРѕРЅРёРјР°СЋС‚ РєР»РёРµРЅС‚С‹,
            РІСЂР°С‡Рё, СЃРѕС‚СЂСѓРґРЅРёРєРё, РїР°СЂС‚РЅРµСЂС‹ Рё
            СѓС‡Р°СЃС‚РЅРёРєРё РјРµСЂРѕРїСЂРёСЏС‚РёР№.
          </p>
          <div className="sr-actions">
            <a
              className="sr-button sr-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              РћР±СЃСѓРґРёС‚СЊ РїСЂРѕРµРєС‚
            </a>
            <a
              className="sr-button sr-button-ghost"
              href={videoFolderUrl}
              target="_blank"
              rel="noreferrer"
            >
              <PlayCircle aria-hidden="true" />
              Р’СЃРµ РІРёРґРµРѕ-РєРµР№СЃС‹
            </a>
          </div>
          <div
            className="sr-showreel-panel"
            aria-label="Р“Р»Р°РІРЅС‹Р№ showreel Anix"
          >
            <div className="sr-showreel-frame">
              {isShowreelOpen ? (
                <iframe
                  src={showreelUrl}
                  width="1280"
                  height="720"
                  title="Anix showreel"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <button
                  className="sr-showreel-poster"
                  type="button"
                  onClick={() => setIsShowreelOpen(true)}
                >
                  <PlayCircle aria-hidden="true" />
                  <span>РЎРјРѕС‚СЂРµС‚СЊ showreel</span>
                </button>
              )}
            </div>
            <div className="sr-showreel-caption">
              <span>Showreel</span>
              <p>
                Р•РґРёРЅС‹Р№ СЃСЂРµР·: AI-РІРёРґРµРѕ, Р°РЅРёРјР°С†РёСЏ,
                РјР°СЃРєРѕС‚С‹, С„Р°СЂРјР°, HSE Рё СЂРµР¶РёСЃСЃСѓСЂР°
                СЃРѕР±С‹С‚РёР№.
              </p>
            </div>
          </div>
          <div
            className="sr-proof-row"
            aria-label="РљР»СЋС‡РµРІС‹Рµ СЂРµР·СѓР»СЊС‚Р°С‚С‹"
          >
            {proofMetrics.map((item) => (
              <div key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="sr-direction-band"
        aria-label="РќР°РїСЂР°РІР»РµРЅРёСЏ Anix"
      >
        <div className="sr-container sr-direction-grid">
          {directions.map((item) => (
            <DirectionCard item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="sr-band sr-intro">
        <div className="sr-container sr-two-col">
          <div>
            <p className="sr-eyebrow">Р§С‚Рѕ РёР·РјРµРЅРёР»РѕСЃСЊ</p>
            <h2>
              Anix Р±РѕР»СЊС€Рµ РЅРµ С‚РѕР»СЊРєРѕ РїСЂРѕ РїРѕРґРґРµСЂР¶РєСѓ
              РїСЂРѕРґР°Р¶
            </h2>
          </div>
          <div className="sr-rich-copy">
            <p>
              РџСЂРѕРґР°Р¶Рё СЃР»РѕР¶РЅС‹С… РїСЂРѕРґСѓРєС‚РѕРІ РѕСЃС‚Р°СЋС‚СЃСЏ
              СЃРёР»СЊРЅС‹Рј СЏРґСЂРѕРј. РќРѕ РїРѕСЂС‚С„РµР»СЊ СѓР¶Рµ С€РёСЂРµ:
              С„Р°СЂРјРєРѕРјРїР°РЅРёРё, medtech, РѕС…СЂР°РЅР° С‚СЂСѓРґР°,
              РѕР±СЂР°Р·РѕРІР°С‚РµР»СЊРЅС‹Рµ РєР°РјРїР°РЅРёРё,
              PR-РёРЅС„РѕРїРѕРІРѕРґС‹, РјР°СЃРєРѕС‚С‹,
              РєРёРЅРѕ-РїСЂРѕС‚РѕС‚РёРїС‹ Рё СЂРµР¶РёСЃСЃСѓСЂР° СЃРѕР±С‹С‚РёР№.
            </p>
            <p>
              РџРѕСЌС‚РѕРјСѓ РЅРѕРІР°СЏ РіР»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°
              РїРѕРєР°Р·С‹РІР°РµС‚ Anix РєР°Рє СЃС‚СѓРґРёСЋ РЅРѕРІРѕР№
              Р°РЅРёРјР°С†РёРё Рё AI-РїСЂРѕРґР°РєС€РµРЅР°: РѕС‚ СЃРјС‹СЃР»Р° Рё
              РґСЂР°РјР°С‚СѓСЂРіРёРё РґРѕ СЂРѕР»РёРєР°, Р°РґР°РїС‚Р°С†РёР№,
              Р·Р°РїСѓСЃРєР° Рё РёР·РјРµСЂРёРјРѕРіРѕ СЌС„С„РµРєС‚Р°.
            </p>
          </div>
        </div>
      </section>

      <section className="sr-band sr-services">
        <div className="sr-container">
          <div className="sr-section-head">
            <p className="sr-eyebrow">
              РљР°РєРѕР№ РїСЂРѕРґСѓРєС‚ РїРѕРєСѓРїР°РµС‚ РєР»РёРµРЅС‚
            </p>
            <h2>
              РќРµ РїСЂРѕСЃС‚Рѕ РєСЂР°СЃРёРІРѕРµ РІРёРґРµРѕ, Р° РіРѕС‚РѕРІС‹Р№
              visual asset РїРѕРґ Р·Р°РґР°С‡Сѓ
            </h2>
          </div>
          <div className="sr-service-grid">
            {services.map((item) => {
              const Icon = item.icon;
              return (
                <article className="sr-service" key={item.title}>
                  <Icon aria-hidden="true" />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-band sr-cases" id="cases">
        <div className="sr-container">
          <div className="sr-section-head sr-section-head-row">
            <div>
              <p className="sr-eyebrow">РџРѕСЂС‚С„РѕР»РёРѕ</p>
              <h2>
                РљРµР№СЃС‹, РіРґРµ РІРёРґРµРѕ РјРµРЅСЏР»Рѕ РїРѕРЅРёРјР°РЅРёРµ,
                РґРѕРІРµСЂРёРµ РёР»Рё РѕС‚РєР»РёРє
              </h2>
            </div>
            <a
              className="sr-button sr-button-secondary"
              href={videoFolderUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" />
              РџР°РїРєР° СЃ РІРёРґРµРѕ
            </a>
          </div>
          <div className="sr-case-grid">
            {featuredCases.map((item) => (
              <FeaturedCase item={item} key={item.name} />
            ))}
          </div>
          <div className="sr-compact-grid">
            {compactCases.map((item) => (
              <a className="sr-compact-case" href={item.href} key={item.name}>
                <span className="sr-compact-media">
                  <img
                    src={item.image}
                    alt={`РљРµР№СЃ Anix: ${item.name}`}
                    loading="lazy"
                  />
                </span>
                <span className="sr-compact-title">{item.name}</span>
                <p>{item.text}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sr-band sr-rch" id="rch">
        <div className="sr-container sr-rch-layout">
          <div className="sr-rch-copy">
            <p className="sr-eyebrow">РќРµРѕР±С‹С‡РЅС‹Р№ РєРµР№СЃ</p>
            <h2>
              Р Р§Рљ: РјРµСЂРѕРїСЂРёСЏС‚РёРµ РєР°Рє РµРґРёРЅР°СЏ
              СЂРµР¶РёСЃСЃРµСЂСЃРєР°СЏ СЃРёСЃС‚РµРјР°
            </h2>
            <p>
              Р’ СЌС‚РѕРј РїСЂРѕРµРєС‚Рµ Anix СЂР°Р±РѕС‚Р°Р» РЅРµ РєР°Рє
              РїРѕРґСЂСЏРґС‡РёРє РЅР° РѕРґРёРЅ СЂРѕР»РёРє. РњС‹
              СЂРµР¶РёСЃСЃРёСЂРѕРІР°Р»Рё СЃРѕР±С‹С‚РёРµ: СЃРѕР±СЂР°Р»Рё
              РѕР±С‰СѓСЋ РєРѕРЅС†РµРїС†РёСЋ, СЃРЅСЏР»Рё РјР°С‚РµСЂРёР°Р»С‹,
              РїСЂРѕРґСѓРјР°Р»Рё Р·РІСѓРє, РјРѕРЅС‚Р°Р¶, AI-СЂРѕР»РёРєРё Рё
              СЌРєСЂР°РЅРЅС‹Р№ РєРѕРЅС‚РµРЅС‚ С‚Р°Рє, С‡С‚РѕР±С‹ РІСЃРµ
              СЌР»РµРјРµРЅС‚С‹ Р·РІСѓС‡Р°Р»Рё РєР°Рє РѕРґРЅР° РёСЃС‚РѕСЂРёСЏ.
            </p>
            <div className="sr-actions">
              <a
                className="sr-button sr-button-primary"
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle aria-hidden="true" />
                РћР±СЃСѓРґРёС‚СЊ СЃРѕР±С‹С‚РёРµ
              </a>
              <a className="sr-button sr-button-ghost" href="#top">
                <PlayCircle aria-hidden="true" />
                Р’РµСЂРЅСѓС‚СЊСЃСЏ Рє С€РѕСѓСЂРёР»Сѓ
              </a>
            </div>
          </div>
          <div className="sr-rch-stack">
            {rchStack.map((item) => {
              const Icon = item.icon;
              return (
                <article className="sr-rch-item" key={item.title}>
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
      </section>

      <section className="sr-band sr-pages">
        <div className="sr-container">
          <div className="sr-section-head">
            <p className="sr-eyebrow">РЎРѕСЃРµРґРЅРёРµ СЃС‚СЂР°РЅРёС†С‹</p>
            <h2>
              Р”Р»СЏ РЅРѕРІС‹С… РЅР°РїСЂР°РІР»РµРЅРёР№ РµСЃС‚СЊ
              РѕС‚РґРµР»СЊРЅС‹Рµ РїРѕСЃР°РґРѕС‡РЅС‹Рµ СЃС‚СЂР°РЅРёС†С‹
            </h2>
          </div>
          <div className="sr-page-grid">
            {partnerPages.map((item) => {
              const Icon = item.icon;
              return (
                <a className="sr-page-card" href={item.href} key={item.title}>
                  <Icon aria-hidden="true" />
                  <span>{item.title}</span>
                  <p>{item.text}</p>
                  <ArrowRight aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sr-band sr-process">
        <div className="sr-container sr-two-col">
          <div>
            <p className="sr-eyebrow">РџСЂРѕС†РµСЃСЃ</p>
            <h2>
              РћРіСЂР°РЅРёС‡РёРІР°РµРј scope Р·Р°СЂР°РЅРµРµ, С‡С‚РѕР±С‹
              Р±С‹СЃС‚СЂРѕ РґРѕРІРѕРґРёС‚СЊ РґРѕ СЂРµР·СѓР»СЊС‚Р°С‚Р°
            </h2>
            <p className="sr-muted">
              Р­С‚Рѕ РѕСЃРѕР±РµРЅРЅРѕ РІР°Р¶РЅРѕ РІ С„Р°СЂРјРµ, HSE Рё
              РєРѕСЂРїРѕСЂР°С‚РёРІРЅС‹С… РїСЂРѕРµРєС‚Р°С…: РµСЃС‚СЊ
              СЃРѕРіР»Р°СЃСѓСЋС‰РёРµ, СЌРєСЃРїРµСЂС‚С‹, РїСЂР°РІРёР»Р°,
              РєР°РЅР°Р»С‹ Рё СЂРёСЃРє Р±РµСЃРєРѕРЅРµС‡РЅС‹С… РїСЂР°РІРѕРє.
            </p>
          </div>
          <ol className="sr-process-list">
            {process.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="sr-band sr-closing" id="contact">
        <div className="sr-container sr-closing-inner">
          <div>
            <p className="sr-eyebrow">РЎР»РµРґСѓСЋС‰РёР№ С€Р°Рі</p>
            <h2>
              РџРѕРєР°Р¶РёС‚Рµ РЅР°Рј СЃР»РѕР¶РЅС‹Р№ РїСЂРѕРґСѓРєС‚,
              РїСЂР°РІРёР»Рѕ РёР»Рё СЃРѕР±С‹С‚РёРµ
            </h2>
            <p>
              РњС‹ РІРµСЂРЅРµРјСЃСЏ СЃ С„РѕСЂРјР°С‚РѕРј: РѕРґРёРЅ СЂРѕР»РёРє,
              СЃРµСЂРёСЏ, sales kit, HSE-РїРёР»РѕС‚, pharma-РІРёР·СѓР°Р»,
              РјР°СЃРєРѕС‚, РєРѕРЅС„РµСЂРµРЅС†РёРѕРЅРЅС‹Р№ СЂРѕР»РёРє РёР»Рё
              СЂРµР¶РёСЃСЃРµСЂСЃРєР°СЏ РєРѕРЅС†РµРїС†РёСЏ
              РјРµСЂРѕРїСЂРёСЏС‚РёСЏ.
            </p>
          </div>
          <div className="sr-contact-actions">
            <a
              className="sr-button sr-button-primary"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden="true" />
              РќР°РїРёСЃР°С‚СЊ РІ Telegram
            </a>
            <a
              className="sr-button sr-button-secondary"
              href="mailto:studio@anix-ai.pro"
            >
              <Mail aria-hidden="true" />
              studio@anix-ai.pro
            </a>
          </div>
          <div className="sr-trust-list" aria-label="РџСЂРёР·РЅР°РЅРёРµ Anix">
            <span>
              <BadgeCheck aria-hidden="true" />
              Sber500
            </span>
            <span>
              <BadgeCheck aria-hidden="true" />
              RB Young Awards
            </span>
            <span>
              <BadgeCheck aria-hidden="true" />
              РќРѕРІР°С‚РѕСЂС‹ РњРѕСЃРєРІС‹
            </span>
            <span>
              <BadgeCheck aria-hidden="true" />
              РІС‹РїСѓСЃРєРЅРёРєРё РњР¤РўР Рё Р±РёР·РЅРµСЃ-С€РєРѕР»С‹ РЎР±РµСЂР°
            </span>
          </div>
        </div>
      </section>

      <SiteFooter />

      <Suspense fallback={null}>
        <CookieBanner />
      </Suspense>
    </main>
  );
}

export default DesignOldPage;
