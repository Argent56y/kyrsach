document.addEventListener('DOMContentLoaded', () => {
  replaceIconSources();
  loadCategoriesFromXML();
  initFAQAccordion();
  initSliderNavigation();
  initNewsletterForm();
});

const iconPaths = {
  arrow_forward: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  keyboard_double_arrow_down: '<path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/>',
  west: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  east: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  expand_more: '<path d="m6 9 6 6 6-6"/>',
  memory: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.9 1.9 0 0 1 1.4-3.2H18a3 3 0 0 0 3-3C21 6.8 17 3 12 3Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14" cy="7.5" r="1"/>',
  speed: '<path d="M4 14a8 8 0 1 1 16 0"/><path d="m13 11 4-4"/><path d="M12 14h.01"/>',
  thermostat: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0Z"/><path d="M12 9v7"/>',
  verified_user: '<path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/>',
  support_agent: '<path d="M4 12a8 8 0 0 1 16 0"/><path d="M4 12v4a2 2 0 0 0 2 2h1v-6H4Z"/><path d="M20 12v4a2 2 0 0 1-2 2h-1v-6h3Z"/><path d="M15 19c-.8 1.2-1.8 2-3 2"/>',
  hub: '<circle cx="12" cy="12" r="2"/><circle cx="5" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="m7 7 3.5 3.5M17 7l-3.5 3.5M7 17l3.5-3.5M17 17l-3.5-3.5"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  keyboard: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01M7 14h10"/>',
  storage: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  table_restaurant: '<path d="M4 10h16"/><path d="M6 10l-2 9M18 10l2 9"/><path d="M8 5h8l2 5H6l2-5Z"/>',
  headset: '<path d="M4 13a8 8 0 0 1 16 0"/><path d="M4 13v4a2 2 0 0 0 2 2h2v-7H6a2 2 0 0 0-2 1Z"/><path d="M20 13v4a2 2 0 0 1-2 2h-2v-7h2a2 2 0 0 1 2 1Z"/>',
  chair: '<path d="M7 11V6a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v5"/><path d="M5 11h14v5H5z"/><path d="M8 16v5M16 16v5M7 21h10"/>',
  mouse: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/><path d="M12 3v4"/>',
  lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.9.8-1.5 1.8-1.5 3.5h-4c0-1.7-.6-2.7-1.5-3.5Z"/>',
  settings_input_component: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  settings_suggest: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H4v-3h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1v3h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
  shopping_cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20 8H7"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
  alternate_email: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
  rss_feed: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>'
};

function createIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = iconPaths[name] || iconPaths.settings_input_component;
  return svg;
}

function replaceIconSources() {
  document.querySelectorAll('.icon-source').forEach(node => {
    node.replaceWith(createIcon(node.textContent.trim()));
  });
}

function loadCategoriesFromXML() {
  const track = document.getElementById('slider-track');
  if (!track) return;

  fetch('src/data/configurator.xml')
    .then(response => {
      if (!response.ok) throw new Error('Не удалось загрузить XML');
      return response.text();
    })
    .then(xmlString => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
      const categories = xmlDoc.querySelectorAll('category');

      categories.forEach(category => {
        const name = category.querySelector('name').textContent;
        const icon = category.querySelector('icon').textContent;
        const priceFrom = category.querySelector('price_from').textContent;
        const image = category.querySelector('image').textContent;

        const card = createProductCard(name, icon, priceFrom, image);
        track.appendChild(card);
      });
    })
    .catch(error => {
      console.warn('XML fetch failed, using fallback data:', error);
      renderFallbackCategories(track);
    });
}

function createProductCard(name, icon, priceFrom, imageSrc) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = 'configurator.html';
  card.setAttribute('aria-label', `Открыть конфигуратор: ${name}`);

  card.innerHTML = `
    <div class="product-card__image">
      <img src="${imageSrc}" alt="${name}" />
      <div class="product-card__image-overlay"></div>
    </div>
    <div class="product-card__info">
      <div>
        <h3 class="product-card__name">${name}</h3>
        <p class="product-card__price">от $${priceFrom}</p>
      </div>
      <div class="product-card__icon">
        ${getIconMarkup(icon)}
      </div>
    </div>
  `;

  return card;
}

function getIconMarkup(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.settings_input_component}</svg>`;
}

function renderFallbackCategories(track) {
  const fallbackData = [
    { name: 'Мониторы', icon: 'monitor', priceFrom: '499', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAU1plefJY7ZxwM-6Q-4mzHqWZ2o2G-_fO3F2QIT9ooKrp1E8K5_LrIH21rqOsuMvfyjnnimiKdWJV8I-6VtCMVtkH8GGzH_2B_z3-GQRb1Rz8QePGBaZQrQ98BpoqONNQjSL81UFHaUm6w0c6HQ7-T8XXm5ZM6LixZTr7bAbvBeprCtaGLE1A3uIUldFpWP4O-dI9l3-6cHVA49jX-AJDmDtYtRE-kaZxySyIR_TaLkKtvNoredxz3V0LDk6vpJPr0FPeM9cGYQ' },
    { name: 'Клавиатуры', icon: 'keyboard', priceFrom: '149', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVulgQHeCjUvOs-Zx1wPkteq66WjlYpD7V2eCUjNQgHNuaXB8G2qCej4IPgsRcFNr3ApMn-sXJXcFqrUQtIYCkAhruCA2Csok7K872hHlDt-AUGRSIuyDRvO9YMwSP0xSeEzAu49B3MOWJ3NWzdLp1IcxH1EkwGfyTC9YuJEyedxttnrJkW1vI5Pa6neB3tq92rg_tnLtQJNWP7ZLKnaLoXAnm-nPRAsaYribsJqTuIpqFGqe-GTZePonhJ7y8y7Cqg-07yUCzFg' },
    { name: 'Столы', icon: 'table_restaurant', priceFrom: '899', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGDA88-xZURPqPhUqNKnx7RQ-bi1SYIrToZmCd6JvcUu39pBibfzo33geUKCws1PZek3q5xmyXY5S9ZIdgv0ZnaXWkpKZst4p9_9WD5MMsup3lb-H7DtowBWzHS5agGXu0eyup713sjk4WFUMDY0e9Lq_0fl_evGOiAKGCQsdkMA_jVo5wQwv9cElDKwJq9Qh6MHcqaI-cxShDL6C6lx28jmeFnif7p8nMQLVkLe95K-PmpMkWzOOCIGIsexODCu7SzKC-jXwEeQ' },
    { name: 'Аудио', icon: 'headset', priceFrom: '299', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3DgHriV2AV9T7F30zDN27b3p7KTc8Nb-H7Y5zF8QqBUQJO5juzK_LtBJ9p4mD6bt0AwP-XAFBgSXdBsuug1tBg0JSBJN1QhJVUKkpLtK9Uq0P-B432wRatkUPn52DIe2qUFK068-WLi5hFp2FlTpp4kc7aJwln54bI8uCcH_9urB9FTx-7fAtcMbTGk6D466fYAAzdfacfLTrVIs6NDvLYN4jMzq2oWxiWPfSq9zEzv6_GYBRh8Szm25XztVolFFmfi4iQqRz0A' }
  ];

  fallbackData.forEach(item => {
    const card = createProductCard(item.name, item.icon, item.priceFrom, item.image);
    track.appendChild(card);
  });
}

function initFAQAccordion() {
  const questions = document.querySelectorAll('.faq-item__question');

  questions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('faq-item--open');

      document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('faq-item--open');
      });

      if (!isOpen) {
        item.classList.add('faq-item--open');
      }
    });
  });
}

function initSliderNavigation() {
  const track = document.getElementById('slider-track');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = 320;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
  });
}
