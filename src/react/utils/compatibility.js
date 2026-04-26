const PSU_CATEGORY_ID = 'power';

function getSelectedByCategory(selectedItems, categoryId) {
  return selectedItems.find(item => item.category.id === categoryId)?.product;
}

export function checkCompatibility(categories, selectedItems) {
  const issues = [];
  const requiredCategories = categories.filter(category => category.required);
  const selectedRequiredIds = new Set(
    selectedItems
      .filter(item => item.category.required)
      .map(item => item.category.id)
  );

  requiredCategories.forEach(category => {
    if (!selectedRequiredIds.has(category.id)) {
      issues.push({
        type: 'missing',
        message: `Не выбран обязательный раздел: ${category.name}.`
      });
    }
  });

  const cpu = getSelectedByCategory(selectedItems, 'processors');
  const motherboard = getSelectedByCategory(selectedItems, 'motherboards');

  if (cpu && motherboard && cpu.socket && motherboard.socket && cpu.socket !== motherboard.socket) {
    issues.push({
      type: 'socket',
      message: `Сокет процессора ${cpu.socket} не совпадает с платой ${motherboard.socket}.`
    });
  }

  const psu = getSelectedByCategory(selectedItems, PSU_CATEGORY_ID);
  const estimatedPower = selectedItems
    .filter(item => item.category.id !== PSU_CATEGORY_ID)
    .reduce((sum, item) => sum + item.product.powerWatts, 0);
  const recommendedPower = estimatedPower ? Math.ceil(estimatedPower * 1.35) : 0;

  if (psu && recommendedPower > psu.powerWatts) {
    issues.push({
      type: 'power',
      message: `Рекомендуется минимум ${recommendedPower} Вт, выбранный блок питания дает ${psu.powerWatts} Вт.`
    });
  }

  return {
    status: issues.length ? 'warning' : 'ok',
    issues,
    estimatedPower,
    recommendedPower,
    psuPower: psu?.powerWatts || 0
  };
}
