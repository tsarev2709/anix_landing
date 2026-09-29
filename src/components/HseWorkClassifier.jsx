import React, { useMemo, useState } from 'react';
import classifier from '../content/hseWorkClassifier.json';
import './HseWorkClassifier.css';

const dictionaryLabels = {
  actions: 'Виды работ',
  equipment: 'Оборудование',
  conditions: 'Условия',
  hazards: 'Опасности',
};

const filterFields = [
  { key: 'action', dictionary: 'actions', label: 'Вид работы' },
  { key: 'equipment', dictionary: 'equipment', label: 'Оборудование' },
  { key: 'condition', dictionary: 'conditions', label: 'Условие' },
  { key: 'hazard', dictionary: 'hazards', label: 'Опасность' },
];

const emptyFilters = {
  action: '',
  equipment: '',
  condition: '',
  hazard: '',
};

export default function HseWorkClassifier() {
  const [filters, setFilters] = useState(emptyFilters);
  const dictionaries = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(classifier.dictionaries).map(([key, items]) => [
          key,
          new Map(items.map((item) => [item.code, item.title])),
        ])
      ),
    []
  );

  const filteredEntries = useMemo(
    () =>
      classifier.entries.filter((entry) => {
        if (filters.action && !entry.action.includes(filters.action))
          return false;
        if (filters.equipment && !entry.equipment.includes(filters.equipment))
          return false;
        if (filters.condition && !entry.conditions.includes(filters.condition))
          return false;
        if (filters.hazard && !entry.hazards.includes(filters.hazard))
          return false;
        return true;
      }),
    [filters]
  );

  const labelsFor = (dictionary, codes) =>
    codes.map((code) => ({
      code,
      title: dictionaries[dictionary].get(code) || code,
    }));

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="hse-classifier">
      <aside
        className="hse-classifier__notice"
        aria-label="Граница применимости"
      >
        <strong>Важно.</strong> {classifier.disclaimer}
      </aside>

      <section
        className="hse-classifier__formula"
        aria-labelledby="classifier-formula"
      >
        <p className="hse-classifier__kicker">Рабочая формула</p>
        <h2 id="classifier-formula">{classifier.method}</h2>
        <p>
          Каждое измерение хранится отдельно. Это позволяет сопоставлять
          локальные названия филиалов и обновлять связи без пересборки всего
          справочника.
        </p>
      </section>

      <section aria-labelledby="classifier-dictionaries">
        <h2 id="classifier-dictionaries">Справочники MVP</h2>
        <div className="hse-classifier__dictionaries">
          {Object.entries(classifier.dictionaries).map(([key, items]) => (
            <details key={key} open={key === 'actions'}>
              <summary>
                {dictionaryLabels[key]} <span>{items.length}</span>
              </summary>
              <ul>
                {items.map((item) => (
                  <li key={item.code}>
                    <code>{item.code}</code>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="classifier-examples">
        <div className="hse-classifier__section-heading">
          <div>
            <p className="hse-classifier__kicker">Демонстрационные данные</p>
            <h2 id="classifier-examples">Комбинации работ и опасностей</h2>
          </div>
          <p aria-live="polite">
            Показано {filteredEntries.length} из {classifier.entries.length}
          </p>
        </div>

        <div
          className="hse-classifier__filters"
          aria-label="Фильтры классификатора"
        >
          {filterFields.map((filter) => (
            <label key={filter.key}>
              <span>{filter.label}</span>
              <select
                value={filters[filter.key]}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    [filter.key]: event.target.value,
                  }))
                }
              >
                <option value="">Все варианты</option>
                {classifier.dictionaries[filter.dictionary].map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.title}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            type="button"
            disabled={!hasFilters}
            onClick={() => setFilters(emptyFilters)}
          >
            Сбросить фильтры
          </button>
        </div>

        <div className="hse-classifier__results">
          {filteredEntries.length ? (
            filteredEntries.map((entry) => (
              <article className="hse-classifier__card" key={entry.work_id}>
                <header>
                  <code>{entry.work_id}</code>
                  <h3>{entry.title}</h3>
                  <p>{entry.applicability}</p>
                </header>
                <dl>
                  <div>
                    <dt>Работа</dt>
                    <dd>
                      {labelsFor('actions', entry.action).map((item) => (
                        <span key={item.code}>{item.title}</span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Оборудование</dt>
                    <dd>
                      {labelsFor('equipment', entry.equipment).map((item) => (
                        <span key={item.code}>{item.title}</span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Условия</dt>
                    <dd>
                      {labelsFor('conditions', entry.conditions).map((item) => (
                        <span key={item.code}>{item.title}</span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Опасности</dt>
                    <dd>
                      {labelsFor('hazards', entry.hazards).map((item) => (
                        <span key={item.code}>{item.title}</span>
                      ))}
                    </dd>
                  </div>
                </dl>
                <div className="hse-classifier__card-detail">
                  <div>
                    <h4>Что проверить в допуске</h4>
                    <ul>
                      {entry.permits.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Компетенции</h4>
                    <ul>
                      {entry.competencies.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Темы обучения</h4>
                    <ul>
                      {entry.training_modules.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="hse-classifier__empty">
              В демонстрационной выборке нет такой комбинации. Сбросьте один из
              фильтров: отсутствие карточки не означает отсутствие работы или
              опасности на объекте.
            </p>
          )}
        </div>
      </section>

      <section
        className="hse-classifier__downloads"
        aria-labelledby="classifier-downloads"
      >
        <div>
          <p className="hse-classifier__kicker">Открытые данные и лид-магнит</p>
          <h2 id="classifier-downloads">Скачайте данные или рабочий шаблон</h2>
          <p>
            JSON и CSV содержат текущий демонстрационный набор. XLSX-шаблон
            предназначен для сбора локальных названий, источников и статусов
            проверки на одном объекте.
          </p>
        </div>
        <div className="hse-classifier__download-links">
          <a
            data-cta="classifier-json"
            href="/data/hse-energy-work-classifier.json"
          >
            Данные JSON
          </a>
          <a
            data-cta="classifier-csv"
            href="/data/hse-energy-work-classifier.csv"
          >
            Данные CSV
          </a>
          <a
            data-cta="high-risk-map-xlsx"
            href="/downloads/karta-rabot-povyshennoi-opasnosti-energy.xlsx"
          >
            Шаблон карты XLSX
          </a>
          <a
            data-cta="high-risk-map-csv"
            href="/downloads/karta-rabot-povyshennoi-opasnosti-energy.csv"
          >
            Шаблон карты CSV
          </a>
        </div>
      </section>

      <section aria-labelledby="classifier-products">
        <p className="hse-classifier__kicker">Как перейти к внедрению</p>
        <h2 id="classifier-products">Продуктовая лестница</h2>
        <div className="hse-classifier__products">
          {classifier.product_ladder.map((item) => (
            <article key={item.name}>
              <span>{item.stage}</span>
              <h3>{item.name}</h3>
              <p>{item.result}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="classifier-sources">
        <p className="hse-classifier__kicker">Источники для навигации</p>
        <h2 id="classifier-sources">Нормативные источники</h2>
        <p>
          Перед практическим применением проверяйте действующую редакцию,
          область применения и локальные документы организации.
        </p>
        <ol className="hse-classifier__sources">
          {classifier.sources.map((source) => (
            <li key={source.id}>
              <a href={source.url} target="_blank" rel="noreferrer">
                {source.title}
              </a>
              <p>{source.note}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
