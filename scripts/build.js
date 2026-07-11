const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function patchFile(relativePath, transform) {
  const filePath = path.join(root, relativePath);
  const current = fs.readFileSync(filePath, 'utf8');
  const next = transform(current);

  if (next !== current) {
    fs.writeFileSync(filePath, next, 'utf8');
    console.log(`[content-fixes] patched ${relativePath}`);
  }
}

function replaceText(source, from, to) {
  return source.includes(from) ? source.replace(from, to) : source;
}

patchFile('src/components/Design1TestPage.jsx', (input) => {
  let source = input;

  source = replaceText(
    source,
    "label: 'средний рост конверсии в КП'",
    "label: 'средний рост конверсии в кейсах'"
  );

  source = source.replace(/\n\s*note: '(?:когда вместо длинного объяснения появляется нормальная визуальная история|теплая анимация сработала как инфоповод, а не просто как красивый файл|потому что проблему стало видно быстрее, чем ее можно объяснить на 50 слайдах|когда нужно не строить вечность, а быстро показать идею рынку или команде)',/g, '');
  source = source.replace(/\n\s*<p>\{item\.note\}<\/p>/, '');

  source = replaceText(
    source,
    'Сначала человек должен понять, потом уже восхищаться',
    'Сначала понимание — потом восхищение'
  );
  source = replaceText(
    source,
    `Хороший ролик не просит у зрителя лишнюю минуту на расшифровку. Он\n               быстро собирает контекст, показывает пользу и оставляет ощущение,\n               что продуктом занимаются взрослые люди.`,
    'Хороший ролик быстро включает в контекст, показывает пользу и приводит к целевому действию'
  );

  source = source.replace(
    /\n\s*<p className="d1-section-lead">\s*Здесь важно оставить не только красоту[\s\S]*?желание сделать вау\.\s*<\/p>/,
    ''
  );
  source = source.replace(
    /Не все надо превращать в огромный кейс\. Иногда достаточно быстро\s*показать, что мы умеем/,
    'Хотите еще кейсы?'
  );
  source = source.replace(
    /Мы не начинаем с картинки\. И это, кажется, сильно экономит всем\s*нервы/,
    'Начинаем с главного — с результата'
  );
  source = source.replace(
    /\n\s*<p>\s*Самая частая ошибка — сразу бежать делать красиво\.[\s\S]*?Мы так стараемся не делать\.\s*<\/p>/,
    ''
  );
  source = replaceText(
    source,
    'Чтобы проект не расползся, мы заранее фиксируем маршрут',
    'Заранее фиксируем маршрут'
  );
  source = replaceText(
    source,
    'ANIX уже шире, чем один формат роликов',
    'Не только ролики'
  );
  source = replaceText(source, 'Нас уже замечали не только клиенты', 'Anix везде');
  source = source.replace(
    /\n\s*<p>\s*Для нас это не финальная медалька на стене\.[\s\S]*?Но уже систему\.\s*<\/p>/,
    ''
  );
  source = source.replace(
    /Мы посмотрим, где там смысловая пробка, и предложим формат: ролик,\s*серия, маскот, visual sales kit, HSE-пилот, pharma-визуал или\s*экранная история для мероприятия\./,
    'Мы предложим лучший формат для вашего запроса и скажем, с чего начать'
  );

  return source;
});

patchFile('src/components/MedicinePage.jsx', (input) => {
  let source = input;

  source = source.replace(
    /У врача мало времени и много скепсиса\. Поэтому визуал должен быстро показать, что происходит в организме и почему продукт заслуживает разговора\. Мы не заменяем экспертную команду клиента\. Мы помогаем превратить утверждённую научную логику в понятную сцену\./,
    'У врача мало времени и внимания на изучение препаратов, мы используем это время эффективно'
  );
  source = replaceText(
    source,
    'Берем молекулу, рецептор, клеточный процесс или каскад и собираем сцену, где зритель понимает причинность. Что связывается, что меняется, почему это важно врачу.',
    'Переводим молекулу, рецептор, клеточный процесс или каскад — и делаем наглядными'
  );
  source = replaceText(
    source,
    'Короткий материал для стенда, выступления или встречи с врачами. Без тяжелого рекламного пафоса. Смысл, ритм, визуальная память.',
    'Привлекающий внимание материал для стенда, выступления или встречи с врачами. Пробивает баннерную слепоту, собирает охваты'
  );
  source = replaceText(
    source,
    'Сначала фиксируем смысл, ограничения и проверку. Так меньше тумана в начале и меньше лишних правок в конце.',
    'Фиксируем цель, ограничения и проверку, оптимизируем процесс для клиента'
  );

  return source;
});

patchFile('src/components/HsePage.jsx', (input) => {
  let source = input;

  source = source.replace(
    /\n\s*<p>\s*В HSE важно быстро увидеть, как это будет работать: карточка, ролик, QR, тест, путь сотрудника\.\s*<\/p>/,
    ''
  );
  source = source.replace(
    /\n\s*<p>\s*Если начать сразу с большой платформы, проект может утонуть в согласованиях\. Мы предлагаем сначала собрать один работающий контур\.\s*<\/p>/,
    ''
  );

  return source;
});

const layoutMarker = '/* content-fixes-part-2 */';

patchFile('src/Design1TestPage.css', (input) => {
  if (input.includes(layoutMarker)) return input;

  return `${input}\n\n${layoutMarker}\n.d1-direction-card {\n  border: 1px solid rgba(33, 22, 45, 0.12);\n  box-shadow: 0 18px 45px rgba(33, 22, 45, 0.08);\n}\n\n.d1-direction-grid > :nth-child(1),\n.d1-direction-grid > :nth-child(4) {\n  background: #f0e8ff;\n  color: #21162d;\n}\n\n.d1-direction-grid > :nth-child(2),\n.d1-direction-grid > :nth-child(5) {\n  border-color: rgba(255, 255, 255, 0.12);\n  background: #21162d;\n  color: #ffffff;\n}\n\n.d1-direction-grid > :nth-child(3) {\n  background: #dfff72;\n  color: #18131f;\n}\n\n.d1-direction-grid > :nth-child(1) h3,\n.d1-direction-grid > :nth-child(3) h3,\n.d1-direction-grid > :nth-child(4) h3 {\n  color: #21162d;\n}\n\n.d1-direction-grid > :nth-child(1) p,\n.d1-direction-grid > :nth-child(4) p {\n  color: #62566d;\n}\n\n.d1-direction-grid > :nth-child(3) p {\n  color: #44394d;\n}\n\n.d1-direction-grid > :nth-child(2) h3,\n.d1-direction-grid > :nth-child(5) h3 {\n  color: #ffffff;\n}\n\n.d1-direction-grid > :nth-child(2) p,\n.d1-direction-grid > :nth-child(5) p {\n  color: rgba(255, 255, 255, 0.76);\n}\n\n.d1-direction-grid > :nth-child(1) .d1-icon-wrap,\n.d1-direction-grid > :nth-child(3) .d1-icon-wrap,\n.d1-direction-grid > :nth-child(4) .d1-icon-wrap {\n  background: #21162d;\n  color: #ffffff;\n}\n\n.d1-direction-grid > :nth-child(2) .d1-icon-wrap,\n.d1-direction-grid > :nth-child(5) .d1-icon-wrap {\n  background: #f0e8ff;\n  color: #21162d;\n}\n\n.d1-direction-card > svg {\n  color: currentColor;\n}\n\n.d1-direction-card,\n.d1-direction-card * {\n  min-width: 0;\n}\n`;
});

patchFile('src/components/HsePage.css', (input) => {
  if (input.includes(layoutMarker)) return input;

  return `${input}\n\n${layoutMarker}\n.hse-page *,\n.hse-page *::before,\n.hse-page *::after {\n  box-sizing: border-box;\n}\n\n.hse-page img {\n  max-width: 100%;\n}\n\n.hse-container,\n.hse-two-col,\n.hse-hero,\n.hse-card-grid,\n.hse-case-grid,\n.hse-process-layout {\n  min-width: 0;\n}\n\n.hse-card,\n.hse-case-card,\n.hse-rich-text,\n.hse-hero-copy,\n.hse-hero-media {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n\n@media (max-width: 760px) {\n  .hse-two-col,\n  .hse-process-layout {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n`;
});

const reactScripts = path.resolve(
  __dirname,
  '..',
  'node_modules',
  'react-scripts',
  'bin',
  'react-scripts.js'
);

const result = spawnSync(process.execPath, [reactScripts, 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    CI: 'false',
    GENERATE_SOURCEMAP: 'false',
    INLINE_RUNTIME_CHUNK: 'false',
  },
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status === null ? 1 : result.status);