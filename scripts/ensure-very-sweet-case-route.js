const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/seo/routes.json');
const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const routePath = '/cases/very-sweet-case';

config.routes[routePath] = {
  indexable: false,
  kind: 'case',
  title: 'Очень сладкий кейс — ANIX Studio',
  description: 'Кейс ANIX Studio: AI-анимация рецептурной сцены с сохранением персонажей, стиля и production-логики.',
  ogTitle: 'Очень сладкий кейс — ANIX Studio',
  ogDescription: 'Как AI стал инструментом внутри анимационного производства и помог сохранить консистентность персонажей.',
  ogImage: '/og/home.jpg',
  h1: 'Очень сладкий кейс',
  intro: 'Как мы помогали анимационной студии ускорить производство рецептурной сцены с помощью AI-инструментов — и не потерять характер персонажей.',
  sections: [
    { heading: 'Задача: оживить рецепт', body: 'Сториборд, персонажи, локации и минута экранного действия должны были превратиться в анимационный фрагмент, пригодный для дальнейшей студийной работы.' },
    { heading: 'Визуальная консистентность', body: 'Главным ограничением было сохранить узнаваемость персонажей, пропорции, мимику, цветовой характер и внутреннюю логику уже созданного визуального мира.' },
    { heading: 'Production thinking', body: 'ANIX собрала AI-пайплайн, дорабатывала фрагменты, контролировала движение и решала проблему нежелательного motion blur.' }
  ],
  links: [
    { label: 'Все кейсы ANIX', href: '/cases' },
    { label: 'Анимационные ролики', href: '/animation' },
    { label: 'ANIX Studio', href: '/' }
  ],
  breadcrumbs: [
    { label: 'Главная', href: '/' },
    { label: 'Кейсы', href: '/cases' },
    { label: 'Очень сладкий кейс', href: routePath }
  ]
};

fs.writeFileSync(filePath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
console.log(`[very-sweet-case] ensured ${routePath} with noindex, follow`);
