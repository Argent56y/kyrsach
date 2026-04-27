import { useMemo, useState } from 'react';
import { useBuild } from './hooks/useBuild.js';
import { useXmlData } from './hooks/useXmlData.js';

function formatPrice(value, currency) {
  return new Intl.NumberFormat(currency === 'BYN' ? 'ru-BY' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

function getProductHighlights(product) {
  return [
    product.tier,
    product.powerWatts ? `${product.powerWatts} Вт` : '',
    product.score ? `${product.score}/100` : '',
    product.socket,
    product.vramGb ? `${product.vramGb} ГБ VRAM` : '',
    product.capacityGb ? `${product.capacityGb} ГБ` : '',
    product.connection
  ].filter(Boolean);
}

export default function App() {
  const { data, error, isLoading } = useXmlData();
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [focusedProductId, setFocusedProductId] = useState('');
  const categories = data?.categories || [];
  const {
    selectedProductIds,
    selectedItems,
    selectedCount,
    total,
    compatibility,
    selectProduct,
    clearBuild
  } = useBuild(categories);
  const activeCategory = useMemo(() => {
    return categories.find(category => category.id === activeCategoryId) || categories[0];
  }, [activeCategoryId, categories]);
  const focusedProduct = useMemo(() => {
    const products = categories.flatMap(category => category.products);
    return products.find(product => product.id === focusedProductId) || activeCategory?.products[0];
  }, [activeCategory, categories, focusedProductId]);
  const totalProducts = categories.reduce((sum, category) => sum + category.products.length, 0);
  const requiredCount = categories.filter(category => category.required).length;
  const requiredSelectedCount = selectedItems.filter(item => item.category.required).length;
  const isSummaryReady = requiredCount > 0 && requiredSelectedCount === requiredCount;
  const statusText = isLoading
    ? 'Загрузка XML-данных'
    : error
      ? 'Ошибка загрузки XML'
      : `Выбрано ${selectedCount} из ${categories.length} разделов`;
  const handleCategoryChange = category => {
    setActiveCategoryId(category.id);
    setFocusedProductId(selectedProductIds[category.id] || category.products[0]?.id || '');
  };
  const handleSelectProduct = (categoryId, productId) => {
    selectProduct(categoryId, productId);
    setFocusedProductId(productId);
  };

  return (
    <div className="react-configurator">
      <aside className="react-configurator__sidebar" aria-label="Категории конфигуратора">
        <p className="react-configurator__label">Сборка рабочего места</p>
        <h2 className="react-configurator__title">Категории</h2>
        <p className="react-configurator__text">
          Выберите раздел, чтобы посмотреть доступные компоненты из XML-каталога.
        </p>

        {isLoading && <p className="react-configurator__text">Загружаем список категорий...</p>}

        {!isLoading && !error && (
          <nav className="configurator-categories">
            {categories.map(category => (
              <button
                className={`configurator-categories__item${category.id === activeCategory?.id ? ' configurator-categories__item--active' : ''}`}
                key={category.id}
                type="button"
                aria-pressed={category.id === activeCategory?.id}
                onClick={() => handleCategoryChange(category)}
              >
                <span className="configurator-categories__order">
                  {String(category.order).padStart(2, '0')}
                </span>
                <span>
                  <strong>{category.name}</strong>
                  <small>
                    {selectedProductIds[category.id] ? 'выбрано' : `${category.products.length} товаров`}
                  </small>
                </span>
              </button>
            ))}
          </nav>
        )}
      </aside>

      <section className="react-configurator__workspace" aria-label="Данные конфигуратора">
        <div className={`react-configurator__status${error ? ' react-configurator__status--error' : ''}`}>
          <span className="react-configurator__pulse" aria-hidden="true"></span>
          <span>{statusText}</span>
        </div>

        {isLoading && (
          <div className="react-configurator__grid" aria-busy="true">
            {Array.from({ length: 4 }, (_, index) => (
              <article className="react-configurator__item react-configurator__item--loading" key={index}>
                <span className="react-configurator__index">...</span>
                <h3>Загрузка</h3>
                <p>Читаем категории из XML-файла.</p>
              </article>
            ))}
          </div>
        )}

        {error && (
          <div className="react-configurator__notice" role="alert">
            <h3>XML не прочитан</h3>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="configurator-layout">
            <div className="configurator-products">
              <header className="configurator-products__header">
                <div>
                  <p className="react-configurator__label">
                    {activeCategory.required ? 'Обязательный раздел' : 'Опциональный раздел'}
                  </p>
                  <h3>{activeCategory.name}</h3>
                  <p>{activeCategory.description}</p>
                </div>
                <div className="configurator-products__price">
                  <span>от</span>
                  <strong>{formatPrice(activeCategory.priceFrom, data.meta.currency)}</strong>
                </div>
              </header>

              <div className="configurator-products__grid">
                {activeCategory.products.map(product => (
                  <article
                    className={`configurator-product${selectedProductIds[activeCategory.id] === product.id ? ' configurator-product--selected' : ''}`}
                    key={product.id}
                  >
                    <div>
                      <span className="configurator-product__brand">{product.brand || product.tier}</span>
                      <h4>{product.name}</h4>
                      <p>{product.specs}</p>
                    </div>
                    <div className="configurator-product__chips">
                      {getProductHighlights(product).map(item => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                    <div className="configurator-product__footer">
                      <strong>{formatPrice(product.price, data.meta.currency)}</strong>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct(activeCategory.id, product.id)}
                      >
                        {selectedProductIds[activeCategory.id] === product.id ? 'Выбрано' : 'Выбрать'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="build-summary" aria-label="Сводка сборки">
              <p className="react-configurator__label">Итоги выбора</p>
              <h3>Текущая сборка</h3>
              <dl className="build-summary__stats">
                <div>
                  <dt>Выбрано</dt>
                  <dd>{selectedCount}/{categories.length}</dd>
                </div>
                <div>
                  <dt>Товаров</dt>
                  <dd>{totalProducts}</dd>
                </div>
                <div>
                  <dt>Обязательных</dt>
                  <dd>{requiredCount}</dd>
                </div>
              </dl>
              <div className="build-summary__total">
                <span>Итого</span>
                <strong>{formatPrice(total, data.meta.currency)}</strong>
              </div>
              <div className={`build-summary__compat build-summary__compat--${compatibility.status}`}>
                <span>Совместимость</span>
                <strong>{compatibility.status === 'ok' ? 'OK' : 'Нужно проверить'}</strong>
                <p>
                  Потребление: {compatibility.estimatedPower} Вт
                  {compatibility.psuPower ? ` / PSU ${compatibility.psuPower} Вт` : ''}
                </p>
              </div>
              {compatibility.issues.length > 0 && (
                <ul className="build-summary__issues">
                  {compatibility.issues.map(issue => (
                    <li key={`${issue.type}-${issue.message}`}>{issue.message}</li>
                  ))}
                </ul>
              )}
              {selectedItems.length > 0 && (
                <div className="build-summary__selected">
                  <span>Выбранные компоненты</span>
                  {selectedItems.map(item => (
                    <button
                      key={`${item.category.id}-${item.product.id}`}
                      type="button"
                      onClick={() => handleCategoryChange(item.category)}
                    >
                      <strong>{item.category.name}</strong>
                      <small>{item.product.name}</small>
                    </button>
                  ))}
                </div>
              )}
              {focusedProduct && (
                <div className="build-summary__focus">
                  <span>В фокусе</span>
                  <strong>{focusedProduct.name}</strong>
                  <p>{formatPrice(focusedProduct.price, data.meta.currency)} · {focusedProduct.specs}</p>
                </div>
              )}
              <a
                className={`build-summary__order${isSummaryReady ? '' : ' build-summary__order--disabled'}`}
                href={isSummaryReady ? 'summary.html' : undefined}
                aria-disabled={!isSummaryReady}
                onClick={event => {
                  if (!isSummaryReady) {
                    event.preventDefault();
                  }
                }}
              >
                Итоговая сборка
              </a>
              {!isSummaryReady && (
                <p className="build-summary__hint">
                  Выберите обязательные разделы: {requiredSelectedCount}/{requiredCount}.
                </p>
              )}
              <button className="build-summary__clear" type="button" onClick={clearBuild}>
                Очистить сборку
              </button>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
