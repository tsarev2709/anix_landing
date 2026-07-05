insert into public.hse_organizations (id, name, industry)
values (
  '11111111-1111-4111-8111-111111111111',
  'Пищевая производственная площадка №1',
  'Пищевая промышленность'
)
on conflict (id) do update set name = excluded.name, industry = excluded.industry;

insert into public.hse_companies (id, name, industry)
values (
  '11111111-1111-4111-8111-111111111111',
  'Пищевая производственная площадка №1',
  'Пищевая промышленность'
)
on conflict (id) do update set name = excluded.name, industry = excluded.industry;

insert into public.hse_sites (id, company_id, name, address)
values (
  '11111111-1111-4111-8111-222222222222',
  '11111111-1111-4111-8111-111111111111',
  'Линия розлива и склад готовой продукции',
  'Демо-площадка ANIX HSE MVP'
)
on conflict (id) do update set name = excluded.name, address = excluded.address;

insert into public.hse_departments (id, organization_id, slug, title, description, headcount)
values
  ('44444444-4444-4444-8444-000000000001', '11111111-1111-4111-8111-111111111111', 'all-employees', 'Все сотрудники', 'Обязательные модули для сотрудников и подрядчиков площадки.', 128),
  ('44444444-4444-4444-8444-000000000002', '11111111-1111-4111-8111-111111111111', 'production-lines', 'Производство и технологические линии', 'Операторы линии розлива, сменные сотрудники, влажные зоны и упаковка.', 46),
  ('44444444-4444-4444-8444-000000000003', '11111111-1111-4111-8111-111111111111', 'warehouse', 'Склад и внутренняя логистика', 'Паллеты, тара, проходы и погрузочно-разгрузочные работы.', 24),
  ('44444444-4444-4444-8444-000000000004', '11111111-1111-4111-8111-111111111111', 'technical-service', 'Техническая служба / ремонт / энергетики', 'Электрощиты, кабели, обслуживание оборудования и опасные зоны.', 18),
  ('44444444-4444-4444-8444-000000000005', '11111111-1111-4111-8111-111111111111', 'sanitation', 'Санитарная обработка / мойка / CIP', 'Влажные зоны, моющие средства, шланги, проливы и уборка.', 16),
  ('44444444-4444-4444-8444-000000000006', '11111111-1111-4111-8111-111111111111', 'quality-lab', 'Лаборатория контроля качества', 'Перемещение проб, проливы и работа рядом с оборудованием.', 10),
  ('44444444-4444-4444-8444-000000000007', '11111111-1111-4111-8111-111111111111', 'office', 'Офис и административный персонал', 'Посещение производственных зон и базовые правила поведения.', 9),
  ('44444444-4444-4444-8444-000000000008', '11111111-1111-4111-8111-111111111111', 'contractors', 'Подрядчики и сервисные бригады', 'Краткий обязательный набор правил перед работами на площадке.', 14)
on conflict (organization_id, slug) do update
set title = excluded.title, description = excluded.description, headcount = excluded.headcount;

insert into public.hse_courses (id, title, description, version, status)
values (
  '22222222-2222-4222-8222-222222222222',
  'ANIX. Единая визуальная система обучения по охране труда',
  'Демо-курс для пищевой производственной площадки: визуальные правила, микроуроки, тестирование и аналитика.',
  '2026.1',
  'published'
)
on conflict (id) do update
set title = excluded.title, description = excluded.description, version = excluded.version, status = excluded.status, updated_at = now();

insert into public.hse_modules (id, course_id, module_key, title, description, estimated_minutes, order_index)
values
  ('33333333-3333-4333-8333-000000000001', '22222222-2222-4222-8222-222222222222', 'life-saving-rules', 'Life-saving rules', 'Ключевые правила безопасности для сотрудников и подрядчиков.', 12, 1),
  ('33333333-3333-4333-8333-000000000002', '22222222-2222-4222-8222-222222222222', 'slips-and-falls', 'Скользкие поверхности и падения', 'Действия при проливах, мокром полу, загроможденных проходах и риске падения.', 10, 2),
  ('33333333-3333-4333-8333-000000000003', '22222222-2222-4222-8222-222222222222', 'electrical-safety', 'Электробезопасность', 'Базовое безопасное поведение рядом с кабелями, электрощитами и оборудованием.', 10, 3)
on conflict (id) do update
set module_key = excluded.module_key, title = excluded.title, description = excluded.description, estimated_minutes = excluded.estimated_minutes, order_index = excluded.order_index;

insert into public.hse_department_modules (department_id, module_key, required, due_days)
select department.id, module_key, true, 30
from public.hse_departments department
cross join (values
  ('life-saving-rules'),
  ('slips-and-falls'),
  ('electrical-safety')
) as modules(module_key)
where department.organization_id = '11111111-1111-4111-8111-111111111111'
on conflict (department_id, module_key) do update
set required = excluded.required, due_days = excluded.due_days;

insert into public.hse_source_documents (id, title, document_type, description)
values
  ('rf-2464', 'Постановление Правительства РФ №2464 от 24.12.2021', 'law', 'Порядок обучения по охране труда и проверки знания требований охраны труда.'),
  ('mt-866n', 'Приказ Минтруда России №866н от 07.12.2020', 'order', 'Правила по охране труда при производстве отдельных видов пищевой продукции.'),
  ('mt-903n', 'Приказ Минтруда России №903н от 15.12.2020', 'order', 'Правила по охране труда при эксплуатации электроустановок.'),
  ('gost-12-4-026', 'ГОСТ 12.4.026-2015', 'gost', 'Сигнальные цвета, знаки безопасности и сигнальная разметка.'),
  ('sp-29-13330', 'СП 29.13330.2011 «Полы»', 'sp', 'Требования к полам производственных помещений.'),
  ('gost-12-1-019', 'ГОСТ 12.1.019-2017', 'gost', 'Электробезопасность. Общие требования и виды защиты.')
on conflict (id) do update
set title = excluded.title, document_type = excluded.document_type, description = excluded.description;

insert into public.hse_lessons (id, module_key, lesson_key, lesson_type, title, body, payload, order_index)
values
  ('55555555-5555-4555-8555-000000000001', 'slips-and-falls', 'slip-video-1', 'video_card', 'Пролив на полу у линии розлива', 'Сотрудник замечает мокрый участок рядом с проходом и должен остановиться, обозначить место и сообщить ответственному.', jsonb_build_object('screenText', 'Не проходи через пролив. Обозначь опасную зону.', 'question', 'Что сделать первым?', 'competency', 'hazard-recognition'), 1),
  ('55555555-5555-4555-8555-000000000002', 'slips-and-falls', 'slip-text-1', 'text_lesson', 'Первое действие при проливе', 'Если увидели воду, сок, сироп, масло или моющее средство на полу, не проходите через это место и не ведите через него коллег. Сначала остановитесь и оцените, может ли кто-то поскользнуться прямо сейчас. Обозначьте опасную зону знаком или лентой, сообщите ответственному и действуйте по процедуре уборки, если это входит в ваши обязанности. Нельзя оставлять пролив без внимания даже на несколько минут.', jsonb_build_object('mainRule', 'Пролив нужно обозначить и передать ответственному.', 'employeeAction', 'Остановиться, обозначить место, сообщить.', 'prohibition', 'Нельзя проходить через пролив или игнорировать его.'), 2),
  ('55555555-5555-4555-8555-000000000003', 'electrical-safety', 'el-video-1', 'video_card', 'Поврежденный кабель у оборудования', 'Сотрудник видит кабель с нарушенной изоляцией во влажной зоне и не должен касаться его руками.', jsonb_build_object('screenText', 'Поврежденный кабель не трогать. Сообщить ответственному.', 'question', 'Какое действие безопасно?', 'competency', 'hazard-recognition'), 1),
  ('55555555-5555-4555-8555-000000000004', 'electrical-safety', 'el-text-1', 'text_lesson', 'Кабель, вилка или розетка выглядят неисправными', 'Если кабель, вилка, розетка или удлинитель выглядят поврежденными, не используйте их и не пытайтесь быстро поправить изолентой. Остановите работу, если есть явная опасность, предупредите коллег рядом и сообщите руководителю или ответственному за электрохозяйство. Нельзя касаться поврежденных частей мокрыми руками, перемещать кабель ногой или включать оборудование для проверки.', jsonb_build_object('mainRule', 'Неисправное электрооборудование не используется до проверки.', 'employeeAction', 'Остановить работу и сообщить ответственному.', 'prohibition', 'Нельзя чинить или включать поврежденный кабель самостоятельно.'), 2)
on conflict (module_key, lesson_key) do update
set lesson_type = excluded.lesson_type, title = excluded.title, body = excluded.body, payload = excluded.payload, order_index = excluded.order_index;

insert into public.hse_lesson_sources (lesson_id, source_id)
select lesson.id, link.source_id
from (values
  ('slip-video-1', 'mt-866n'),
  ('slip-video-1', 'gost-12-4-026'),
  ('slip-text-1', 'sp-29-13330'),
  ('slip-text-1', 'rf-2464'),
  ('el-video-1', 'mt-903n'),
  ('el-text-1', 'gost-12-1-019')
) as link(lesson_key, source_id)
join public.hse_lessons lesson on lesson.lesson_key = link.lesson_key
on conflict do nothing;