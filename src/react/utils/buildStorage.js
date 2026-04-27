export const BUILD_STORAGE_KEY = 'monospace-configurator-build';

export function readStoredSelection() {
  try {
    const value = window.localStorage.getItem(BUILD_STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

export function normalizeSelection(categories, selectedProductIds) {
  return Object.fromEntries(
    categories
      .map(category => {
        const selectedId = selectedProductIds[category.id];
        const productExists = category.products.some(product => product.id === selectedId);
        return productExists ? [category.id, selectedId] : null;
      })
      .filter(Boolean)
  );
}
