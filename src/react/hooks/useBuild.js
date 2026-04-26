import { useEffect, useMemo, useState } from 'react';
import { checkCompatibility } from '../utils/compatibility.js';
import { calculateTotal } from '../utils/price.js';

const STORAGE_KEY = 'monospace-configurator-build';

function readStoredSelection() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch {
    return {};
  }
}

function normalizeSelection(categories, selectedProductIds) {
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

export function useBuild(categories) {
  const [selectedProductIds, setSelectedProductIds] = useState(() => readStoredSelection());

  useEffect(() => {
    if (!categories.length) return;
    setSelectedProductIds(current => normalizeSelection(categories, current));
  }, [categories]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProductIds));
  }, [selectedProductIds]);

  const selectedItems = useMemo(() => {
    return categories.flatMap(category => {
      const selectedId = selectedProductIds[category.id];
      const product = category.products.find(item => item.id === selectedId);
      return product ? [{ category, product }] : [];
    });
  }, [categories, selectedProductIds]);

  const total = useMemo(() => calculateTotal(selectedItems), [selectedItems]);
  const compatibility = useMemo(
    () => checkCompatibility(categories, selectedItems),
    [categories, selectedItems]
  );

  function selectProduct(categoryId, productId) {
    setSelectedProductIds(current => ({
      ...current,
      [categoryId]: productId
    }));
  }

  function clearBuild() {
    setSelectedProductIds({});
  }

  return {
    selectedProductIds,
    selectedItems,
    selectedCount: selectedItems.length,
    total,
    compatibility,
    selectProduct,
    clearBuild
  };
}
