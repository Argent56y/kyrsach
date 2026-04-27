function getText(parent, selector, fallback = '') {
  return parent.querySelector(selector)?.textContent.trim() || fallback;
}

function getNumber(parent, selector, fallback = 0) {
  const value = Number(getText(parent, selector, fallback));
  return Number.isFinite(value) ? value : fallback;
}

function getBooleanAttribute(node, name) {
  return node.getAttribute(name) === 'true';
}

function parseProduct(productNode) {
  return {
    id: productNode.getAttribute('id'),
    tier: productNode.getAttribute('tier') || 'standard',
    name: getText(productNode, 'name'),
    brand: getText(productNode, 'brand'),
    specs: getText(productNode, 'specs'),
    price: getNumber(productNode, 'price'),
    powerWatts: getNumber(productNode, 'power_watts'),
    score: getNumber(productNode, 'score'),
    socket: getText(productNode, 'socket'),
    vramGb: getNumber(productNode, 'vram_gb'),
    capacityGb: getNumber(productNode, 'capacity_gb'),
    memoryType: getText(productNode, 'memory_type'),
    connection: getText(productNode, 'connection'),
    diagonalInches: getNumber(productNode, 'diagonal_inches'),
    refreshRateHz: getNumber(productNode, 'refresh_rate_hz'),
    widthCm: getNumber(productNode, 'width_cm')
  };
}

function parseCategory(categoryNode) {
  const products = Array.from(categoryNode.querySelectorAll(':scope > products > product'))
    .map(parseProduct);

  return {
    id: categoryNode.getAttribute('id'),
    required: getBooleanAttribute(categoryNode, 'required'),
    order: Number(categoryNode.getAttribute('order')) || 0,
    name: getText(categoryNode, 'name'),
    icon: getText(categoryNode, 'icon', 'settings_input_component'),
    priceFrom: getNumber(categoryNode, 'price_from'),
    image: getText(categoryNode, 'image'),
    description: getText(categoryNode, 'description'),
    products
  };
}

export function parseConfiguratorXml(xmlString) {
  const document = new DOMParser().parseFromString(xmlString, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error('XML содержит ошибку разметки');
  }

  const categories = Array.from(document.querySelectorAll('configurator > categories > category'))
    .map(parseCategory)
    .sort((a, b) => a.order - b.order);

  return {
    meta: {
      title: getText(document, 'meta > title'),
      currency: getText(document, 'meta > currency', 'BYN'),
      updated: getText(document, 'meta > updated')
    },
    categories
  };
}
