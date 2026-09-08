"""Rebuild the public, versioned procurement PDFs from the website content.

Usage: python3 scripts/generate-procurement-pdfs.py
Dependencies: reportlab, pypdf. Fonts: system DejaVu Sans, or ANIX_PDF_FONT_DIR.
The generated assets are committed, so website builds need no Python dependency.
"""
import json
import os
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'src/content/procurement.json').read_text())
OUTPUT = ROOT / 'public/procurement'
OUTPUT.mkdir(parents=True, exist_ok=True)
font_dir = Path(os.environ.get('ANIX_PDF_FONT_DIR', '/usr/share/fonts/truetype/dejavu'))
pdfmetrics.registerFont(TTFont('Anix', str(font_dir / 'DejaVuSans.ttf')))
pdfmetrics.registerFont(TTFont('AnixBold', str(font_dir / 'DejaVuSans-Bold.ttf')))
pdfmetrics.registerFontFamily('Anix', normal='Anix', bold='AnixBold', italic='Anix', boldItalic='AnixBold')

INK = colors.HexColor('#21162d')
MUTED = colors.HexColor('#504859')
PURPLE = colors.HexColor('#7350ab')
GREEN = colors.HexColor('#086658')
PALE = colors.HexColor('#eee7f5')
WIDTH = A4[0] - 84

styles = {
  'title': ParagraphStyle('title', fontName='AnixBold', fontSize=25, leading=29, textColor=INK, spaceAfter=12),
  'subtitle': ParagraphStyle('subtitle', fontName='Anix', fontSize=12, leading=17, textColor=MUTED, spaceAfter=12),
  'h2': ParagraphStyle('h2', fontName='AnixBold', fontSize=11, leading=15, textColor=INK, spaceBefore=12, spaceAfter=7),
  'body': ParagraphStyle('body', fontName='Anix', fontSize=9.2, leading=13.5, textColor=MUTED, spaceAfter=6),
  'small': ParagraphStyle('small', fontName='Anix', fontSize=8, leading=11.5, textColor=MUTED, spaceAfter=5),
  'label': ParagraphStyle('label', fontName='AnixBold', fontSize=9.2, leading=13.5, textColor=INK, spaceAfter=4),
}

def clean(text):
  for dash in '\u2010\u2011\u2012\u2013\u2014\u2212':
    text = text.replace(dash, '-')
  return escape(text)

def p(text, style='body'):
  return Paragraph(clean(text), styles[style])

def link(label, url):
  return Paragraph(f'<link href="{escape(url)}" color="#086658"><u>{clean(label)}</u></link>', styles['body'])

def bullets(items):
  return [p(f'• {text}') for text in items]

def rows(items, split=.32):
  table = Table([[p(a, 'label'), p(b)] for a, b in items], colWidths=[WIDTH * split, WIDTH * (1 - split)], hAlign='LEFT')
  table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('LEFTPADDING', (0, 0), (-1, -1), 0),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('TOPPADDING', (0, 0), (-1, -1), 9),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LINEBELOW', (0, 0), (-1, -1), .5, colors.HexColor('#d9d3de')),
  ]))
  return table

def frame(canvas, doc):
  canvas.saveState()
  canvas.setFillColor(INK)
  canvas.rect(0, A4[1] - 54, A4[0], 54, fill=1, stroke=0)
  canvas.setFillColor(colors.HexColor('#dfff72'))
  canvas.setFont('AnixBold', 17)
  canvas.drawString(42, A4[1] - 35, 'anix')
  canvas.setFillColor(colors.white)
  canvas.setFont('Anix', 8)
  canvas.drawRightString(A4[0] - 42, A4[1] - 33, f'ПРОДУКТЫ И ЗАКУПКА  /  {DATA["version"]}')
  canvas.setStrokeColor(colors.HexColor('#d9d3de'))
  canvas.line(42, 46, A4[0] - 42, 46)
  canvas.setFillColor(MUTED)
  canvas.setFont('Anix', 7.5)
  canvas.drawString(42, 31, 'studio.anix-ai.pro/procurement/  |  studio@anix-ai.pro')
  canvas.drawRightString(A4[0] - 42, 31, str(doc.page))
  canvas.linkURL('https://studio.anix-ai.pro/procurement/', (42, 24, 310, 42), relative=0)
  canvas.restoreState()

def build(filename, title, story, expected):
  target = OUTPUT / filename
  doc = SimpleDocTemplate(str(target), pagesize=A4, leftMargin=42, rightMargin=42, topMargin=78, bottomMargin=62, title=title, author='Anix Studio', pageCompression=1)
  doc.build(story, onFirstPage=frame, onLaterPages=frame)
  reader = PdfReader(str(target))
  assert len(reader.pages) == expected, f'{filename}: expected {expected}, got {len(reader.pages)}'
  for page in reader.pages:
    assert page.extract_text().strip(), f'{filename}: empty page'
  print(f'{filename}: {len(reader.pages)} pages, {target.stat().st_size} bytes')

for product in DATA['products']:
  story = [p(product['name'], 'title'), p(product['subtitle'], 'subtitle'), p('Для кого', 'h2'), p(product['audience']), p('Что получает команда', 'h2'), p(product['result'])]
  story += bullets(product['included'])
  story += [p('Три стартовых уровня', 'h2')]
  story += [rows([(name, f'{price}. {scope}') for name, price, scope in product['tiers']], .29)]
  story += [p('Сроки и условия', 'h2'), p(product['timing']), p('Границы работ', 'h2'), p(product['excluded'], 'small')]
  story += [Spacer(1, 7), link('Состав сметы и подробные условия →', 'https://studio.anix-ai.pro' + product['pricePage'])]
  story += [p('Цены «от», не публичная оферта. Налоги, лицензии, оплата и точный состав фиксируются в индивидуальной смете и договоре. Первый ответ: 3 формата и вилка бюджета за 1 рабочий день; если вводных недостаточно, в этот срок пришлём вопросы.', 'small')]
  build(product['file'], product['name'] + ' | Anix Studio', story, 1)

story = [p('Закупочный пакет', 'title'), p('01 / Пример состава технического задания', 'subtitle'), p('Для медицинской анимации и HSE-видео. Рабочая структура для обсуждения, не юридический шаблон договора и не условия конкретного завершённого кейса.'), rows(DATA['brief'])]
story += [p('Выход после брифа', 'h2'), p('Индивидуальная смета с вариантами результата, составом поставки, исключениями и сроками. Назначаем одного ответственного за консолидированную обратную связь.')]
story += [PageBreak(), p('Материалы и календарь', 'title'), p('02 / Пример для одного ролика около 1 минуты', 'subtitle'), rows(DATA['timeline'], .21)]
story += [p('Что клиент передаёт до старта', 'h2')] + bullets(DATA['inputs']['common'])
story += [p('Фарма', 'h2')] + bullets(DATA['inputs']['pharma'])
story += [p('HSE', 'h2')] + bullets(DATA['inputs']['hse'])
story += [p('Семь дней - календарный ориентир при полных вводных и своевременном согласовании. Доступность валидатора согласуем заранее. Серия, новые сцены и задержки согласования требуют отдельного графика. Не передавайте персональные данные через открытую форму.', 'small')]
story += [PageBreak(), p('Приёмка и изменения', 'title'), p('03 / Проверяемый результат каждого этапа', 'subtitle'), rows(DATA['acceptance'])]
story += [p('Как считаем правки', 'h2'), p('Два раунда консолидированных замечаний в утверждённом объёме. Несоответствия ТЗ устраняем. Новые тезисы, сцены, языки и каналы после утверждения - изменение объёма: сначала оценка, затем согласование цены и срока. Порядок подтверждения этапов закрепляем в договоре.')]
story += [p('Как измерить эффект нового проекта', 'h2'), p('До старта согласовать показатель, базу сравнения, период, размер выборки и источник. Для обучения: одинаковые вопросы до/после и повторная проверка. Для QR/LMS: открытия, завершения и ответы. Для кампании: целевые обращения / измеренные контакты с одним окном атрибуции.'), p('Для причинного вывода нужна сопоставимая контрольная группа и учёт других изменений. Просмотры не равны продажам; тесты не доказывают снижение травматизма. Это предлагаемая методика, а не результаты кейсов Anix. Публикация клиентских данных - только после согласования.', 'small')]
story += [PageBreak(), p('Checklist закупки', 'title'), p('04 / Контрагент, договор, права и ответственность', 'subtitle')]
story += [p(f'{index:02d}  {text}') for index, text in enumerate(DATA['checklist'], 1)]
story += [p('Базовые сведения о контрагенте', 'h2'), p(f'{DATA["company"]} | ИНН {DATA["inn"]} | ОГРН {DATA["ogrn"]}'), p('Актуальные КПП, юридический адрес, банковские реквизиты и полномочия подписанта подтверждаются карточкой компании перед договором. Этот файл не является платёжным документом.'), link('Запросить карточку: studio@anix-ai.pro', 'mailto:studio@anix-ai.pro')]
story += [p('Что посмотреть до запроса предложения', 'h2'), link('Pharma Launch System: уровни и смета', 'https://studio.anix-ai.pro/medicine/price/'), link('HSE Onboarding Module: уровни и ограничения', 'https://studio.anix-ai.pro/hse/price/'), link('Паспорта проектов и источники', 'https://studio.anix-ai.pro/procurement/'), p('Научная/HSE-валидация не заменяет юридическое заключение или обязательные процедуры клиента. Формат исходников, права, лицензии и допустимость AI согласуются до производства.', 'small')]
build('anix-procurement-kit.pdf', 'Закупочный пакет | Anix Studio', story, 4)
