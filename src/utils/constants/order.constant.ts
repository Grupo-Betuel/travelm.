import { OrderStatusTypes } from '@shared/entities/OrderEntity';

export const orderStatusText: { [N in OrderStatusTypes]: string } = {
  pending: 'Pendiente',
  'personal-assistance': 'Asistencia personal',
  confirmed: 'Confirmado',
  'checking-transfer': 'Verificando transferencia',
  'pending-info': 'Información pendiente',
  delivering: 'En camino',
  delivered: 'Entregado',
  canceled: 'Cancelado',
  'cancel-attempt': 'Intento de cancelación',
  completed: 'Completa',

};
