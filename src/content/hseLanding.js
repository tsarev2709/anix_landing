import realism from '../images/hse/styles/realism.webp';
import stylized3d from '../images/hse/styles/stylized-3d.webp';
import flat2d from '../images/hse/styles/flat-2d.webp';
import semiRealism from '../images/hse/styles/semi-realism.webp';
import graphicNovel from '../images/hse/styles/graphic-novel.webp';
import lowPoly from '../images/hse/styles/low-poly.webp';
import systemImage from '../images/hse/review/benefitSystem.webp';
import recognitionImage from '../images/hse/review/benefitRecognition.webp';
import newcomersImage from '../images/hse/review/benefitNewcomers.webp';
import fox from '../images/hse/review/energyFox.webp';
import owl from '../images/hse/review/energyOwl.webp';
import dog from '../images/hse/review/energyDog.webp';
import beaver from '../images/hse/review/energyBeaver.webp';
import metals from '../images/hse/review/metals.webp';
import logistics from '../images/hse/review/logistics.webp';
import young from '../images/hse/review/young.webp';
import multon from '../images/hse/review/multonDrawing.webp';

export const hseStyles = [
  {
    id: 'realism',
    name: 'Реализм',
    type: 'Для узнаваемой рабочей среды',
    image: realism,
  },
  {
    id: 'stylized_3d',
    name: 'Объёмная анимация',
    type: 'Для персонажа на годы',
    image: stylized3d,
  },
  {
    id: 'flat_2d',
    name: 'Графичная 2D',
    type: 'Для правил и карточек',
    image: flat2d,
  },
  {
    id: 'semi_realism',
    name: 'Полуреализм',
    type: 'Баланс деталей и выразительности',
    image: semiRealism,
  },
  {
    id: 'graphic_novel',
    name: 'Комикс',
    type: 'Для динамичных ситуаций',
    image: graphicNovel,
  },
  {
    id: 'low_poly',
    name: 'Геометричная 3D-графика',
    type: 'Для ясной схемы пространства',
    image: lowPoly,
  },
];

export const hseBenefits = [
  {
    id: 'system',
    number: '01',
    short: 'Одна система',
    title: 'Собрать разрозненные материалы в одну систему',
    description:
      'Добавляем одного персонажа в инструкции, плакаты, экраны и обучение. Так появляется единый корпоративный стиль и видно, как отдельные меры складываются в систему безопасности.',
    before: 'Каждую задачу оформляют с нуля',
    after: 'Один персонаж и набор шаблонов работают в новых темах',
    note: 'Проверим на ваших материалах: найдут ли сотрудники связь между сообщениями быстрее.',
    image: systemImage,
  },
  {
    id: 'recognition',
    number: '02',
    short: 'Узнаваемость',
    title: 'Сделать безопасность узнаваемой',
    description:
      'Знакомый персонаж возвращается в коротких сценах, на экранах и в карточках. Он помогает заметить тему и понять, какое правило сейчас важно.',
    before: 'Очередное сообщение теряется среди объявлений',
    after: 'У сообщения есть знакомый герой и единый визуальный код',
    note: 'Проверим узнавание и понимание, не обещая эффект без замера.',
    image: recognitionImage,
  },
  {
    id: 'newcomers',
    number: '03',
    short: 'Новички',
    title: 'Быстро погружать новичков в контекст',
    description:
      'Короткая история показывает место, риск, выбор и правильное действие. Персонаж может вести человека по первым правилам объекта без длинной лекции.',
    before: 'Список запретов без контекста',
    after: 'Сцена, выбор и вопрос на понимание',
    note: 'Проверим формат на реальных группах сотрудников разных возрастов.',
    image: newcomersImage,
  },
];

export const hseScenarios = [
  {
    id: 'existing_energy',
    sector: 'Энергетика',
    title: 'Маскот уже есть. Ему нужна роль на объекте',
    task: 'Заказчик хотел использовать знакомого героя в коммуникациях по безопасности для сотрудников и подрядчиков.',
    delivery:
      'Адаптировали персонажа под форму, СИЗ и рабочие роли; подготовили образы, сцену и карточки.',
    result:
      'У компании появился узнаваемый герой для нескольких тем охраны труда.',
    image: fox,
    focus: 'existing',
  },
  {
    id: 'generation',
    sector: 'Энергетика',
    title: 'Каждая площадка оформляет правила по-своему',
    task: 'Связать материалы нескольких площадок общей визуальной системой.',
    delivery:
      'Создали персонажа, шаблоны и сцены для вводных материалов, экранов и напоминаний.',
    result: 'Разные форматы получили единый, повторяемый язык безопасности.',
    image: owl,
    focus: 'system',
  },
  {
    id: 'contractors',
    sector: 'Энергетика',
    title: 'Подрядчики приезжают на незнакомый объект',
    task: 'Быстро объяснить подрядчикам маршрут, риски и к кому обратиться перед началом работ.',
    delivery:
      'Подготовили короткий ознакомительный материал, вопросы и версию для телефона.',
    result: 'Ключевые ориентиры объекта собраны в понятной последовательности.',
    image: dog,
    focus: 'onboarding',
  },
  {
    id: 'power_station',
    sector: 'Энергетика',
    title: 'Важен узнаваемый вид оборудования',
    task: 'Показать опасную зону у оборудования и безопасную последовательность действий.',
    delivery:
      'Собрали визуальную сцену и схему действий; детали согласовали со специалистами по ОТ.',
    result: 'Опасная зона и порядок действий стали видны в одном материале.',
    image: beaver,
    focus: 'risk',
  },
  {
    id: 'crane',
    sector: 'Металлургия',
    title: 'Опасная зона при работе с краном',
    task: 'Объяснить границу опасной зоны и безопасный обход при работе с краном.',
    delivery:
      'Создали короткую сцену, схему зоны и версии для экрана и телефона.',
    result: 'Правильный маршрут можно показать без изображения травмы.',
    image: metals,
    focus: 'risk',
  },
  {
    id: 'multon',
    sector: 'Пищевое производство',
    size: 'Мултон Партнерс',
    title: 'Маскот и жизненно важные правила',
    task: 'Сделать реальные ситуации охраны труда понятными и заметными во внутренней кампании.',
    delivery:
      'Разработали маскота, переработали карточки жизненно важных правил и создали анимацию для внутренней кампании.',
    result:
      'Компания получила единый узнаваемый формат для сообщений по безопасности.',
    image: multon,
    focus: 'onboarding',
  },
  {
    id: 'warehouse',
    sector: 'Логистика',
    title: 'Пешеходы рядом с погрузчиками',
    task: 'Показать пешеходам безопасный маршрут рядом с техникой на складе.',
    delivery:
      'Подготовили схему маршрута, иллюстрации и материалы для размещения на объекте.',
    result: 'Разделение потоков людей и техники стало наглядным в материалах.',
    image: logistics,
    focus: 'risk',
  },
  {
    id: 'new_team',
    sector: 'Ещё',
    title: 'Короткие ролики для молодых сотрудников',
    task: 'Молодые сотрудники не вовлекались в стандартное обучение по безопасности.',
    delivery:
      'Сделали серию коротких роликов с персонажем, ситуациями выбора и понятным действием.',
    result:
      'Появился формат, который проще включать в обучение и повторять перед сменой.',
    image: young,
    focus: 'onboarding',
  },
];
