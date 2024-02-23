export const ProductsConstants = {
  SOLD_OUT: 'Agotado',
  NEW_ITEM: 'Nuevo',
  ALMOST_SOLD_OUT: 'Casi Agotado',
  ONLY_X_QUANTITY: (q: number) => `Solo quedan ${q} unidades.`,
  ALMOST_SOLD_OUT_QUANTITY: 5,
  ADD_CART: 'Agregar a la Orden',
  VIEW_CART: 'Ver Orden',
  UPDATE_ORDER_IN_CART: 'Ir a Actualizar Orden',
  UPDATE_CART: 'Atualizar Orden',
  CONFIRM_CART_ORDER: 'Confirmar Orden',
  SEND_CART: 'Enviar Orden',
  NEXT: 'Siguiente',
};
