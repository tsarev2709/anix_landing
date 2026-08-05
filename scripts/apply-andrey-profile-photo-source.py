from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
profile_path = root / 'src' / 'components' / 'AndreyProfilePage.jsx'
source = profile_path.read_text(encoding='utf-8')

if "import './AndreyProfilePhotos.css';" not in source:
    source = source.replace(
        "import './AndreyProfilePage.css';",
        "import './AndreyProfilePage.css';\nimport './AndreyProfilePhotos.css';",
        1,
    )

imports = """import theatrePromoPhoto from '../images/andrey/profile/andrey-profile-theatre-promo.webp';
import portraitPhoto from '../images/andrey/profile/andrey-profile-portrait.webp';
import businessSchoolSpeakingPhoto from '../images/andrey/profile/andrey-profile-business-school-speaking.webp';
import novatorMoscowPhoto from '../images/andrey/profile/andrey-profile-novator-moscow.webp';
import businessSchoolGraduatesPhoto from '../images/andrey/profile/andrey-profile-business-school-graduates.webp';
import theatreGroupPhoto from '../images/andrey/profile/andrey-profile-tochka-theatre.webp';
import kafkaPhoto from '../images/andrey/profile/andrey-profile-kafka.webp';
import academyPitchPhoto from '../images/andrey/profile/andrey-profile-academy-pitch.webp';"""

source, count = re.subn(
    r"import theatrePromoPhoto[\s\S]*?import anixTeamPhoto[^;]+;",
    imports,
    source,
    count=1,
)
if count != 1 and 'andrey-profile-novator-moscow.webp' not in source:
    raise RuntimeError('Could not replace profile photo imports')

gallery = """const gallery = [
  {
    src: theatrePromoPhoto,
    alt: 'Андрей Царёв на фотосессии спектакля «Разбитые каменные сердца Чёрного Города»',
    label: 'Промо спектакля, 2021',
    width: 1405,
    height: 937,
  },
  {
    src: portraitPhoto,
    alt: 'Студийный портрет Андрея Царёва',
    label: 'Студийный портрет',
    width: 1800,
    height: 1200,
  },
  {
    src: businessSchoolSpeakingPhoto,
    alt: 'Андрей Царёв выступает на юбилее Бизнес-школы МФТИ',
    label: 'Выступление в Бизнес-школе МФТИ',
    width: 1800,
    height: 1200,
  },
  {
    src: novatorMoscowPhoto,
    alt: 'Плакат с Андреем Царёвым на Цветном бульваре — финалист конкурса «Новатор Москвы — 2024»',
    label: '«Новатор Москвы — 2024»',
    width: 1280,
    height: 853,
  },
  {
    src: businessSchoolGraduatesPhoto,
    alt: 'Выпускники Бизнес-школы МФТИ и СберУниверситета',
    label: 'Выпуск Бизнес-школы МФТИ и СберУниверситета',
    width: 1800,
    height: 1200,
  },
  {
    src: theatreGroupPhoto,
    alt: 'Состав студенческого театра «Точка» МФТИ после спектакля',
    label: 'Театр «Точка» МФТИ',
    width: 1200,
    height: 800,
  },
  {
    src: kafkaPhoto,
    alt: 'Андрей Царёв в Гоголь-центре на фоне изображения Франца Кафки',
    label: 'Гоголь-центр / Франц Кафка',
    width: 1712,
    height: 958,
  },
  {
    src: academyPitchPhoto,
    alt: 'Андрей Царёв презентует нейросеть Anix на Академии инноваторов',
    label: 'Питчинг Академии инноваторов / Anix',
    width: 1800,
    height: 1200,
  },
];"""

source, count = re.subn(
    r"const gallery = \[[\s\S]*?\n\];",
    gallery,
    source,
    count=1,
)
if count != 1:
    raise RuntimeError('Could not replace profile gallery')

hero = """<div className=\"andrey-hero-visual\" data-photo-layout=\"natural\" aria-label=\"Фотографии Андрея Царёва\">
          <figure className=\"andrey-hero-main\">
            <img
              src={portraitPhoto}
              alt=\"Студийный портрет Андрея Царёва\"
              width={1800}
              height={1200}
              fetchPriority=\"high\"
              decoding=\"async\"
            />
            <figcaption>Предприниматель, автор, режиссёр</figcaption>
          </figure>
          <figure className=\"andrey-hero-side\">
            <img
              src={theatrePromoPhoto}
              alt=\"Андрей Царёв в промо спектакля «Разбитые каменные сердца Чёрного Города»\"
              width={1405}
              height={937}
              decoding=\"async\"
            />
            <figcaption>Чёрный Город / театр</figcaption>
          </figure>
        </div>"""

source, count = re.subn(
    r'<div className="andrey-hero-visual"[\s\S]*?</div>',
    hero,
    source,
    count=1,
)
if count != 1 and 'data-photo-layout="natural"' not in source:
    raise RuntimeError('Could not replace hero photos')

creative = """<div className=\"andrey-creative-photo\">
          <img
            src={theatreGroupPhoto}
            alt=\"Состав студенческого театра «Точка» МФТИ после спектакля\"
            width={1200}
            height={800}
            loading=\"lazy\"
            decoding=\"async\"
          />
        </div>
        <div className=\"andrey-creative-copy\">"""

source, count = re.subn(
    r'<div className="andrey-creative-photo">[\s\S]*?</div>\n        <div className="andrey-creative-copy">',
    creative,
    source,
    count=1,
)
if count != 1 and 'width={1200}' not in source:
    raise RuntimeError('Could not replace creative photo')

source = source.replace(
    '<section className="andrey-section andrey-gallery-section">',
    '<section className="andrey-section andrey-gallery-section" id="gallery">',
    1,
)
source = source.replace(
    '<img src={photo.src} alt={photo.alt} loading="lazy" />',
    '<img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" />',
    1,
)

required_markers = [
    "import './AndreyProfilePhotos.css';",
    'andrey-profile-novator-moscow.webp',
    'data-photo-layout="natural"',
    'width={photo.width}',
    'id="gallery"',
]
for marker in required_markers:
    if marker not in source:
        raise RuntimeError(f'Missing expected marker after source update: {marker}')

profile_path.write_text(source, encoding='utf-8')
print('[andrey-import] AndreyProfilePage.jsx updated with eight original photographs')
