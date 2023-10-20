export const ProductsConstants = {
  SOLD_OUT: 'Agotado',
  ALMOST_SOLD_OUT: 'Casi Agotado',
  ONLY_X_QUANTITY: (q: number) => `Solo quedan ${q} unidades.`,
  ALMOST_SOLD_OUT_QUANTITY: 10,
  ADD_CART: 'Agregar al pedido',
  VIEW_CART: 'Ver Orden',
};
