export function calculateTotal(selectedItems) {
  return selectedItems.reduce((sum, item) => sum + item.product.price, 0);
}
