import { useMemo, useState } from 'react';
import { useXmlData } from './hooks/useXmlData.js';
import { readStoredSelection } from './utils/buildStorage.js';
import { checkCompatibility } from './utils/compatibility.js';
import { calculateTotal } from './utils/price.js';

const PERFORMANCE_CATEGORIES = [
  ['processors', 'Процессор'],
  ['graphics', 'Графика'],
  ['memory', 'Память'],
  ['storage', 'Накопитель'],
  ['monitors', 'Монитор'],
  ['power', 'Питание']
];

function formatPrice(value, currency) {
  return new Intl.NumberFormat(currency === 'BYN' ? 'ru-BY' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

function getSelectedItems(categories, selectedProductIds) {
  return categories.flatMap(category => {
    const selectedId = selectedProductIds[category.id];
    const product = category.products.find(item => item.id === selectedId);
    return product ? [{ category, product }] : [];
  });
}

function getStoreLinks(productName) {
  const query = encodeURIComponent(productName);
  const googleQuery = encodeURIComponent(`${productName} купить Беларусь`);

  return [
    { label: 'Onliner', href: `https://catalog.onliner.by/search?query=${query}` },
    { label: 'Kufar', href: `https://www.kufar.by/l?query=${query}` },
    { label: '21vek', href: `https://www.21vek.by/search/?term=${query}` },
    { label: 'Поиск BY', href: `https://www.google.com/search?q=${googleQuery}` }
  ];
}

function OrderForm({ selectedItems, total, currency }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="summary-order summary-order--success" role="status">
        <span className="summary-page__label">Заявка отправлена</span>
        <h3>Менеджер получил состав сборки</h3>
        <p>Мы свяжемся с вами для уточнения деталей сборки и удобного времени доставки.</p>
      </div>
    );
  }

  return (
    <form
      className="summary-order"
      onSubmit={event => {
        event.preventDefault();
        setIsSubmitted(true);
      }}
    >
      <span className="summary-page__label">Финальный шаг</span>
      <h3>Заказать сборку</h3>
      <p>
        В заявке будет {selectedItems.length} позиций на сумму {formatPrice(total, currency)}.
      </p>
      <label>
        <span>Имя</span>
        <input type="text" name="name" placeholder="Ваше имя" required />
      </label>
      <label>
        <span>Телефон или email</span>
        <input type="text" name="contact" placeholder="+375 или email" required />
      </label>
      <label>
        <span>Комментарий</span>
        <textarea name="comment" rows="4" placeholder="Удобное время связи или пожелания" />
      </label>
      <button type="submit">Заказать</button>
    </form>
  );
}

export default function Summary() {
  const { data, error, isLoading } = useXmlData();
  const [selectedProductIds] = useState(() => readStoredSelection());

  const categories = data?.categories || [];
  const selectedItems = useMemo(
    () => getSelectedItems(categories, selectedProductIds),
    [categories, selectedProductIds]
  );
  const total = useMemo(() => calculateTotal(selectedItems), [selectedItems]);
  const compatibility = useMemo(
    () => checkCompatibility(categories, selectedItems),
    [categories, selectedItems]
  );
  const requiredCategories = categories.filter(category => category.required);
  const requiredSelectedIds = new Set(
    selectedItems.filter(item => item.category.required).map(item => item.category.id)
  );
  const missingRequired = requiredCategories.filter(category => !requiredSelectedIds.has(category.id));
  const currency = data?.meta.currency || 'BYN';
  const performanceRows = PERFORMANCE_CATEGORIES.map(([categoryId, label]) => {
    const item = selectedItems.find(selected => selected.category.id === categoryId);
    return item ? { label, item, score: Math.max(0, Math.min(100, item.product.score || 0)) } : null;
  }).filter(Boolean);
  const averageScore = performanceRows.length
    ? Math.round(performanceRows.reduce((sum, row) => sum + row.score, 0) / performanceRows.length)
    : 0;

  if (isLoading) {
    return (
      <div className="summary-page__state">
        <span className="summary-page__label">Загрузка</span>
        <h1>Собираем итоговую спецификацию</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-page__state">
        <span className="summary-page__label">Ошибка</span>
        <h1>XML-каталог не загрузился</h1>
        <p>{error}</p>
        <a href="configurator.html">Вернуться в конфигуратор</a>
      </div>
    );
  }

  if (!selectedItems.length || missingRequired.length) {
    return (
      <div className="summary-page__state">
        <span className="summary-page__label">Сборка не завершена</span>
        <h1>Выберите обязательные комплектующие</h1>
        <p>
          Для итоговой страницы нужны все обязательные разделы. Осталось выбрать:{' '}
          {missingRequired.length ? missingRequired.map(category => category.name).join(', ') : 'компоненты'}.
        </p>
        <a href="configurator.html">Собрать конфигурацию</a>
      </div>
    );
  }

  return (
    <div className="summary-page">
      <section className="summary-hero" aria-labelledby="summary-title">
        <div>
          <span className="summary-page__label">Итоговая спецификация</span>
          <h1 id="summary-title">MONOSPACE Build #{selectedItems.length}{averageScore}</h1>
          <p>
            Сборка готова к заказу: обязательные комплектующие выбраны, стоимость рассчитана,
            производительность сведена по ключевым узлам.
          </p>
        </div>
        <div className="summary-hero__metrics" aria-label="Главные показатели сборки">
          <div>
            <span>Стоимость</span>
            <strong>{formatPrice(total, currency)}</strong>
          </div>
          <div>
            <span>Производительность</span>
            <strong>{averageScore}/100</strong>
          </div>
          <div>
            <span>Совместимость</span>
            <strong>{compatibility.status === 'ok' ? 'OK' : 'Проверить'}</strong>
          </div>
        </div>
      </section>

      <section className="summary-layout">
        <div className="summary-main">
          <section className="summary-section" aria-labelledby="parts-title">
            <div className="summary-section__header">
              <span className="summary-page__label">Состав</span>
              <h2 id="parts-title">Выбранные комплектующие</h2>
            </div>
            <div className="summary-parts">
              {selectedItems.map(({ category, product }) => (
                <article className="summary-part" key={`${category.id}-${product.id}`}>
                  <div>
                    <span>{category.name}</span>
                    <h3>{product.name}</h3>
                    <p>{product.specs}</p>
                  </div>
                  <strong>{formatPrice(product.price, currency)}</strong>
                  <div className="summary-part__links" aria-label={`Поиск ${product.name} в магазинах`}>
                    {getStoreLinks(product.name).map(link => (
                      <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="summary-section" aria-labelledby="performance-title">
            <div className="summary-section__header">
              <span className="summary-page__label">Тесты</span>
              <h2 id="performance-title">Диаграмма производительности</h2>
            </div>
            <div className="performance-chart">
              {performanceRows.map(row => (
                <div className="performance-chart__row" key={row.item.category.id}>
                  <div className="performance-chart__meta">
                    <span>{row.label}</span>
                    <strong>{row.score}/100</strong>
                  </div>
                  <div className="performance-chart__track" aria-hidden="true">
                    <span style={{ width: `${row.score}%` }}></span>
                  </div>
                  <p>{row.item.product.name}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="summary-aside" aria-label="Итоги и заказ">
          <section className={`summary-check summary-check--${compatibility.status}`}>
            <span className="summary-page__label">Совместимость</span>
            <h2>{compatibility.status === 'ok' ? 'Конфликтов нет' : 'Нужно проверить'}</h2>
            <p>
              Потребление: {compatibility.estimatedPower} Вт. Рекомендуемый запас БП:{' '}
              {compatibility.recommendedPower || 0} Вт. Выбранный БП: {compatibility.psuPower || 0} Вт.
            </p>
            {compatibility.issues.length > 0 && (
              <ul>
                {compatibility.issues.map(issue => (
                  <li key={`${issue.type}-${issue.message}`}>{issue.message}</li>
                ))}
              </ul>
            )}
          </section>

          <OrderForm selectedItems={selectedItems} total={total} currency={currency} />
        </aside>
      </section>
    </div>
  );
}
