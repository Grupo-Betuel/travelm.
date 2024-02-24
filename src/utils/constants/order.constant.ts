import { OrderStatusTypes } from '@shared/entities/OrderEntity';
import { ProductEntity } from '@shared/entities/ProductEntity';

export const orderStatusText: { [N in OrderStatusTypes]: string } = {
  pending: 'Pendiente',
  'personal-assistance': 'Asistencia personal',
  'pending-confirm': 'Orden pendiente de confirmación',
  confirmed: 'Confirmado',
  'checking-transfer': 'Verificando transferencia',
  'pending-info': 'Información pendiente',
  delivering: 'En camino',
  delivered: 'Entregado',
  canceled: 'Cancelado',
  'cancel-attempt': 'Intento de cancelación',
  completed: 'Completa',
};

export const orderMessageTexts = {
  orderItemByWhatsapp: ({ shortID, company, ...product }: ProductEntity) => `Hola ${company} vi su tienda en la página ecommerce, este es el código del producto que me interesa => ${shortID}`,
};
