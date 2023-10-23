export const ProductsConstants = {
  SOLD_OUT: 'Agotado',
  ALMOST_SOLD_OUT: 'Casi Agotado',
  ONLY_X_QUANTITY: (q: number) => `Solo quedan ${q} unidades.`,
  ALMOST_SOLD_OUT_QUANTITY: 10,
  ADD_CART: 'Agregar a la Orden',
  VIEW_CART: 'Ver Orden',
  UPDATE_CART: 'Atualizar Orden',
  SEND_CART: 'Enviar Orden',
  NEXT: 'Siguiente',
};
