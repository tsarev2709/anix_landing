import React from 'react';
import { Helmet } from 'react-helmet';

const BlogCard = ({ url, category, headline, description, date, image }) => {
  const articleBody = `Контент-маркетинг давно стал одной из ключевых стратегий продвижения в B2B. Однако типовые подходы часто не позволяют донести сложную информацию о продукте. В этой статье мы рассказываем, почему анимационные ролики решают эту проблему и какие результаты приносят. Использование коротких анимированных сцен позволяет структурировать предложение и быстро объяснить выгоды. Опыт наших клиентов показывает, что такие видео увеличивают CTR и время вовлечения, а также сокращают затраты на обучение продаж. Дополнительно мы разобрали способы интеграции роликов в контент-воронку и поделились лайфхаками из практики. Это помогает выстраивать системную коммуникацию и достигать устойчивого роста.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    author: 'Anix',
    datePublished: date,
    articleSection: category,
    articleBody
  };

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="blog-card">
      {/* JSON-LD microdata and Open Graph tags for this article */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <meta property="og:title" content={headline} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
      </Helmet>
      <div className="blog-category">
        <span className="category-tag">#{category}</span>
      </div>
      <h3>{headline}</h3>
      <p>{description}</p>
      <div className="blog-meta">
        <span>{date}</span>
      </div>
    </a>
  );
};

export default BlogCard;
