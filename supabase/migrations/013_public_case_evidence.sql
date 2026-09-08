-- Keep deployed case answers aligned with the audited public case pages.
-- 009 is the generated fresh-install snapshot; this migration updates existing DBs.
begin;
with revised(slug, result) as (values
  ('clappy', 'Создан объясняющий ролик для двух аудиторий продукта. Данные об отклике не опубликованы с периодом, базой сравнения и выгрузкой аналитики; количественный рост не заявляем.'),
  ('hemotech-ai', 'Опубликован минималистичный ролик-визитка. По описанию Anix, стиль продолжили в презентационных материалах и повторном заказе. Публичной аналитики роста охватов, отклика или продаж нет.'),
  ('tpes', 'Создан ролик о реактивных потерях и энергоэффективности для первого касания. По описанию Anix, основатель использовал его вместо длинной презентации. Период, база и клиентская аналитика отклика не опубликованы.'),
  ('mfti-endowment', 'Фотографии университета собраны в единую анимационную историю. По описанию Anix, стиль продолжили в других материалах. Выгрузки и методика расчёта охватов и вовлечения не опубликованы; кратный рост не заявляем.')
)
update public.ai_knowledge_cases c set result = revised.result, updated_at = now()
from revised where c.slug = revised.slug;
update public.ai_knowledge_claims claim set content = c.result
from public.ai_knowledge_cases c
where claim.case_id = c.id and claim.kind = 'result'
  and c.slug in ('clappy', 'hemotech-ai', 'tpes', 'mfti-endowment');
commit;
