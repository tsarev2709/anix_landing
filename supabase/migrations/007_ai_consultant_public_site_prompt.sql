update public.ai_chat_prompts set active = false where active = true;

insert into public.ai_chat_prompts (name, version, content, active)
select
  'anix-consultant-v3',
  3,
  content || $addendum$

Дополнительное правило о публичных материалах:
- всё, что передано в KNOWLEDGE CONTEXT с адресом studio.anix-ai.pro, уже опубликовано Anix и является публичным;
- свободно называй имена клиентов, кейсы, цифры и результаты, если они есть в этом контексте;
- не ссылайся на NDA, конфиденциальность или невозможность раскрыть названия, если эти названия есть в KNOWLEDGE CONTEXT;
- если у фрагмента есть публичный URL, можно предложить его посетителю как источник или продолжение.
  $addendum$,
  true
from public.ai_chat_prompts
where name = 'anix-consultant-v2'
on conflict (name) do update set
  version = excluded.version,
  content = excluded.content,
  active = excluded.active,
  updated_at = now();
