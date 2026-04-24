const milestones = [
  'Категории из XML',
  'Карточки компонентов',
  'Итоговая сборка',
  'Совместимость'
];

export default function App() {
  return (
    <div className="react-configurator">
      <aside className="react-configurator__sidebar" aria-label="Этапы конфигуратора">
        <p className="react-configurator__label">React core</p>
        <h2 className="react-configurator__title">Ядро подключено</h2>
        <p className="react-configurator__text">
          Vite и React работают только внутри страницы конфигуратора. Главный лендинг остается обычным HTML/CSS/JS.
        </p>
      </aside>

      <section className="react-configurator__workspace" aria-label="Будущая рабочая область">
        <div className="react-configurator__status">
          <span className="react-configurator__pulse" aria-hidden="true"></span>
          <span>Готово к разработке интерфейса</span>
        </div>

        <div className="react-configurator__grid">
          {milestones.map((item, index) => (
            <article className="react-configurator__item" key={item}>
              <span className="react-configurator__index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{item}</h3>
              <p>Будет реализовано в следующих частях проекта.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
